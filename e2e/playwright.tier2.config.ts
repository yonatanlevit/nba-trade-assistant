// Tier 2 — integration check: scripted LLM (deterministic) + the REAL bball-GM
// validation engine. Catches API schema drift and real validation problems.
// Network-dependent by design: not a deterministic CI gate.

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "tier2.spec.ts",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3101", trace: "retain-on-failure" },
  webServer: {
    command: "npm run start -- --port 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    timeout: 120_000,
    // MOCK_BBALLGM is pinned to "0", not merely left unset: Next.js loads
    // .env.local into process.env at server start, so an untracked local file
    // in demo mode would otherwise flip this tier to the fixture engine and it
    // would pass while proving nothing. "0" rather than "" because Windows
    // does not preserve empty-string env vars across spawn.
    env: { MOCK_LLM: "1", MOCK_BBALLGM: "0", SEARCH_TIME_BUDGET_MS: "25000" },
  },
});
