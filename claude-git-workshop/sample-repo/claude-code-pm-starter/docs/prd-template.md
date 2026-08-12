# PRD — [Feature name]

> **Status:** Draft · **Author:** [PM name] · **Date:** [today]
>
> *Replace this header. Keep the structure below. Fill it in against the codebase — cite real files for every claim.*

---

## Problem

*One paragraph. Describe the user pain. Reference the customer feedback that surfaced it (cite specific feedback rows or themes from `workshop-data/feedback.csv`).*

## Users

*Who experiences this problem? Be specific — which plan tier (free / pro / team), which usage pattern, which jobs-to-be-done.*

## Acceptance criteria

*A bulleted list of testable conditions. Each item should be specific enough that an engineer can write a test for it. No vague "improve UX." Concrete verbs: "displays," "blocks," "redirects," "stores."*

- [ ]
- [ ]
- [ ]

## Files involved

*List the files that would change. Cite paths from the codebase. If new files are needed, name them.*

- `app/...` —
- `lib/...` —
- `prisma/schema.prisma` — (if data model changes)

## Out of scope

*What this PRD deliberately does NOT cover. Be explicit — this is where ambiguity hides.*

## Open questions

*What you don't know yet. Engineering will hit these during implementation. List them here so the conversation happens before code is written.*

---

*This skeleton is intentionally minimal. The Part 4 round-trip exercise teaches you to fill it in, then implement against it, then revise it based on what implementation surfaced. The revised version should be saved as `docs/prd-{feature}-v2.md`.*
