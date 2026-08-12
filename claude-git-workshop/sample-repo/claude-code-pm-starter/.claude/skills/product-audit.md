---
name: product-audit
description: Audit an unfamiliar codebase to produce a 1-page product brief — what the product does, every user-facing feature, what looks half-built, and three quick-win opportunities. Use this when you join a new team and need to ramp up fast without waiting on engineering.
---

# Product Audit

You are auditing this codebase for a PM who's joining the team. The PM is preparing for their first 1:1 with the CEO. Output should be a 1-page product brief they can bring to that meeting.

Run this 4-step pattern. Do all 4 steps. Do not skip step 4.

---

## Step 1 — Survey (read-only)

Use Read, Grep, Glob, and Bash (read-only commands only). Do NOT edit anything.

- Identify what this product is (a SaaS for X, a tool for Y).
- Map every user-facing feature you can find.
- Note the major moving parts: auth, data model, integrations, exports.
- If a `CLAUDE.md` exists, respect everything in it.

**Stop here.** Do not write the audit yet.

---

## Step 2 — Push back on yourself

Now answer, in 3-5 sentences each:

- What product is this *actually* for? (Don't trust the marketing copy in the README.)
- What's the riskiest thing about this codebase that a new PM should know?
- What did you miss in the survey?

---

## Step 3 — Write the product brief

Output exactly this format. No preamble.

**What this product is:** [1 paragraph in plain language — what it does, for whom]

**User-facing features:**
- [Feature name] — [1 sentence] — [the file or folder where it lives]
- [Feature name] — [1 sentence] — [the file or folder where it lives]
- (etc.)

**Three things that look half-built or buggy:**
1. [Thing] — [evidence: the file or pattern that gave it away]
2. [Thing] — [evidence]
3. [Thing] — [evidence]

**Three quick-win opportunities (shippable in a sprint):**
1. [Opportunity] — [why it's a quick win] — [files that would change]
2. [Opportunity] — [why it's a quick win] — [files that would change]
3. [Opportunity] — [why it's a quick win] — [files that would change]

**Three questions for the CEO:** [things you couldn't figure out from the code alone]

---

## Step 4 — Self-critique

Read the codebase one more time. Find 3 things in your own audit that are wrong, missing, or under-specified.

**On reflection:**
1. [issue with what you wrote] — [what would fix it]
2. [...]
3. [...]

---

## Notes for the user of this skill

- Run this in **plan mode** the first time on a new codebase. (In the Desktop app: click the mode button. In the CLI: Shift+Tab.) Plan mode is read-only — it will not edit any files.
- The 4-step pattern is the value, not any single step. Don't skip step 4 — the self-critique is where Claude catches the things it confidently got wrong.
- Use this every time you join a new team or inherit a new codebase. The pattern works for products you've never seen before.
- **Stretch use:** swap "first 1:1 with the CEO" for "first 1:1 with my new VP" or "first sprint planning meeting." The output adjusts naturally.
- **Advanced use:** once you're comfortable, run this with multi-perspective subagents — have an Engineer subagent, an Executive subagent, and a Designer subagent each produce their own audit. Compare outputs. The disagreements are where the interesting questions live.
