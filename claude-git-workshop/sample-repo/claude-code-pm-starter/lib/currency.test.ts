import { describe, it, expect } from "vitest";
import { formatCents, totalCents } from "./currency";

describe("formatCents", () => {
  it("formats USD by default", () => {
    expect(formatCents(1234)).toMatch(/12\.34/);
  });

  it("formats with explicit currency code", () => {
    expect(formatCents(1234, "USD")).toMatch(/12\.34/);
  });

  it("handles zero cents", () => {
    expect(formatCents(0)).toMatch(/0\.00/);
  });

  // SKIPPED: known issue — duplicates in invoice-list.tsx, dashboard, and PDF routes don't go through this function.
  // See docs/architecture.md → "Currency formatting is duplicated in 4 places".
  it.skip("formats consistently across the entire app", () => {
    // This test would compare formatCents output against the inline formatters
    // in components/invoice/invoice-list.tsx and app/(dashboard)/page.tsx.
    // It currently fails because those duplicates do their own thing.
    // Unskip when the duplicates are consolidated.
    expect(true).toBe(false);
  });
});

describe("totalCents", () => {
  it("sums quantity × unit price across line items", () => {
    const lines = [
      { quantity: 2, unitPriceCents: 1000 },
      { quantity: 1, unitPriceCents: 500 },
    ];
    expect(totalCents(lines)).toBe(2500);
  });

  it("returns 0 for empty list", () => {
    expect(totalCents([])).toBe(0);
  });
});
