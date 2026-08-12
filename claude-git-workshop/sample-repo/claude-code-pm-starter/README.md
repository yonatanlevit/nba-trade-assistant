# InvoiceFlow

> Freelance invoicing made simple. Built by [Imaginary Co.] for the BrAIght Wave Claude Code workshop.

A small SaaS-style codebase used as the working sandbox for the **Claude Code for Product Teams** workshop. Realistic enough to scope features against. Small enough to onboard in an afternoon.

---

## Quick start

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Login with seeded data:**
- Email: `demo@invoiceflow.test`
- Password: `password123`

(There are 5 seeded users — see `prisma/seed.ts` for the rest.)

---

## What this app does

InvoiceFlow is a freelance invoicing tool. Users send invoices to their customers, track payments, and export PDFs.

**Features:**
- Email/password auth (no SSO yet — kept simple intentionally; SSO scoping is a Track-C stretch task in the workshop)
- Dashboard with revenue snapshot
- Invoice CRUD
- Customer list
- PDF export (two implementations behind a feature flag)
- Multi-currency support (partially broken behind a flag)
- Settings page with flag display

---

## Stack

- **Next.js 14** (App Router, server components by default)
- **TypeScript** strict mode
- **Prisma** + **SQLite** (no external DB needed)
- **NextAuth** for auth
- **Tailwind CSS** + small design system in `components/ui/`
- **Vitest** for tests

See `docs/architecture.md` for the tour.

---

## Where things live

- `app/(auth)/` — login and signup
- `app/(dashboard)/` — everything behind auth
- `app/api/` — API routes
- `components/ui/` — design system primitives. Use these.
- `components/invoice/` — feature-specific components
- `lib/` — utilities, auth, currency, PDF, db
- `prisma/` — schema and seed
- `tokens.json` — design tokens
- `docs/` — architecture, PRDs (workshop participants save here)
- `.claude/` — `CLAUDE.md`, skills, slash commands, agents
- `workshop-data/` — synthetic CSVs and JSON for the workshop's optional internal-tool stretch

---

## Feature flags

Defined in `lib/flags.ts`:

- `NEW_DASHBOARD` — half-built redesign. Don't touch unless your task is the redesign.
- `BETA_PDF_EXPORT` — newer puppeteer-based PDF export. Existing flow uses pdfkit.
- `MULTI_CURRENCY` — partially broken multi-currency display.

---

## Known issues

These are **known** and deliberate — don't go investigating unless your task is to fix them:

- PDF export is slow on invoices with many line items (mid-migration between two libraries).
- Currency formatting is duplicated in 4 places and inconsistent.
- `lib/auth.ts` is tangled — refactor planned, not started.
- Some tests are skipped.

See `docs/architecture.md` for the details.

---

## Workshop usage

This repo is the working sandbox for the [Claude Code for Product Teams workshop](https://braightwave.com/workshops/claude-code).

The workshop has three hands-on parts. Each one uses a starter skill from `.claude/skills/`:

- **Part 2 — Explore.** You audit this codebase as if you've just joined the InvoiceFlow team. Use the `product-audit` skill to produce a 1-page audit (what it is, features, what's half-built, quick wins, questions for the CEO).
- **Part 3 — Constrain.** You generate a new component from a Figma frame, making sure it respects the design system in `components/ui/` and `tokens.json`. Use the `figma-to-component` skill.
- **Part 4 — Collaborate.** You synthesize real customer feedback from `workshop-data/feedback.csv`, write a PRD against `docs/prd-template.md`, switch hats to implement, then revise the PRD. Use the `prd-round-trip` skill.

Read `CLAUDE.md` first — it's the project memory Claude Code reads at session start.

---

## License

MIT.
