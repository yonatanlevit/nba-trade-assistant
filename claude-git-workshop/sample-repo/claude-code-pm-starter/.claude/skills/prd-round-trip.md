---
name: prd-round-trip
description: Run a complete PM ↔ Dev ↔ PM round-trip on a feature. Writes a grounded PRD, implements it, critiques the implementation, and revises the PRD based on what was learned. Use this when you want to compress a normally 2-week spec-build-feedback cycle into one session.
---

# PRD Round-Trip

Run a full PRD round-trip on this feature: $ARGUMENTS

You will play three roles in sequence. **Be explicit about which role you're in at each step.** Print "ROLE: [name]" before each phase.

---

## ROLE 1 — PM (write the grounded PRD)

Survey the codebase first using Read, Grep, Glob. Then write the PRD with these sections:

**Problem:** [the user pain in 1-2 sentences]

**Users:** [who specifically — be concrete]

**Scope:** [bullets — what's in]

**Out of scope:** [bullets — what's deliberately not in]

**Acceptance criteria:** [each one names the file or function it touches]
- AC1: [criterion] — touches `path/to/file.ts`
- AC2: [...]

**Open questions:** [things you couldn't answer from the code alone]

Save the PRD as `docs/prd-{feature-slug}.md`.

---

## ROLE 2 — Dev (implement it)

Switch hats. You are now an engineer reading the PRD cold for the first time.

- Read `docs/prd-{feature-slug}.md` from disk (don't rely on what you just wrote — re-read it).
- Implement the simplest version that meets the acceptance criteria.
- After implementing, list every place where the PRD was unclear or wrong, and how you interpreted it.

Output format for the dev's notes:

**Implementation notes:**
- AC1: implemented as [...]. PRD was clear.
- AC2: implemented as [...]. **PRD was ambiguous about [X]; I interpreted it as [Y].**
- AC3: [...]

**Things that surprised me about the codebase:** [bullets]

**Pushback to PM:** [things in the PRD that don't make sense given what's in the code]

---

## ROLE 3 — PM again (revise the spec)

Switch back. Read the diff and the dev's interpretation notes.

Output:

**What the spec got right:** [bullets]

**What the spec got wrong:** [bullets — be specific, name the AC]

**Revised acceptance criteria:** [the actual rewritten ACs, with the dev's pushback incorporated]

**What I learned about my own spec process:** [1 paragraph — this is the keep-forever insight]

Save the revised PRD as `docs/prd-{feature-slug}-v2.md`.

---

## Notes for the user of this skill

- Run the whole skill in one Claude Code session. Switching sessions breaks the role hand-off.
- The dev's pushback (Role 2) is where the real value is. Don't let Claude rush past it.
- If you're feeling brave, replace this single-session skill with two specialized subagents (`.claude/agents/pm-spec.md` and `.claude/agents/dev-implementer.md`) — see the workshop's advanced track. The role separation is cleaner.
- The "what I learned about my own spec process" reflection is the most underrated output. Read your own across multiple features and patterns will emerge.
