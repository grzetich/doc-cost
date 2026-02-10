"use client";

import { AnalysisResult } from "@/lib/tokenizer";

interface ScaleProjectionProps {
  analysis: AnalysisResult;
}

const SCALE_TIERS = [
  { calls: 1000, label: "1K" },
  { calls: 10000, label: "10K" },
  { calls: 100000, label: "100K" },
  { calls: 1000000, label: "1M" },
];

export function ScaleProjection({ analysis }: ScaleProjectionProps) {
  const best = analysis.formats[0];
  const worst = analysis.formats[analysis.formats.length - 1];

  return (
    <div className="fade-in rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Cost at scale
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          (GPT-4o input pricing)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="text-[var(--text-muted)] uppercase tracking-wider">
              <th className="text-left pb-3 pr-4">API Calls</th>
              <th className="text-right pb-3 px-4 text-accent-green">
                {best.format}
              </th>
              <th className="text-right pb-3 px-4 text-accent-red">
                {worst.format}
              </th>
              <th className="text-right pb-3 pl-4">You save</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            {SCALE_TIERS.map((tier) => {
              const bestCost = (best.tokens / 1000) * best.costPer1kTokens * tier.calls;
              const worstCost = (worst.tokens / 1000) * worst.costPer1kTokens * tier.calls;
              const saved = worstCost - bestCost;
              return (
                <tr
                  key={tier.label}
                  className="border-t border-[var(--border)]"
                >
                  <td className="py-2.5 pr-4 text-[var(--text-primary)] font-medium">
                    {tier.label} calls
                  </td>
                  <td className="py-2.5 px-4 text-right text-accent-green">
                    ${bestCost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-accent-red">
                    ${worstCost.toFixed(2)}
                  </td>
                  <td className="py-2.5 pl-4 text-right text-[var(--text-primary)] font-medium">
                    ${saved.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
