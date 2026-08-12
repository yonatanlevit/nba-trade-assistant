# bball-GM.com — Trade Machine Reference

Reference for the **bball-GM.com** ("NBA Trade Machine") onboarding exercise. Describes how the site works, its API, and what the GUI shows — so you can design a chat-first alternative.

**Live site:** http://bball-gm.com

---

## What it is

bball-GM is a conventional **GUI trade builder**: pick teams, click players and draft picks onto each side, the app validates and shows a verdict with per-team salary math and CBA citations.

Architecture:
- **Client** — Vite + React SPA. Builds trade state, debounces 300 ms, POSTs to the server. **No legality logic in the browser** — only presentation and a local salary-override "what-if" layer (`localStorage`).
- **Server** — Closed validation engine at `POST /api/trades/validate`. Returns structured JSON verdicts.

```text
User clicks players/picks in GUI
  → client assembles trade JSON
  → debounce 300ms
  → POST /api/trades/validate
  → server returns { isValid, summary, appliedRules[], teams[] }
  → GUI renders per-team cards + CBA rules modal
```

**North star for your exercise:** today the mouse drives state. Your job is to flip that — conversation drives state, GUI mirrors it.

---

## API surface

Base URL: `https://bball-gm.com/api`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/teams` | GET | All teams |
| `/teams/{id}` | GET | Single team |
| `/players` | GET | All players |
| `/players/{id}/contract-options` | GET | Signing options for free agents |
| `/players/{id}/sign` | POST | Sign a free agent |
| `/draft-picks` | GET | All draft picks |
| `/salary-cap` | GET | League cap constants |
| `/salary-cap/teams` | GET | Per-team cap status |
| `/trades/validate` | POST | **Trade validation engine** |

You can inspect these in browser devtools while using the site. For your prototype, `POST /trades/validate` is the key endpoint — you don't need to rebuild CBA logic.

---

## Validation request schema

Up to **4 teams**. Each leg has explicit send/receive routing:

```jsonc
{
  "teams": [                      // minimum 2
    {
      "teamId": 10,
      "sendingPlayerIds": [17123],
      "receivingPlayerIds": [16990],
      "sendingPickIds": [],
      "receivingPickIds": [],
      "isSignAndTrade": true,     // optional
      "usingExceptionId": "…"     // optional
    }
  ],
  "salaryOverrides": [],          // optional what-if salary edits
  "signedFreeAgents": []          // optional S&T signings
}
```

The GUI resolves player/pick destinations before sending — each asset has a named source and destination team.

---

## Validation response schema

```jsonc
{
  "isValid": false,
  "summary": "Trade is invalid. New York Knicks do not satisfy salary matching requirements.",
  "appliedRules": [
    "NBA CBA 2023 (2026-27 season) — Art. VII §6(j) Traded Player Exception",
    "§6(j)(1)(i) + Table row E: First-apron teams are limited to the Standard TPE …"
  ],
  "teams": [
    {
      "teamId": 18,
      "teamName": "New York Knicks",
      "salaryOut": 57100000,
      "salaryIn": 50100000,
      "netSalaryChange": -7000000,
      "newTotalSalary": 210600000,
      "newCapStatus": "Over First Apron",
      "allowances": [
        "Standard TPE (first apron): Sending $57.1M, can receive up to $57.1M (100%), matching $50.1M"
      ],
      "violations": [],
      "isValid": true
    }
  ]
}
```

### What the GUI shows (and your chat must too)

| Field | GUI use | Chat design question |
|-------|---------|---------------------|
| `summary` | Headline verdict strip | One line or expanded? |
| `teams[].salaryOut/In`, `netSalaryChange` | Per-team money math cards | Show all teams or summarize? |
| `teams[].newCapStatus` | Apron badge per team | Inline or on demand? |
| `teams[].allowances` | How matching was computed | Full detail vs summary? |
| `teams[].violations` | Why a team failed | Plain text vs structured cards? |
| `appliedRules` | "CBA rules" modal | Link out, cite inline, or collapse? |

**Design challenge:** the GUI shows rich structured output. Your chat interface must present the same information in a form that reads naturally in conversation — not a JSON dump.

---

## Cap constants (2026-27 season)

From `GET /api/salary-cap`:

| Constant | Value |
|----------|-------|
| Salary cap | $165.0M |
| Luxury tax line | $201.0M |
| First apron | $209.0M |
| Second apron | $222.0M |
| Trade-match add-on | $0.25M |
| Trade-match flat add-on | $9.4M |

Data is **rounded and synthetic** — fictional rosters (not real NBA assignments). Fine for prototyping interaction; don't treat as ground-truth roster data.

---

## Matching tiers (how verdicts are computed)

The engine picks a matching rule based on each team's cap tier:

| Cap tier | Matching rule (simplified) |
|----------|------------------------------|
| Under cap | Cap room + outgoing + $250K only |
| Over cap, below first apron | Expanded bands (125% / 200% / 100%+$9.4M), capped at first apron |
| First apron | Strict 100% of outgoing |
| Second apron | Cannot increase net salary |

You don't need to implement these rules — call the API. You **do** need to decide how to *explain* them in chat when the user asks "why is this illegal?"

---

## Error handling

The API uses two failure channels:

- `HTTP 200` with `{ isValid: false, violations: [...] }` — salary/apron problems
- `HTTP 400` with `{ error: "…" }` — Stepien rule, stretch provision, schema errors

Your chat UI should handle both and present errors clearly to the user.

---

## Hands-on before you design

1. Open http://bball-gm.com and build 2–3 trades (one legal, one illegal, one multi-team if you can).
2. Watch network tab for `POST /api/trades/validate` — note request shape and response.
3. Click "CBA rules" in the GUI — see what `appliedRules` looks like rendered.
4. Ask yourself: *what would I want to see in chat instead of clicking around?*

---

## Out of scope for this reference

This document describes **bball-GM's website behavior** only. It is not a CBA textbook and does not cover Gambit's internal systems. For the onboarding task, use bball-GM's API or mocks — do not build a trade-legality engine from scratch.
