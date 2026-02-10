"use client";

import { AnalysisResult } from "@/lib/tokenizer";

interface SavingsCardProps {
  analysis: AnalysisResult;
}

export function SavingsCard({ analysis }: SavingsCardProps) {
  const { savings } = analysis;

  return (
    <div className="fade-in rounded-lg border border-green-200 bg-green-50 p-5 glow-green">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-green">
          Potential savings
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat
          value={`${savings.percentReduction}%`}
          label="Token reduction"
          sublabel={`${savings.tokenReduction.toLocaleString()} fewer tokens`}
        />
        <BigStat
          value={savings.bestFormat}
          label="Most efficient format"
          sublabel="for AI consumption"
          isText
        />
        <BigStat
          value={`$${savings.costSavingsPerCall.toFixed(6)}`}
          label="Saved per call"
          sublabel="at GPT-4o input pricing"
        />
        <BigStat
          value={`$${savings.costSavingsPer10kCalls.toFixed(2)}`}
          label="Saved per 10K calls"
          sublabel="format choice at scale"
        />
      </div>
    </div>
  );
}

function BigStat({
  value,
  label,
  sublabel,
  isText,
}: {
  value: string;
  label: string;
  sublabel: string;
  isText?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-mono font-semibold text-[var(--text-primary)] mb-1 ${
          isText ? "text-sm" : "text-xl"
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </div>
      <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
        {sublabel}
      </div>
    </div>
  );
}
