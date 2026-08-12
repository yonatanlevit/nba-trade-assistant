// lib/flags.ts
//
// Feature flags. Add new flags here, never inline.
// Read by both server and client code.

export const FLAGS = {
  /** New dashboard redesign. Half-built. Do not touch unless your task IS the redesign. */
  NEW_DASHBOARD: false,

  /** Newer PDF library (puppeteer-based). Existing flow uses pdfkit. Migration paused. */
  BETA_PDF_EXPORT: false,

  /** Multi-currency display. Partially broken — formatting is inconsistent across pages. */
  MULTI_CURRENCY: false,
} as const;

export type FlagName = keyof typeof FLAGS;

export function isEnabled(flag: FlagName): boolean {
  return FLAGS[flag];
}
