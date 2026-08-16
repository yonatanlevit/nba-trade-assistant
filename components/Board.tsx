"use client";

// The Front Office Board — the GUI mirror. Renders exclusively from TradeState
// (the same object driving the chat), so chat/board sync is structural.

import { motion, useReducedMotion } from "motion/react";
import type { TradeState } from "@/lib/state";
import { REQUIRED_UNAVAILABLE_MESSAGE } from "@/lib/state";
import { formatMoney } from "@/lib/salary";
import { TradeCard } from "./TradeCard";

export function Board({
  state,
  loadingMore,
  onShowMore,
  onRetryValidation,
}: {
  state: TradeState;
  loadingMore: boolean;
  onShowMore: () => void;
  onRetryValidation: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const shown = state.results.slice(0, state.shownCount);
  const moreAvailable =
    state.results.length > state.shownCount || state.pendingCandidates.length > 0;
  const userColor = state.team?.primaryColor ?? "var(--amber)";

  return (
    <div className="flex h-full flex-col gap-4" data-testid="board">
      <CriteriaStrip state={state} />

      {state.validationUnavailable && (
        <div
          className="panel flex items-center justify-between gap-4 border-[color-mix(in_srgb,var(--alert)_40%,var(--line))] px-4 py-3"
          role="alert"
          data-testid="validation-error"
        >
          <p className="text-sm text-[var(--alert)]">{REQUIRED_UNAVAILABLE_MESSAGE}</p>
          <button
            onClick={onRetryValidation}
            disabled={loadingMore}
            className="chip chip-warn display cursor-pointer disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}

      <div className="min-h-0 grow overflow-y-auto pr-1">
        {!state.searched && shown.length === 0 ? (
          <EmptyCourt hasCriteria={state.team !== null || state.target !== null} />
        ) : shown.length === 0 && !state.validationUnavailable ? (
          <NoTrades />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {shown.map((trade, i) => (
                <motion.div
                  key={`${trade.incoming.id}-${trade.outgoing.map((p) => p.id).join("-")}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i % 9, 8) * 0.06 }}
                  className="h-full"
                >
                  <TradeCard trade={trade} option={i + 1} userTeamColor={userColor} />
                </motion.div>
              ))}
              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="skeleton h-44" aria-hidden />
                ))}
            </div>

            {moreAvailable && !loadingMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={onShowMore}
                  className="display cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--elevated)] px-6 py-2 text-sm text-[var(--amber)] hover:border-[var(--amber)]"
                  data-testid="show-more"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CriteriaStrip({ state }: { state: TradeState }) {
  return (
    <div className="panel flex flex-wrap items-center gap-3 px-4 py-3" data-testid="criteria-strip">
      <div className="flex items-center gap-2">
        <span className="display text-[0.65rem] text-[var(--ink-dim)]">Your team</span>
        {state.team ? (
          <span
            className="display rounded-md px-2.5 py-1 text-sm text-white"
            style={{ background: state.team.primaryColor }}
            data-testid="team-chip"
          >
            {state.team.city} {state.team.name}
          </span>
        ) : (
          <span className="chip" data-testid="team-chip">
            not set
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="display text-[0.65rem] text-[var(--ink-dim)]">Target</span>
        {state.target ? (
          <span className="chip text-[var(--ink)]" data-testid="target-chip">
            {state.target.name}
            <span className="tabular text-[var(--ink-dim)]">
              {state.target.position} · {formatMoney(state.target.salary)}
            </span>
          </span>
        ) : (
          <span className="chip" data-testid="target-chip">
            not set
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {state.searched && (
          <span className="chip tabular" data-testid="results-count">
            {state.results.length} valid
            {state.pendingCandidates.length > 0
              ? ` · ${state.pendingCandidates.length} unchecked`
              : ""}
          </span>
        )}
        <span
          className={
            state.confirmed
              ? "chip chip-ok display"
              : state.team && state.target
                ? "chip chip-warn display pulse-amber"
                : "chip display"
          }
          data-testid="confirmation-status"
        >
          {state.confirmed
            ? "Confirmed"
            : state.team && state.target
              ? "Awaiting confirmation"
              : "Setting criteria"}
        </span>
      </div>
    </div>
  );
}

function EmptyCourt({ hasCriteria }: { hasCriteria: boolean }) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 text-center">
      <svg width="180" height="120" viewBox="0 0 180 120" aria-hidden className="opacity-25">
        <rect x="1" y="1" width="178" height="118" rx="8" fill="none" stroke="var(--line)" strokeWidth="2" />
        <circle cx="90" cy="60" r="24" fill="none" stroke="var(--line)" strokeWidth="2" />
        <line x1="90" y1="1" x2="90" y2="119" stroke="var(--line)" strokeWidth="2" />
      </svg>
      <p className="max-w-xs text-sm text-[var(--ink-dim)]">
        {hasCriteria
          ? "Confirm your criteria in the chat and I'll fill this board with valid trades."
          : "Tell me who you're targeting — the board fills in as we talk."}
      </p>
    </div>
  );
}

function NoTrades() {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 text-center">
      <span className="display text-lg text-[var(--ink-dim)]">No valid trades</span>
      <p className="max-w-sm text-sm text-[var(--ink-dim)]">
        The league engine rejected every package for these criteria. Try a different
        target player.
      </p>
    </div>
  );
}
