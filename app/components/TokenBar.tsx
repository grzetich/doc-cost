"use client";

import { FormatResult } from "@/lib/tokenizer";

interface TokenBarProps {
  result: FormatResult;
  maxTokens: number;
  isBest: boolean;
  isWorst: boolean;
  index: number;
}

export function TokenBar({
  result,
  maxTokens,
  isBest,
  isWorst,
  index,
}: TokenBarProps) {
  const percentage = (result.tokens / maxTokens) * 100;

  const barColor = isBest
    ? "bg-accent-green"
    : isWorst
      ? "bg-accent-red/60"
      : "bg-accent-blue/50";

  const borderColor = isBest
    ? "border-green-600/30"
    : "border-[var(--border)]";

  return (
    <div
      className={`fade-in rounded-lg border p-4 ${borderColor} ${
        isBest ? "bg-green-50 glow-green" : "bg-[var(--surface-1)]"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-[var(--text-primary)]">
            {result.format}
          </span>
          {isBest && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent-green bg-green-100 px-2 py-0.5 rounded-full">
              Most efficient
            </span>
          )}
          {isWorst && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent-red bg-red-50 px-2 py-0.5 rounded-full">
              Most expensive
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="font-mono text-lg font-semibold text-[var(--text-primary)]">
            {result.tokens.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)] ml-1">
            tokens
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-3 bg-[var(--surface-3)] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full bar-animate ${barColor}`}
          style={{
            width: `${percentage}%`,
            animationDelay: `${index * 80 + 200}ms`,
          }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Characters" value={result.characters.toLocaleString()} />
        <Stat label="Lines" value={result.lines.toLocaleString()} />
        <Stat label="Tokens/line" value={result.tokensPerLine.toString()} />
        <Stat
          label="Cost/call"
          value={`$${result.estimatedCost.toFixed(6)}`}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
        {label}
      </div>
      <div className="font-mono text-xs text-[var(--text-secondary)]">
        {value}
      </div>
    </div>
  );
}
