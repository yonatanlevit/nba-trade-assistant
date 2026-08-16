import { describe, expect, it } from "vitest";
import { validateInOrder, type ValidationContext } from "@/lib/validation";
import {
  BballGmUnavailableError,
  type BballGmClient,
  type ValidateTradeRequest,
  type ValidateTradeResponse,
} from "@/lib/bballGmClient";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "@/lib/testdoubles/fixtures";
import type { CompactCandidate } from "@/lib/state";

const boston = FIXTURE_TEAMS[0];
const wizards = FIXTURE_TEAMS[1];
const davis = FIXTURE_PLAYERS.find((p) => p.name === "Anthony Davis")!;

/** Controllable client: decides validity/failure per call index. */
class ProgrammableClient implements BballGmClient {
  calls = 0;
  constructor(
    private plan: ("valid" | "invalid" | "fail")[],
    private defaultVerdict: "valid" | "invalid" | "fail" = "valid",
  ) {}
  async getTeams() {
    return FIXTURE_TEAMS;
  }
  async getPlayers() {
    return FIXTURE_PLAYERS;
  }
  async validateTrade(_req: ValidateTradeRequest): Promise<ValidateTradeResponse> {
    const verdict = this.plan[this.calls] ?? this.defaultVerdict;
    this.calls++;
    if (verdict === "fail") throw new BballGmUnavailableError("simulated");
    return verdict === "valid"
      ? { isValid: true, summary: "Trade is valid." }
      : { isValid: false, summary: "Trade is invalid." };
  }
}

function ctxFor(client: BballGmClient): ValidationContext {
  return {
    client,
    userTeam: boston,
    opposingTeam: wizards,
    target: davis,
    playersById: new Map(FIXTURE_PLAYERS.map((p) => [p.id, p])),
  };
}

const cands = (n: number): CompactCandidate[] =>
  Array.from({ length: n }, (_, i) => ({ ids: [101 + (i % 5)], diff: i }));

const limits = (over: Partial<{ want: number; timeBudgetMs: number; concurrency: number }> = {}) => ({
  want: 9,
  timeBudgetMs: 5_000,
  concurrency: 1,
  ...over,
});

describe("validateInOrder", () => {
  it("constructs ValidatedTrade only from a successful verdict", async () => {
    const out = await validateInOrder(ctxFor(new ProgrammableClient(["valid"])), cands(1), limits());
    expect(out.newlyValidated).toHaveLength(1);
    expect(out.newlyValidated[0].kind).toBe("validated");
  });

  it("drops invalid candidates without surfacing them", async () => {
    const out = await validateInOrder(
      ctxFor(new ProgrammableClient(["invalid", "valid"])),
      cands(2),
      limits(),
    );
    expect(out.newlyValidated).toHaveLength(1);
  });

  it("stops once `want` valid trades are confirmed", async () => {
    const client = new ProgrammableClient([], "valid");
    const out = await validateInOrder(ctxFor(client), cands(30), limits({ want: 9 }));
    expect(out.newlyValidated.length).toBeGreaterThanOrEqual(9);
    expect(client.calls).toBeLessThan(30);
  });

  it("keeps validating across multiple batches to fill to `want`", async () => {
    // concurrency 2 → needs 5+ windows to reach 9 valid; batch size must not cap it.
    const client = new ProgrammableClient([], "valid");
    const out = await validateInOrder(
      ctxFor(client),
      cands(40),
      limits({ want: 9, concurrency: 2 }),
    );
    expect(out.newlyValidated.length).toBeGreaterThanOrEqual(9);
  });

  it("preserves the unprocessed remainder for Show more", async () => {
    const out = await validateInOrder(
      ctxFor(new ProgrammableClient([], "valid")),
      cands(20),
      limits({ want: 3 }),
    );
    expect(out.remaining.length).toBe(20 - out.processed);
    expect(out.processed).toBeGreaterThan(0);
  });

  it("exhausts all candidates when fewer than `want` are valid", async () => {
    const client = new ProgrammableClient([], "invalid");
    const out = await validateInOrder(ctxFor(client), cands(6), limits());
    expect(out.newlyValidated).toHaveLength(0);
    expect(out.remaining).toHaveLength(0);
    expect(client.calls).toBe(6);
  });

  it("returns partial results when the time budget is reached (never fails the search)", async () => {
    class SlowClient extends ProgrammableClient {
      async validateTrade(req: ValidateTradeRequest) {
        await new Promise((r) => setTimeout(r, 30));
        return super.validateTrade(req);
      }
    }
    const out = await validateInOrder(
      ctxFor(new SlowClient([], "valid")),
      cands(50),
      limits({ want: 9, timeBudgetMs: 90 }),
    );
    expect(out.newlyValidated.length).toBeGreaterThan(0);
    expect(out.newlyValidated.length).toBeLessThan(9);
    expect(out.remaining.length).toBeGreaterThan(0);
    expect(out.unavailable).toBe(false);
  });

  it("flags unavailable and keeps trades validated before the failure", async () => {
    const out = await validateInOrder(
      ctxFor(new ProgrammableClient(["valid", "valid", "fail"])),
      cands(10),
      limits(),
    );
    expect(out.newlyValidated).toHaveLength(2);
    expect(out.unavailable).toBe(true);
  });

  it("returns the failed candidate to `remaining` so it can be retried", async () => {
    const out = await validateInOrder(
      ctxFor(new ProgrammableClient(["valid", "fail"])),
      cands(5),
      limits(),
    );
    expect(out.processed).toBe(1);
    expect(out.remaining).toHaveLength(4);
  });

  it("reports unavailable with zero results when the first call fails", async () => {
    const out = await validateInOrder(
      ctxFor(new ProgrammableClient(["fail"])),
      cands(5),
      limits(),
    );
    expect(out.newlyValidated).toHaveLength(0);
    expect(out.unavailable).toBe(true);
    expect(out.remaining).toHaveLength(5);
  });

  it("sends a two-team request with correct send/receive routing", async () => {
    let captured: ValidateTradeRequest | null = null;
    const spy: BballGmClient = {
      getTeams: async () => FIXTURE_TEAMS,
      getPlayers: async () => FIXTURE_PLAYERS,
      validateTrade: async (req) => {
        captured = req;
        return { isValid: true, summary: "ok" };
      },
    };
    await validateInOrder(ctxFor(spy), [{ ids: [101, 102], diff: 0 }], limits());
    const req = captured! as ValidateTradeRequest;
    expect(req.teams).toHaveLength(2);
    expect(req.teams[0]).toMatchObject({
      teamId: boston.id,
      sendingPlayerIds: [101, 102],
      receivingPlayerIds: [davis.id],
    });
    expect(req.teams[1]).toMatchObject({
      teamId: wizards.id,
      sendingPlayerIds: [davis.id],
      receivingPlayerIds: [101, 102],
    });
  });

  it("computes salarySavings on the validated trade using product semantics", async () => {
    const out = await validateInOrder(
      ctxFor(new ProgrammableClient(["valid"])),
      [{ ids: [101], diff: 0 }], // Jaylen Brown $48M vs Davis $50M
      limits(),
    );
    expect(out.newlyValidated[0].salarySavings).toBe(48_000_000 - 50_000_000);
  });

  it("handles an empty candidate list without calling the engine", async () => {
    const client = new ProgrammableClient([]);
    const out = await validateInOrder(ctxFor(client), [], limits());
    expect(client.calls).toBe(0);
    expect(out.newlyValidated).toHaveLength(0);
  });
});
