"use client";

// TradeCard renders ONLY ValidatedTrade — the type system guarantees no
// pending/unvalidated candidate can reach this component.

import type { ValidatedTrade } from "@/lib/state";
import { formatMoney, salaryBadge } from "@/lib/salary";

export function TradeCard({
  trade,
  option,
  userTeamColor,
}: {
  trade: ValidatedTrade;
  option: number;
  userTeamColor: string;
}) {
  const badge = salaryBadge(trade.salarySavings);
  const style = {
    "--team-a": userTeamColor,
    "--team-b": trade.opposingTeam.primaryColor,
  } as React.CSSProperties;

  return (
    <article
      className="trade-card flex h-full flex-col"
      style={style}
      data-testid="trade-card"
      aria-label={`Trade option ${option}`}
    >
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="display text-sm text-[var(--amber)]">Option #{option}</span>
        <span className="chip chip-ok display" title={trade.apiSummary}>
          ✓ Valid
        </span>
      </header>

      <div className="grid grid-cols-2 gap-2 px-3 pb-3 grow">
        <section className="side-a rounded-md bg-[var(--panel)] px-3 py-2">
          <h4 className="display text-[0.65rem] text-[var(--ink-dim)] mb-1.5">You send</h4>
          <ul className="space-y-1.5">
            {trade.outgoing.map((p) => (
              <li key={p.id} className="text-sm leading-tight">
                <span className="block text-[var(--ink)]">{p.name}</span>
                <span className="tabular text-xs text-[var(--ink-dim)]">
                  {p.position} · {formatMoney(p.salary)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="side-b rounded-md bg-[var(--panel)] px-3 py-2">
          <h4 className="display text-[0.65rem] text-[var(--ink-dim)] mb-1.5">You receive</h4>
          <ul className="space-y-1.5">
            <li className="text-sm leading-tight">
              <span className="block text-[var(--ink)]">{trade.incoming.name}</span>
              <span className="tabular text-xs text-[var(--ink-dim)]">
                {trade.incoming.position} · {formatMoney(trade.incoming.salary)}
              </span>
            </li>
          </ul>
        </section>
      </div>

      <footer className="flex items-center justify-between border-t border-[var(--line)] px-4 py-2.5">
        <span className={`badge badge-${badge.kind} tabular`}>{badge.label}</span>
        <span className="text-xs text-[var(--ink-dim)]">
          vs {trade.opposingTeam.city} {trade.opposingTeam.name}
        </span>
      </footer>
    </article>
  );
}
