// FixtureBballGmClient — deterministic stand-in for the bball-GM engine.
// Verdict rule (documented, simple, deliberately stricter than the pre-filter's
// slacked bound): a trade is valid iff EACH side's received salary is at most
// max(2 × sent, sent + $9.4M), and no free agent is involved.

import type {
  BballGmClient,
  ValidateTradeRequest,
  ValidateTradeResponse,
} from "../bballGmClient";
import type { Player, Team } from "../state";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "./fixtures";

const FLAT_ADD_ON = 9_400_000;

export class FixtureBballGmClient implements BballGmClient {
  private byId = new Map(FIXTURE_PLAYERS.map((p) => [p.id, p]));

  /** Test hook: when set, validateTrade throws to simulate an outage. */
  failNextValidations = 0;

  async getTeams(): Promise<Team[]> {
    return FIXTURE_TEAMS;
  }

  async getPlayers(): Promise<Player[]> {
    return FIXTURE_PLAYERS;
  }

  async validateTrade(req: ValidateTradeRequest): Promise<ValidateTradeResponse> {
    if (this.failNextValidations > 0) {
      this.failNextValidations--;
      const { BballGmUnavailableError } = await import("../bballGmClient");
      throw new BballGmUnavailableError("simulated outage (fixture)");
    }

    for (const leg of req.teams) {
      const sent = sum(leg.sendingPlayerIds, this.byId);
      const received = sum(leg.receivingPlayerIds, this.byId);
      const anyFreeAgent = [...leg.sendingPlayerIds, ...leg.receivingPlayerIds].some(
        (id) => this.byId.get(id)?.signingStatus === "free-agent",
      );
      if (anyFreeAgent) {
        return { isValid: false, summary: "Trade is invalid. Free agents cannot be traded." };
      }
      const maxReceive = Math.max(2 * sent, sent + FLAT_ADD_ON);
      if (received > maxReceive) {
        return {
          isValid: false,
          summary: `Trade is invalid. Team ${leg.teamId} does not satisfy salary matching requirements.`,
        };
      }
    }
    return { isValid: true, summary: "Trade is valid." };
  }
}

function sum(ids: number[], byId: Map<number, Player>): number {
  return ids.reduce((acc, id) => acc + (byId.get(id)?.salary ?? 0), 0);
}
