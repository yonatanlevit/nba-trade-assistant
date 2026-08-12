# Architecture

A short tour of how InvoiceFlow is wired.

## Stack

- **Next.js 14** with the App Router. Server components by default.
- **Prisma** as the ORM. **SQLite** for development (no external DB needed).
- **NextAuth** for auth. Email/password only today.
- **Tailwind CSS**. The design system primitives live in `components/ui/` and consume tokens from `tokens.json`.

## Routes

- `/` — redirects to `/dashboard` (if logged in) or `/login`.
- `/login`, `/signup` — public.
- `/dashboard` — main dashboard, revenue snapshot.
- `/invoices`, `/invoices/new`, `/invoices/[id]` — invoice CRUD.
- `/customers` — customer list.
- `/settings` — profile and flag display.

The dashboard pages live under `app/(dashboard)/` (a Next.js route group — no URL segment), which lets them share a layout without affecting paths.

## API

- `/api/auth/[...nextauth]` — NextAuth standard.
- `/api/auth/signup` — custom signup.
- `/api/invoices` — GET list, POST create.
- `/api/pdf/[id]` — generates an invoice PDF. Uses pdfkit by default; switches to puppeteer when `BETA_PDF_EXPORT` flag is on.

## Data model

```
User ─┬─ Customer ─── Invoice ─┬─ LineItem
      │                        └─ Payment
      └─ Invoice (also)
```

A user owns customers and invoices. Invoices have many line items and many payments.

## Known issues (read before working)

- **`lib/auth.ts` is intentionally tangled.** Session helpers, user lookup, and password verification all live in one file. A refactor is planned, not started. Adding SSO requires touching this file carefully.
- **PDF export uses two libraries.** `lib/pdf/pdfkit-export.ts` is the original. `lib/pdf/puppeteer-export.ts` is the half-finished migration. The `BETA_PDF_EXPORT` flag toggles between them. Puppeteer version is unstyled.
- **Currency formatting is duplicated in 4 places.** `lib/currency.ts` is canonical. The duplicates in `components/invoice/invoice-list.tsx`, `app/(dashboard)/page.tsx`, `app/api/pdf/[id]/route.ts`, and `lib/pdf/puppeteer-export.ts` all do it slightly differently.
- **`MULTI_CURRENCY` flag is partially broken** — many display paths assume USD.
- **`NEW_DASHBOARD` flag is half-built** — dashboard renders a placeholder when it's on.

These are known. Don't open new investigations into them unless your task is to fix them.

## Auth flow

```
LoginPage (client) ──signIn──> NextAuth credentials provider ──verifyPassword──> bcrypt.compare ──> Session JWT
                                                                                                       │
                                                                                                       ▼
                                                                         requireUser() in server components
```

`requireUser()` is the primary helper for server components and API routes. It throws on no session.

## Adding SSO (the Part 1 workshop task)

Realistic scope:
1. Install `@next-auth/prisma-adapter`.
2. Add `Account` model to `prisma/schema.prisma` and migrate.
3. Add `GoogleProvider` and `MicrosoftProvider` (`AzureAD`) to `authOptions.providers`.
4. Re-think the session callback — OAuth users won't go through `verifyPassword`, so `currencyCode` won't be in their token.
5. Update `lib/auth.ts` to populate `currencyCode` from the DB on session callback.
6. Update the login page UI to show provider buttons.
7. Add env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AZURE_AD_*`.
8. Update `docs/architecture.md` to reflect the new flow.

That's a 2-week feature for a careful engineer, faster if the auth file is refactored first.
