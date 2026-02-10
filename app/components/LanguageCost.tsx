"use client";

import { LanguageCostAnalysis } from "@/lib/tokenizer";

interface LanguageCostProps {
  analysis: LanguageCostAnalysis;
}

export function LanguageCost({ analysis }: LanguageCostProps) {
  const english = analysis.results.find((r) => r.language.code === "en");
  if (!english) return null;

  return (
    <div className="fade-in rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Language cost comparison
          </h3>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            Same docs, different languages
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {analysis.format} format
        </span>
      </div>

      <div className="space-y-3">
        {analysis.results.map((result, i) => {
          const percentage =
            (result.tokens / analysis.maxTokens) * 100;
          const isEnglish = result.language.code === "en";
          const delta = result.tokens - english.tokens;
          const deltaPercent =
            english.tokens > 0
              ? Math.round((delta / english.tokens) * 1000) / 10
              : 0;

          return (
            <div key={result.language.code}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{result.language.flag}</span>
                  <span className="font-mono text-xs text-[var(--text-primary)]">
                    {result.language.nativeLabel}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    ({result.language.label})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {!isEnglish && delta !== 0 && (
                    <span
                      className={`font-mono text-[10px] ${
                        delta > 0
                          ? "text-accent-amber"
                          : "text-accent-green"
                      }`}
                    >
                      {delta > 0 ? "+" : ""}
                      {deltaPercent}% vs English
                    </span>
                  )}
                  {isEnglish && (
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      baseline
                    </span>
                  )}
                  <span className="font-mono text-sm font-medium text-[var(--text-primary)] w-20 text-right">
                    {result.tokens.toLocaleString()}
                    <span className="text-[10px] text-[var(--text-muted)] ml-1">
                      tk
                    </span>
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bar-animate ${
                    isEnglish
                      ? "bg-accent-blue/50"
                      : delta > 0
                        ? "bg-accent-amber/50"
                        : "bg-accent-green/50"
                  }`}
                  style={{
                    width: `${percentage}%`,
                    animationDelay: `${i * 100 + 400}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <p className="font-mono text-[11px] text-[var(--text-muted)] leading-relaxed">
          BPE tokenizers fragment non-Latin scripts into more tokens per word.
          Chinese text often requires 2-3x more tokens than English for
          equivalent meaning. This directly impacts the cost of serving
          multilingual documentation through AI systems.
        </p>
      </div>
    </div>
  );
}
