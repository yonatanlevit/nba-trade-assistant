# CLAUDE.md — InvoiceFlow

> This file is the "project memory" Claude reads at the start of every session in this repo.
> Keep it under 150 lines. Move details to separate files and `@`-import them when needed.

---

## What this product is

**InvoiceFlow** is a freelance invoicing SaaS. Users (freelancers) send invoices to their customers, track payments, and export PDFs.

The product is **simple by design** — we resist feature creep. New features must justify themselves against the freelancer's real workflow.

---

## Stack

- **Next.js 14** (App Router, server components by default)
- **TypeScript** strict mode — no `any`, no `@ts-ignore`
- **Prisma** + **SQLite** for development
- **NextAuth** for auth (email/password only as of today)
- **Tailwind CSS** + custom design system in `components/ui/`
- **Vitest** for tests

---

## Where things live

- `app/(auth)/` — login and signup
- `app/(dashboard)/` — everything behind auth
- `app/api/` — API routes
- `components/ui/` — **design system primitives. Use these, don't create new ones.**
- `components/invoice/` — feature-specific components
- `lib/` — shared utilities
- `prisma/` — schema and seed
- `tokens.json` — design tokens (colors, spacing, typography)
- `docs/` — product docs and PRDs (PMs save here)

---

## Conventions Claude must follow

- **Components:** PascalCase filenames, default export.
- **Server components by default.** Only add `"use client"` when the component needs state, effects, or browser APIs.
- **Tests:** co-located `.test.ts` next to the file under test.
- **Currency formatting:** there are four places this is duplicated. **Do not add a fifth.** If you need to format currency, refactor to use `lib/currency.ts`.
- **Auth:** `lib/auth.ts` is intentionally messy and being refactored. Don't make it worse. Flag any change here as risky.

---

## Things Claude should NEVER do

- Never modify `prisma/migrations/` — those are append-only, generated only by `prisma migrate`.
- Never edit `package-lock.json` directly.
- Never add a new UI primitive without first checking `components/ui/`. If something is missing, **ask** before creating.
- Never disable a test to make it pass. If a test is wrong, fix it or skip it explicitly with a comment explaining why.
- Never invent a feature flag. Add new flags only to `lib/flags.ts`.

---

## Feature flags currently in use

See `lib/flags.ts`. Three flags exist:

- `NEW_DASHBOARD` — half-built redesign. Don't touch unless the task is the redesign.
- `BETA_PDF_EXPORT` — newer PDF lib (puppeteer), partially integrated. Existing flow uses pdfkit.
- `MULTI_CURRENCY` — partially broken. Avoid this code path when scoping new features unless they're explicitly multi-currency.

---

## Current known issues (so Claude doesn't "discover" them as bugs)

- PDF export is slow on large invoices. Mid-migration between two libraries.
- Currency formatting is inconsistent across pages.
- Some tests are skipped — see `vitest.config.ts`.
- Auth strategy is tangled — refactor planned, not started.

These are **known**. Don't open new investigations into them unless the task asks for it.

---

## How to ask good questions in this repo

When scoping or planning, ask Claude to:

1. **Survey first** in plan mode (Shift+Tab → plan mode).
2. **Name the files** that would change. No vague "the auth layer" answers.
3. **Compare to existing patterns.** "How does the current PDF export work? What would the new feature do differently?"
4. **Push back.** "What's the riskiest part of this?"

---

## Skills available

See `.claude/skills/`:

- **`feasibility-scout`** — score feasibility of a feature with evidence.
- **`figma-to-component`** — generate a component from a Figma frame using only design system primitives.
- **`prd-round-trip`** — full PM → Dev → PM round-trip on a feature.

Run them with `/skill <name>` or just by referencing them in a prompt.

---

## MCP servers

See `.mcp.json` for configured servers. Stubs exist for Atlassian, Notion, and Figma. Connect them with `claude mcp add` before running skills that depend on them.

---

## When in doubt

Read the README. Read `docs/architecture.md`. If still unclear, ask the user — don't guess on architectural decisions.
