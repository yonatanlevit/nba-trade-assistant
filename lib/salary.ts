// Salary sign semantics — the Human Plan is the product contract.
//
// Product (user-facing):  salarySavings = total outgoing − target salary
//   positive → "Saved $X" · negative → "Added $X" · zero → "No salary change"
//
// bball-GM API representation: teams[].netSalaryChange = salaryIn − salaryOut
// (verified against the engine teardown example: out 57.1M, in 50.1M → −7M).
// The two are DIFFERENT VALUES with different signs; they never share a name.
// We compute salarySavings locally from roster data and never reuse the API
// field for the user-facing number.

import type { TradePlayer } from "./state";

/** Product semantics: outgoing total − target salary. */
export function salarySavings(outgoing: TradePlayer[], targetSalary: number): number {
  return totalSalary(outgoing) - targetSalary;
}

export function totalSalary(players: { salary: number }[]): number {
  return players.reduce((sum, p) => sum + p.salary, 0);
}

/** Convert the API's netSalaryChange (in − out) to product savings (out − in).
 *  Kept as an explicit named function so the sign flip is auditable. */
export function apiNetChangeToSavings(apiNetSalaryChange: number): number {
  return -apiNetSalaryChange;
}

/** "$12.3M" style compact money formatting for cards and chips. */
export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}K`;
  return `$${abs.toFixed(0)}`;
}

export type SalaryBadge =
  | { kind: "saved"; label: string }
  | { kind: "added"; label: string }
  | { kind: "even"; label: string };

export function salaryBadge(savings: number): SalaryBadge {
  if (savings > 0) return { kind: "saved", label: `SAVED ${formatMoney(savings)}` };
  if (savings < 0) return { kind: "added", label: `ADDED ${formatMoney(savings)}` };
  return { kind: "even", label: "NO SALARY CHANGE" };
}
