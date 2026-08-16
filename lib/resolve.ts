// Deterministic name resolution — identity is decided by app code, never the LLM.

import type { Player, Team } from "./state";

export type TeamResolution =
  | { status: "matched"; team: Team }
  | { status: "ambiguous"; candidates: Team[] }
  | { status: "not_found" };

export type PlayerResolution =
  | { status: "matched"; player: Player }
  | { status: "ambiguous"; candidates: Player[] }
  | { status: "not_found" };

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Match by city, nickname, "city nickname", or abbreviation; substring on the
 *  combined label. Exact label/abbreviation match wins over substring hits. */
export function resolveTeam(query: string, teams: Team[]): TeamResolution {
  const q = norm(query);
  if (!q) return { status: "not_found" };

  const exact = teams.filter(
    (t) =>
      norm(t.city) === q ||
      norm(t.name) === q ||
      norm(`${t.city} ${t.name}`) === q ||
      norm(t.abbreviation) === q,
  );
  if (exact.length === 1) return { status: "matched", team: exact[0] };
  if (exact.length > 1) return { status: "ambiguous", candidates: exact };

  const partial = teams.filter((t) =>
    norm(`${t.city} ${t.name} ${t.abbreviation}`).includes(q),
  );
  if (partial.length === 1) return { status: "matched", team: partial[0] };
  if (partial.length > 1) return { status: "ambiguous", candidates: partial };
  return { status: "not_found" };
}

/** Substring match over full player names; a unique exact full-name match wins
 *  over multiple substring hits (human plan: full name not required if the
 *  input uniquely identifies a player). Free agents are still FOUND here so
 *  the caller can explain they cannot be traded. */
export function resolvePlayer(query: string, players: Player[]): PlayerResolution {
  const q = norm(query);
  if (!q) return { status: "not_found" };

  const exact = players.filter((p) => norm(p.name) === q);
  if (exact.length === 1) return { status: "matched", player: exact[0] };
  if (exact.length > 1) return { status: "ambiguous", candidates: exact };

  const partial = players.filter((p) => norm(p.name).includes(q));
  if (partial.length === 1) return { status: "matched", player: partial[0] };
  if (partial.length > 1) {
    return { status: "ambiguous", candidates: partial.slice(0, 8) };
  }
  return { status: "not_found" };
}

/** Active roster for candidate generation: rostered, tradeable players only. */
export function activeRoster(teamId: number, players: Player[]): Player[] {
  return players.filter(
    (p) => p.teamId === teamId && p.signingStatus === "active" && p.salary > 0,
  );
}

export function isFreeAgent(p: Player): boolean {
  return p.signingStatus === "free-agent";
}
