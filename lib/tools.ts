// The tool boundary: 4 tools the model can call. The model routes natural
// language into these; deterministic app code does everything else.

import type { BballGmClient } from "./bballGmClient";
import {
  DEFAULT_PREFILTER_SLACK,
  generateCandidates,
  type PreFilterContext,
} from "./candidates";
import { activeRoster, isFreeAgent, resolvePlayer, resolveTeam } from "./resolve";
import { formatMoney } from "./salary";
import {
  criteriaReady,
  INITIAL_RESULT_COUNT,
  REQUIRED_UNAVAILABLE_MESSAGE,
  withConfirmed,
  withSearchOutcome,
  withTarget,
  withTeam,
  type Player,
  type Team,
  type TraceEntry,
  type TradeState,
} from "./state";
import type { ToolDefinition, ModelToolCall } from "./modelClient";
import { resolveLimits, validateInOrder } from "./validation";

// Trade-match constants from the engine teardown (used ONLY for the
// provably-safe pre-filter, with generous slack — never for verdicts).
const TRADE_MATCH_ADD_ON = 250_000;
const FLAT_ADD_ON = 9_400_000;

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "set_team",
    description:
      "Record which NBA team the user (the GM) represents. Call whenever the user states or changes their team. Pass the user's wording verbatim — the application resolves it against league data and reports success, an ambiguous-name list, or not-found. Changing the team invalidates any previous confirmation and search results.",
    inputSchema: {
      type: "object",
      properties: {
        team_name: {
          type: "string",
          description: "The team as the user said it, e.g. 'Boston', 'the Celtics', 'BOS'.",
        },
      },
      required: ["team_name"],
      additionalProperties: false,
    },
  },
  {
    name: "set_target_player",
    description:
      "Record the player the user wants to acquire. Call whenever the user names or changes the target player. Pass the user's wording verbatim — the application resolves it and reports success, an ambiguous-name list (with each player's team), not-found, free-agent (untradeable), or already-on-your-team. Changing the target invalidates any previous confirmation and search results.",
    inputSchema: {
      type: "object",
      properties: {
        player_name: {
          type: "string",
          description: "The player as the user said it, e.g. 'Anthony Davis', 'Tatum'.",
        },
      },
      required: ["player_name"],
      additionalProperties: false,
    },
  },
  {
    name: "confirm_search",
    description:
      "Mark the search criteria as confirmed by the user. Call ONLY after the user has explicitly agreed to your restatement of the criteria (e.g. answered yes to 'Should I search for valid trades?'). Fails if criteria are incomplete, ambiguous, or invalid.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "run_trade_search",
    description:
      "Run the trade search for the confirmed criteria. Generates every 1-3 player package from the user's roster, orders them (simplest first, then closest salary match), and validates them with the bball-GM league engine until an initial set of valid trades is found. Only call after confirm_search succeeded. Returns counts plus a short summary of the top valid options; the full cards appear on the user's board automatically.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

export type ToolExecutionContext = {
  bballGm: BballGmClient;
  teams: Team[];
  players: Player[];
};

export type ToolOutcome = {
  state: TradeState;
  /** Result string fed back to the model (compact JSON). */
  result: string;
  isError: boolean;
  trace: TraceEntry;
};

export async function executeTool(
  call: ModelToolCall,
  state: TradeState,
  ctx: ToolExecutionContext,
): Promise<ToolOutcome> {
  switch (call.name) {
    case "set_team":
      return setTeam(String(call.input.team_name ?? ""), state, ctx);
    case "set_target_player":
      return setTargetPlayer(String(call.input.player_name ?? ""), state, ctx);
    case "confirm_search":
      return confirmSearch(state);
    case "run_trade_search":
      return runTradeSearch(state, ctx);
    default:
      return {
        state,
        result: JSON.stringify({ error: `Unknown tool: ${call.name}` }),
        isError: true,
        trace: { tool: call.name, summary: "unknown tool", ok: false },
      };
  }
}

function setTeam(query: string, state: TradeState, ctx: ToolExecutionContext): ToolOutcome {
  const res = resolveTeam(query, ctx.teams);
  if (res.status === "matched") {
    const label = `${res.team.city} ${res.team.name}`;
    return {
      state: withTeam(state, res.team),
      result: JSON.stringify({
        status: "matched",
        team: { id: res.team.id, name: label, abbreviation: res.team.abbreviation },
        note: "Previous confirmation and results (if any) were cleared.",
      }),
      isError: false,
      trace: { tool: "set_team", summary: `→ ${label}`, ok: true },
    };
  }
  if (res.status === "ambiguous") {
    return {
      state,
      result: JSON.stringify({
        status: "ambiguous",
        candidates: res.candidates.map((t) => `${t.city} ${t.name} (${t.abbreviation})`),
      }),
      isError: false,
      trace: { tool: "set_team", summary: `"${query}" ambiguous`, ok: false },
    };
  }
  return {
    state,
    result: JSON.stringify({ status: "not_found", query }),
    isError: false,
    trace: { tool: "set_team", summary: `"${query}" not found`, ok: false },
  };
}

function setTargetPlayer(
  query: string,
  state: TradeState,
  ctx: ToolExecutionContext,
): ToolOutcome {
  const res = resolvePlayer(query, ctx.players);
  if (res.status === "not_found") {
    return {
      state,
      result: JSON.stringify({ status: "not_found", query }),
      isError: false,
      trace: { tool: "set_target_player", summary: `"${query}" not found`, ok: false },
    };
  }
  if (res.status === "ambiguous") {
    return {
      state,
      result: JSON.stringify({
        status: "ambiguous",
        candidates: res.candidates.map((p) => ({
          name: p.name,
          team: p.teamName,
          position: p.position,
        })),
      }),
      isError: false,
      trace: { tool: "set_target_player", summary: `"${query}" ambiguous`, ok: false },
    };
  }

  const player = res.player;
  if (isFreeAgent(player)) {
    return {
      state,
      result: JSON.stringify({
        status: "free_agent",
        player: player.name,
        note: "This player is currently a free agent — free agents are signed, not traded. They cannot be acquired through a trade.",
      }),
      isError: false,
      trace: { tool: "set_target_player", summary: `${player.name} is a free agent`, ok: false },
    };
  }
  if (state.team && player.teamId === state.team.id) {
    return {
      state,
      result: JSON.stringify({
        status: "already_on_your_team",
        player: player.name,
        team: `${state.team.city} ${state.team.name}`,
      }),
      isError: false,
      trace: {
        tool: "set_target_player",
        summary: `${player.name} already on roster`,
        ok: false,
      },
    };
  }
  return {
    state: withTarget(state, player),
    result: JSON.stringify({
      status: "matched",
      player: {
        name: player.name,
        team: player.teamName,
        position: player.position,
        salary: player.salary,
      },
      note: "Previous confirmation and results (if any) were cleared.",
    }),
    isError: false,
    trace: {
      tool: "set_target_player",
      summary: `→ ${player.name} (${player.teamAbbreviation})`,
      ok: true,
    },
  };
}

function confirmSearch(state: TradeState): ToolOutcome {
  if (!criteriaReady(state)) {
    const missing = [
      state.team ? null : "the team you represent",
      state.target ? null : "the target player",
    ]
      .filter(Boolean)
      .join(" and ");
    return {
      state,
      result: JSON.stringify({ status: "rejected", reason: `Missing: ${missing}.` }),
      isError: true,
      trace: { tool: "confirm_search", summary: "rejected — criteria incomplete", ok: false },
    };
  }
  const team = state.team!;
  const target = state.target!;
  if (target.teamId === team.id) {
    return {
      state,
      result: JSON.stringify({
        status: "rejected",
        reason: `${target.name} is already on the ${team.city} ${team.name}.`,
      }),
      isError: true,
      trace: { tool: "confirm_search", summary: "rejected — target on own roster", ok: false },
    };
  }
  if (isFreeAgent(target)) {
    return {
      state,
      result: JSON.stringify({
        status: "rejected",
        reason: `${target.name} is a free agent and cannot be traded for.`,
      }),
      isError: true,
      trace: { tool: "confirm_search", summary: "rejected — target is a free agent", ok: false },
    };
  }
  return {
    state: withConfirmed(state),
    result: JSON.stringify({ status: "confirmed" }),
    isError: false,
    trace: { tool: "confirm_search", summary: "criteria confirmed", ok: true },
  };
}

async function runTradeSearch(
  state: TradeState,
  ctx: ToolExecutionContext,
): Promise<ToolOutcome> {
  if (!state.confirmed || !state.team || !state.target) {
    return {
      state,
      result: JSON.stringify({
        status: "rejected",
        reason: "Criteria are not confirmed. Call confirm_search after the user agrees.",
      }),
      isError: true,
      trace: { tool: "run_trade_search", summary: "rejected — not confirmed", ok: false },
    };
  }

  const team = state.team;
  const target = state.target;
  const opposingTeam = ctx.teams.find((t) => t.id === target.teamId);
  if (!opposingTeam) {
    return {
      state,
      result: JSON.stringify({
        status: "error",
        reason: `Could not find ${target.teamName} in league data.`,
      }),
      isError: true,
      trace: { tool: "run_trade_search", summary: "opposing team missing", ok: false },
    };
  }

  const roster = activeRoster(team.id, ctx.players);
  const preFilter: PreFilterContext = {
    userTeam: team,
    opposingTeam,
    tradeMatchAddOn: TRADE_MATCH_ADD_ON,
    flatAddOn: FLAT_ADD_ON,
    safetyMargin: DEFAULT_PREFILTER_SLACK,
  };
  const candidates = generateCandidates(roster, target, preFilter);

  const outcome = await validateInOrder(
    {
      client: ctx.bballGm,
      userTeam: team,
      opposingTeam,
      target,
      playersById: new Map(ctx.players.map((p) => [p.id, p])),
    },
    candidates,
    resolveLimits({ want: INITIAL_RESULT_COUNT }),
  );

  const newState = withSearchOutcome(state, outcome);
  const found = newState.results.length;
  const pending = newState.pendingCandidates.length;

  if (found === 0 && outcome.unavailable) {
    return {
      state: newState,
      result: JSON.stringify({ status: "validation_unavailable", message: REQUIRED_UNAVAILABLE_MESSAGE }),
      isError: true,
      trace: { tool: "run_trade_search", summary: "validation unavailable", ok: false },
    };
  }

  const top = newState.results.slice(0, 3).map((t, i) => ({
    option: i + 1,
    send: t.outgoing.map((p) => `${p.name} (${formatMoney(p.salary)})`).join(" + "),
    receive: `${t.incoming.name} (${formatMoney(t.incoming.salary)})`,
    salaryEffect:
      t.salarySavings > 0
        ? `saves ${formatMoney(t.salarySavings)}`
        : t.salarySavings < 0
          ? `adds ${formatMoney(t.salarySavings)} to payroll`
          : "no salary change",
  }));

  return {
    state: newState,
    result: JSON.stringify({
      status: "complete",
      validTradesFound: found,
      candidatesPendingValidation: pending,
      validationUnavailable: outcome.unavailable,
      topOptions: top,
      note:
        found === 0
          ? "No valid trades exist for these criteria."
          : "Cards are displayed on the user's board.",
    }),
    isError: false,
    trace: {
      tool: "run_trade_search",
      summary: `${found} valid · ${pending} pending`,
      ok: true,
    },
  };
}
