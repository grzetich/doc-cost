import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";
import yaml from "js-yaml";

// Use cl100k_base (GPT-4/Claude) as default encoding
const encoder = new Tiktoken(cl100k_base);

export interface FormatResult {
  format: string;
  content: string;
  tokens: number;
  characters: number;
  lines: number;
  tokensPerLine: number;
  costPer1kTokens: number; // estimated at GPT-4o input pricing
  estimatedCost: number;
}

export interface AnalysisResult {
  original: FormatResult;
  formats: FormatResult[];
  parsed: Record<string, unknown> | null;
  savings: {
    bestFormat: string;
    tokenReduction: number;
    percentReduction: number;
    costSavingsPerCall: number;
    costSavingsPer10kCalls: number;
  };
}

// Current approximate pricing per 1K input tokens (GPT-4o)
const COST_PER_1K_TOKENS = 0.0025;

function countTokens(text: string): number {
  return encoder.encode(text).length;
}

function toYAML(parsed: Record<string, unknown>): string {
  return yaml.dump(parsed, {
    lineWidth: -1,
    noRefs: true,
    sortKeys: true,
  });
}

function toJSON(parsed: Record<string, unknown>): string {
  return JSON.stringify(parsed, null, 2);
}

function toJSONCompact(parsed: Record<string, unknown>): string {
  return JSON.stringify(parsed);
}

/**
 * Attempt to parse the input as structured data.
 * Tries JSON first, then YAML, then treats as raw text.
 */
function parseInput(
  input: string
): { parsed: Record<string, unknown> | null; detectedFormat: string } {
  // Try JSON
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "object" && parsed !== null) {
      return { parsed, detectedFormat: "JSON" };
    }
  } catch {
    // not JSON
  }

  // Try YAML
  try {
    const parsed = yaml.load(input);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        parsed: parsed as Record<string, unknown>,
        detectedFormat: "YAML",
      };
    }
  } catch {
    // not YAML
  }

  return { parsed: null, detectedFormat: "Plain Text" };
}

function buildFormatResult(
  format: string,
  content: string
): FormatResult {
  const tokens = countTokens(content);
  const lines = content.split("\n").length;
  return {
    format,
    content,
    tokens,
    characters: content.length,
    lines,
    tokensPerLine: Math.round((tokens / lines) * 10) / 10,
    costPer1kTokens: COST_PER_1K_TOKENS,
    estimatedCost:
      Math.round((tokens / 1000) * COST_PER_1K_TOKENS * 1000000) / 1000000,
  };
}

export function analyzeDocumentation(input: string): AnalysisResult {
  const trimmed = input.trim();
  const { parsed, detectedFormat } = parseInput(trimmed);

  const original = buildFormatResult(
    `Original (${detectedFormat})`,
    trimmed
  );

  const formats: FormatResult[] = [original];

  if (parsed) {
    // Generate alternative formats
    const yamlContent = toYAML(parsed);
    const jsonContent = toJSON(parsed);
    const jsonCompact = toJSONCompact(parsed);

    if (detectedFormat !== "YAML") {
      formats.push(buildFormatResult("YAML", yamlContent));
    }
    if (detectedFormat !== "JSON") {
      formats.push(buildFormatResult("JSON (Pretty)", jsonContent));
    }
    formats.push(buildFormatResult("JSON (Compact)", jsonCompact));
  }

  // Always add the raw text token count for comparison
  // This helps show overhead of structured formats vs prose
  if (parsed && detectedFormat !== "Plain Text") {
    // Create a minimal prose version by extracting values
    const plainText = extractPlainText(parsed);
    formats.push(buildFormatResult("Plain Text (values only)", plainText));
  }

  // Find best format
  const sorted = [...formats].sort((a, b) => a.tokens - b.tokens);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return {
    original,
    formats: sorted,
    parsed,
    savings: {
      bestFormat: best.format,
      tokenReduction: worst.tokens - best.tokens,
      percentReduction:
        Math.round(((worst.tokens - best.tokens) / worst.tokens) * 1000) / 10,
      costSavingsPerCall: worst.estimatedCost - best.estimatedCost,
      costSavingsPer10kCalls:
        Math.round(
          (worst.estimatedCost - best.estimatedCost) * 10000 * 100
        ) / 100,
    },
  };
}

function extractPlainText(
  obj: Record<string, unknown>,
  prefix = ""
): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      lines.push(
        extractPlainText(value as Record<string, unknown>, `${prefix}${key}: `)
      );
    } else if (Array.isArray(value)) {
      lines.push(`${prefix}${key}: ${value.join(", ")}`);
    } else {
      lines.push(`${prefix}${key}: ${value}`);
    }
  }
  return lines.join("\n");
}

// --- Language cost comparison ---

import { LANGUAGES, translateDoc, type LanguageOption } from "./languages";

export interface LanguageCostResult {
  language: LanguageOption;
  tokens: number;
  characters: number;
  costPerCall: number;
  tokenMultiplier: number; // vs English baseline
}

export interface LanguageCostAnalysis {
  format: string;
  results: LanguageCostResult[];
  maxTokens: number;
}

/**
 * Given a parsed object and a format serializer, compute token cost
 * for each supported language.
 */
export function analyzeLanguageCost(
  parsed: Record<string, unknown>
): LanguageCostAnalysis | null {
  // Use JSON as the consistent format for comparison
  const results: LanguageCostResult[] = [];
  let englishTokens = 0;

  for (const lang of LANGUAGES) {
    const translated = translateDoc(parsed, lang.code);
    const serialized = JSON.stringify(translated, null, 2);
    const tokens = countTokens(serialized);
    const characters = serialized.length;

    if (lang.code === "en") {
      englishTokens = tokens;
    }

    results.push({
      language: lang,
      tokens,
      characters,
      costPerCall:
        Math.round((tokens / 1000) * COST_PER_1K_TOKENS * 1000000) / 1000000,
      tokenMultiplier: 0, // calculated below
    });
  }

  // Calculate multipliers relative to English
  for (const r of results) {
    r.tokenMultiplier =
      englishTokens > 0
        ? Math.round((r.tokens / englishTokens) * 100) / 100
        : 1;
  }

  return {
    format: "JSON (Pretty)",
    results,
    maxTokens: Math.max(...results.map((r) => r.tokens)),
  };
}
