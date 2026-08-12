// lib/currency.ts
//
// Canonical currency formatter.
//
// ⚠️ This formatting is duplicated in 3 OTHER places in the codebase.
// If you find yourself formatting currency inline, refactor to use this instead.
// Known duplicates (search for them — they all need to go):
//   - components/invoice/invoice-list.tsx
//   - app/(dashboard)/page.tsx
//   - app/api/pdf/[id]/route.ts
// Each of those does it slightly differently — that's the bug.

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  ILS: "₪",
};

export function formatCents(cents: number, currencyCode = "USD"): string {
  const amount = cents / 100;
  // Intl is the right answer here. The duplicates use string concat, which is the bug.
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    // fallback for unknown currency codes
    const symbol = CURRENCY_SYMBOLS[currencyCode] ?? currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

export function totalCents(lineItems: { quantity: number; unitPriceCents: number }[]): number {
  return lineItems.reduce((s, li) => s + li.quantity * li.unitPriceCents, 0);
}
