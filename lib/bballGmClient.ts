// BballGmClient — the dependency boundary for the trade engine, mirroring the
// ModelClient boundary for the LLM. Core code depends on this interface only;
// implementations are wired at the composition edge (lib/wiring.ts).

import type { Player, Team } from "./state";

export type ValidateTradeRequest = {
  teams: {
    teamId: number;
    sendingPlayerIds: number[];
    receivingPlayerIds: number[];
    sendingPickIds: number[];
    receivingPickIds: number[];
  }[];
};

export type ValidateTradeResponse = {
  isValid: boolean;
  summary: string;
};

/** Thrown ONLY for infrastructure failures (network, timeout, 5xx). A 200 with
 *  isValid:false or a 400 rule rejection is a definitive verdict, not an error. */
export class BballGmUnavailableError extends Error {
  constructor(cause: string) {
    super(`bball-GM validation unavailable: ${cause}`);
    this.name = "BballGmUnavailableError";
  }
}

export interface BballGmClient {
  getTeams(): Promise<Team[]>;
  getPlayers(): Promise<Player[]>;
  /** Resolves with a definitive verdict, or throws BballGmUnavailableError. */
  validateTrade(req: ValidateTradeRequest): Promise<ValidateTradeResponse>;
}

// ---------------------------------------------------------------------------
// Production implementation
// ---------------------------------------------------------------------------

const DEFAULT_BASE = "https://bball-gm.com/api";
const CACHE_TTL_MS = 5 * 60 * 1000;

type Cache<T> = { at: number; data: T } | null;

export class RealBballGmClient implements BballGmClient {
  private base: string;
  private teamsCache: Cache<Team[]> = null;
  private playersCache: Cache<Player[]> = null;

  constructor(baseUrl?: string) {
    this.base = baseUrl ?? process.env.BBALLGM_BASE_URL ?? DEFAULT_BASE;
  }

  async getTeams(): Promise<Team[]> {
    if (this.teamsCache && Date.now() - this.teamsCache.at < CACHE_TTL_MS) {
      return this.teamsCache.data;
    }
    const data = (await this.getJson("/teams")) as Team[];
    this.teamsCache = { at: Date.now(), data };
    return data;
  }

  async getPlayers(): Promise<Player[]> {
    if (this.playersCache && Date.now() - this.playersCache.at < CACHE_TTL_MS) {
      return this.playersCache.data;
    }
    const data = (await this.getJson("/players")) as Player[];
    this.playersCache = { at: Date.now(), data };
    return data;
  }

  async validateTrade(req: ValidateTradeRequest): Promise<ValidateTradeResponse> {
    let res: Response;
    try {
      res = await fetch(`${this.base}/trades/validate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (e) {
      throw new BballGmUnavailableError(e instanceof Error ? e.message : "network error");
    }
    if (res.ok) {
      const body = (await res.json()) as { isValid: boolean; summary?: string };
      return { isValid: body.isValid, summary: body.summary ?? "" };
    }
    if (res.status >= 400 && res.status < 500) {
      // Rule-level rejection channel (e.g. Stepien/stretch) — definitively invalid.
      let summary = `Rejected (HTTP ${res.status})`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) summary = body.error;
      } catch {
        // non-JSON 4xx body — keep the fallback summary
      }
      return { isValid: false, summary };
    }
    throw new BballGmUnavailableError(`HTTP ${res.status}`);
  }

  private async getJson(path: string): Promise<unknown> {
    let res: Response;
    try {
      res = await fetch(`${this.base}${path}`, { signal: AbortSignal.timeout(10_000) });
    } catch (e) {
      throw new BballGmUnavailableError(e instanceof Error ? e.message : "network error");
    }
    if (!res.ok) throw new BballGmUnavailableError(`HTTP ${res.status} on ${path}`);
    return res.json();
  }
}
