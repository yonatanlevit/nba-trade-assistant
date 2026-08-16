// Composition edge — the ONLY place implementations are chosen. Core code
// depends on the ModelClient/BballGmClient interfaces; env flags select the
// wiring here, never inside business logic.

import { AnthropicModelClient, type ModelClient } from "./modelClient";
import { RealBballGmClient, type BballGmClient } from "./bballGmClient";
import { ScriptedModelClient } from "./testdoubles/scriptedModelClient";
import { FixtureBballGmClient } from "./testdoubles/fixtureBballGmClient";

let modelClient: ModelClient | null = null;
let bballGmClient: BballGmClient | null = null;

export function getModelClient(): ModelClient {
  if (!modelClient) {
    modelClient =
      process.env.MOCK_LLM === "1" ? new ScriptedModelClient() : new AnthropicModelClient();
  }
  return modelClient;
}

export function getBballGmClient(): BballGmClient {
  if (!bballGmClient) {
    bballGmClient =
      process.env.MOCK_BBALLGM === "1"
        ? new FixtureBballGmClient()
        : new RealBballGmClient();
  }
  return bballGmClient;
}
