"use client";

import { useState, useCallback } from "react";
import { analyzeDocumentation, analyzeLanguageCost, AnalysisResult, LanguageCostAnalysis } from "@/lib/tokenizer";
import { EXAMPLES, ExampleKey } from "@/lib/examples";
import { TokenBar } from "./components/TokenBar";
import { SavingsCard } from "./components/SavingsCard";
import { ScaleProjection } from "./components/ScaleProjection";
import { LanguageCost } from "./components/LanguageCost";

export default function Home() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [langAnalysis, setLangAnalysis] = useState<LanguageCostAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!input.trim()) return;
    setIsAnalyzing(true);

    // Small delay for visual feedback
    setTimeout(() => {
      const result = analyzeDocumentation(input);
      setAnalysis(result);

      // Run language comparison if we have structured data
      if (result.parsed) {
        const langResult = analyzeLanguageCost(result.parsed);
        setLangAnalysis(langResult);
      } else {
        setLangAnalysis(null);
      }

      setIsAnalyzing(false);
    }, 150);
  }, [input]);

  const handleExample = useCallback((key: ExampleKey) => {
    const example = EXAMPLES[key];
    setInput(example);
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeDocumentation(example);
      setAnalysis(result);

      if (result.parsed) {
        const langResult = analyzeLanguageCost(result.parsed);
        setLangAnalysis(langResult);
      } else {
        setLangAnalysis(null);
      }

      setIsAnalyzing(false);
    }, 150);
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setAnalysis(null);
    setLangAnalysis(null);
  }, []);

  const maxTokens = analysis
    ? Math.max(...analysis.formats.map((f) => f.tokens))
    : 0;

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-accent-green">$</span> docs-cost-calc
            </h1>
            <p className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5">
              What your documentation costs AI to read
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://grzeti.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              by Ed Grzetich
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Input section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Paste your documentation
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                Try:
              </span>
              {(Object.keys(EXAMPLES) as ExampleKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleExample(key)}
                  className="font-mono text-[11px] text-accent-blue/80 hover:text-accent-blue bg-blue-500/5 hover:bg-blue-500/10 px-2 py-0.5 rounded transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste JSON, YAML, or any structured documentation here...\n\nExamples: OpenAPI specs, config objects, error code references, SDK response schemas`}
            className="w-full h-56 bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-y"
          />

          <div className="flex items-center justify-between mt-3">
            <div className="font-mono text-[11px] text-[var(--text-muted)]">
              {input.length > 0 && (
                <span>{input.length.toLocaleString()} characters</span>
              )}
            </div>
            <div className="flex gap-2">
              {input.length > 0 && (
                <button
                  onClick={handleClear}
                  className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-3 py-1.5 rounded border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing}
                className="font-mono text-xs font-medium text-white bg-accent-green hover:bg-green-500 disabled:bg-[var(--surface-3)] disabled:text-[var(--text-muted)] px-4 py-1.5 rounded transition-colors"
              >
                {isAnalyzing ? "Analyzing..." : "Calculate cost"}
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Savings summary */}
            {analysis.formats.length > 1 && (
              <SavingsCard analysis={analysis} />
            )}

            {/* Format comparison */}
            <section>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                Format comparison
              </h2>
              <div className="space-y-3">
                {analysis.formats.map((result, i) => (
                  <TokenBar
                    key={result.format}
                    result={result}
                    maxTokens={maxTokens}
                    isBest={i === 0}
                    isWorst={i === analysis.formats.length - 1}
                    index={i}
                  />
                ))}
              </div>
            </section>

            {/* Scale projection */}
            {analysis.formats.length > 1 && (
              <ScaleProjection analysis={analysis} />
            )}

            {/* Language cost comparison */}
            {langAnalysis && <LanguageCost analysis={langAnalysis} />}

            {/* Context note */}
            <footer className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
              <p className="font-mono text-[11px] text-[var(--text-muted)] leading-relaxed">
                Token counts use cl100k_base encoding (GPT-4, Claude). Costs
                estimated at GPT-4o input pricing ($2.50/1M tokens). Actual
                costs vary by model and provider. The format that costs the
                least to tokenize isn&apos;t always the format an LLM understands
                best. Structure, clarity, and schema consistency matter too.{" "}
                <a
                  href="https://grzeti.ch"
                  className="text-accent-blue/70 hover:text-accent-blue"
                >
                  Read my research →
                </a>
              </p>
            </footer>
          </div>
        )}

        {/* Empty state */}
        {!analysis && (
          <div className="text-center py-16">
            <div className="font-mono text-6xl mb-4 opacity-10">{ }</div>
            <p className="font-mono text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Paste structured documentation above to see how format choices
              affect the token cost of AI consumption. Try one of the examples
              to get started.
            </p>
          </div>
        )}
      </main>

      {/* Site footer */}
      <footer className="border-t border-[#c9bfb3] bg-[#f6f1eb]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-[15px] text-[#7a7168] leading-relaxed max-w-2xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
            Every time an AI coding tool reads your API docs, the tool spends
            tokens. Does the format of those docs affect the number of tokens?
            The code quality? We ran over 21,000 integration tests across 4 AI
            models and 2 APIs to find out.{" "}
            <a
              href="https://tokensnotjokin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c44b1a] hover:text-[#e8693a] transition-colors"
            >
              See the results →
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
