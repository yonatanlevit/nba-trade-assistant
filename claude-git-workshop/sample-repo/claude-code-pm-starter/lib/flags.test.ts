import { describe, it, expect } from "vitest";
import { FLAGS, isEnabled } from "./flags";

describe("flags", () => {
  it("exposes the three workshop flags", () => {
    expect(Object.keys(FLAGS).sort()).toEqual([
      "BETA_PDF_EXPORT",
      "MULTI_CURRENCY",
      "NEW_DASHBOARD",
    ]);
  });

  it("isEnabled returns the flag value", () => {
    expect(isEnabled("NEW_DASHBOARD")).toBe(false);
    expect(isEnabled("BETA_PDF_EXPORT")).toBe(false);
    expect(isEnabled("MULTI_CURRENCY")).toBe(false);
  });
});
