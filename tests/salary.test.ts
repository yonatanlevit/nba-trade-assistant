import { describe, expect, it } from "vitest";
import {
  apiNetChangeToSavings,
  formatMoney,
  salaryBadge,
  salarySavings,
  totalSalary,
} from "@/lib/salary";

const p = (salary: number) => ({ id: 1, name: "X", position: "PG", salary });

describe("salary semantics (Human Plan contract)", () => {
  it("salarySavings = outgoing total − target salary", () => {
    expect(salarySavings([p(30_000_000)], 25_000_000)).toBe(5_000_000);
  });

  it("is positive when the user's team sheds payroll (Saved direction)", () => {
    expect(salarySavings([p(40_000_000)], 30_000_000)).toBeGreaterThan(0);
  });

  it("is negative when the user's team adds payroll (Added direction)", () => {
    expect(salarySavings([p(20_000_000)], 30_000_000)).toBeLessThan(0);
  });

  it("is zero on an exact salary match", () => {
    expect(salarySavings([p(25_000_000)], 25_000_000)).toBe(0);
  });

  it("sums multi-player packages", () => {
    expect(totalSalary([p(10_000_000), p(5_000_000), p(2_500_000)])).toBe(17_500_000);
  });

  it("normalizes the API's netSalaryChange (in − out) to product savings (out − in)", () => {
    // Teardown example: salaryOut 57.1M, salaryIn 50.1M → API reports −7M.
    expect(apiNetChangeToSavings(-7_000_000)).toBe(7_000_000);
  });

  it("badges the Saved direction green-labelled", () => {
    expect(salaryBadge(2_500_000)).toEqual({ kind: "saved", label: "SAVED $2.5M" });
  });

  it("badges the Added direction", () => {
    expect(salaryBadge(-1_300_000)).toEqual({ kind: "added", label: "ADDED $1.3M" });
  });

  it("badges an exact match as no salary change", () => {
    expect(salaryBadge(0)).toEqual({ kind: "even", label: "NO SALARY CHANGE" });
  });

  it("formats money compactly", () => {
    expect(formatMoney(58_456_566)).toBe("$58.5M");
    expect(formatMoney(-2_000_000)).toBe("$2.0M");
    expect(formatMoney(750_000)).toBe("$750K");
  });
});
