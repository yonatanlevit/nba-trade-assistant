// Tier 1 — fully deterministic, CI-safe: BOTH external boundaries mocked
// (scripted LLM + fixture bball-GM). Exercises the real application pipeline:
// UI → /api/chat → harness → tools → state machine → candidate generation →
// validation abstraction → results → UI sync.

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "tier1.spec.ts",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { MOCK_LLM: "1", MOCK_BBALLGM: "1" },
  },
});
