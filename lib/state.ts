// Domain types and the TradeState machine.
//
// The central trust guarantee lives in the type system: `ValidatedTrade` is a
// distinct tagged type constructed in exactly one place (lib/validation.ts,
// from a successful bball-GM validation response). Render components accept
// only `ValidatedTrade`, so pending/unvalidated candidates have no type-safe
// path into the UI.

export type Team = {
  id: number;
  name: string;
  city: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  totalSalary: number;
  capSpace: number;
  isOverCap: boolean;
  isOverLuxuryTax: boolean;
  isOverFirstApron: boolean;
  isOverSecondApron: boolean;
};

export type Player = {
  id: number;
  name: string;
  teamId: number;
  teamName: string;
  teamAbbreviation: string;
  position: string;
  salary: number;
  /** "active" | "free-agent" — free agents cannot be traded. */
  signingStatus: string;
};

export type TradePlayer = {
  id: number;
  name: string;
  position: string;
  salary: number;
};

/** A trade confirmed valid by the bball-GM engine. The ONLY renderable trade type. */
export type ValidatedTrade = {
  kind: "validated";
  outgoing: TradePlayer[];
  incoming: TradePlayer;
  opposingTeam: {
    id: number;
    name: string;
    city: string;
    abbreviation: string;
    primaryColor: string;
    secondaryColor: string;
  };
  /** Product semantics (human plan): total outgoing salary − target salary.
   *  Positive → "Saved $X", negative → "Added $X", zero → "No salary change". */
  salarySavings: number;
  /** bball-GM verdict summary line (traceability). */
  apiSummary: string;
};

/** Compact, serialization-friendly pending candidate. Never renderable. */
export type CompactCandidate = {
  /** Outgoing player ids from the user's roster (1–3). */
  ids: number[];
  /** |total outgoing salary − target salary| — the ordering key. */
  diff: number;
};

export type TraceEntry = {
  tool: string;
  summary: string;
  ok: boolean;
};

export type ChatMsg = { role: "user" | "assistant"; content: string };

export type TradeState = {
  team: Team | null;
  target: Player | null;
  confirmed: boolean;
  searched: boolean;
  results: ValidatedTrade[];
  pendingCandidates: CompactCandidate[];
  shownCount: number;
  validationUnavailable: boolean;
  /** Cumulative audit trail: user said X → state changed Y → verdict Z. */
  trace: TraceEntry[];
};

export const REQUIRED_UNAVAILABLE_MESSAGE =
  "Trade validation is temporarily unavailable. Please try again later.";

export const INITIAL_RESULT_COUNT = 9;
const TRACE_CAP = 100;

export function emptyState(): TradeState {
  return {
    team: null,
    target: null,
    confirmed: false,
    searched: false,
    results: [],
    pendingCandidates: [],
    shownCount: 0,
    validationUnavailable: false,
    trace: [],
  };
}

/** Any criteria change invalidates confirmation and clears search artifacts. */
function invalidateSearch(state: TradeState): TradeState {
  return {
    ...state,
    confirmed: false,
    searched: false,
    results: [],
    pendingCandidates: [],
    shownCount: 0,
    validationUnavailable: false,
  };
}

export function withTeam(state: TradeState, team: Team): TradeState {
  return { ...invalidateSearch(state), team };
}

export function withTarget(state: TradeState, target: Player): TradeState {
  return { ...invalidateSearch(state), target };
}

export function withConfirmed(state: TradeState): TradeState {
  return { ...state, confirmed: true };
}

/** Merge a validation pass outcome. Results only ever GROW here (monotonicity):
 *  infrastructure errors never remove previously validated trades. */
export function withSearchOutcome(
  state: TradeState,
  outcome: {
    newlyValidated: ValidatedTrade[];
    remaining: CompactCandidate[];
    unavailable: boolean;
  },
): TradeState {
  const results = [...state.results, ...outcome.newlyValidated];
  return {
    ...state,
    searched: true,
    results,
    pendingCandidates: outcome.remaining,
    shownCount: Math.min(
      Math.max(state.shownCount, INITIAL_RESULT_COUNT),
      results.length,
    ),
    validationUnavailable: outcome.unavailable,
  };
}

/** Show-more reveal: shownCount grows toward `target`, capped by what has
 *  actually been validated. Never regenerates, reorders, or caps the space. */
export function withRevealTarget(state: TradeState, target: number): TradeState {
  return { ...state, shownCount: Math.min(target, state.results.length) };
}

export function withTrace(state: TradeState, entries: TraceEntry[]): TradeState {
  return { ...state, trace: [...state.trace, ...entries].slice(-TRACE_CAP) };
}

/** True when criteria are complete and a search may be confirmed. */
export function criteriaReady(state: TradeState): boolean {
  return state.team !== null && state.target !== null;
}
