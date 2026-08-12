# Cowork — Quick Reference

> **You watched this in Part 1. Here's how to do it yourself next week.**
> Cowork is for knowledge work that doesn't touch a codebase. Research synthesis, document drafting, scheduled tasks. Same Claude Desktop app, different tab.

---

## When to reach for Cowork (vs Claude Code)

| Use Cowork when… | Use Claude Code when… |
|---|---|
| You have a folder of notes/feedback/docs to synthesize | You need to read your team's actual code |
| You're drafting a doc from scratch | You're scoping a real feature |
| You want a scheduled task ("summarize every Monday") | You want to enforce design system rules |

**Rule of thumb:** No code involved → Cowork. Code involved → Claude Code.

---

## Setup (30 sec)

1. Open Claude Desktop
2. Click **Cowork** tab at the top
3. Click **New task**
4. Drag in a folder (or use folder picker)

---

## The synthesis prompt that works

```
Synthesize this customer feedback into a 1-page report —
top 3 themes by impact, with representative quotes.
```

That's it. Cowork reads the folder, runs for 60–90 seconds, produces a structured report.

---

## Prompts that get better results

**If output is too generic:**
```
Be more specific. What concrete issues are users complaining about?
Quote them directly. Use exact phrases from the feedback.
```

**If output is too long (5+ pages instead of 1):**
```
Tighten. One page max. Top 3 themes only. 2 quotes per theme.
```

**For a different task entirely (e.g., interview notes):**
```
Read these interview notes. Extract:
- Top 5 jobs-to-be-done
- Each job's pain level (1-5)
- Direct quote evidencing each job
```

**For document drafting (e.g., a brief from research):**
```
Based on the files in this folder, draft a 1-page brief covering:
- The problem
- Who it affects
- Three solution directions with tradeoffs
```

---

## What good looks like

For customer feedback synthesis:

✅ **3 distinct themes** (not "users seem unhappy")
✅ **Each theme has a real quote** from the source files
✅ **One page** — readable in under 60 seconds at a glance
✅ **Sentiment + frequency noted** ("32% of negative feedback mentions PDF speed")

If you don't get this on the first run, push back with the prompts above.

---

## Common gotchas

- **Cowork is folder-oriented** — give it a folder, not a single file when possible
- **It will run for 60–90 seconds** — don't kill it early
- **It works on Hebrew** — but verify the output preserves the original quotes, not translations
- **Don't paste content into the chat** — drag in the folder

---

## When NOT to use Cowork

- ❌ You need to read code → use Claude Code
- ❌ You need a quick one-off answer → use Claude.ai in browser
- ❌ The task is creative writing → Claude.ai is faster
- ❌ You need to ship a working feature → Claude Code, not Cowork

---

*BrAIght Wave · Claude Code for Product Teams · Cowork reference card*
