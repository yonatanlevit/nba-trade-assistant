# Claude Code Cheat Sheet — for PMs & Designers

> Print this 1-pager. Tape it next to your laptop. The 20 things you'll actually use.

---

## The 5 power moves

| Move | What it does | When to use |
|---|---|---|
| **Plan mode** | Read-only. Claude maps the work before touching anything. | Anything you're not 100% sure about. Most of the time. |
| **`CLAUDE.md`** | Project memory in plain English. Claude reads it on every session. | Every project you open. Add to it as you learn what Claude misses. |
| **Custom slash commands** | Save a one-off prompt as `/your-name`. | Anything you do more than twice. |
| **MCP** | Plug Claude into your tools (Jira, Notion, Figma, GitHub). | When the work lives outside the file system. |
| **Skills** | Save a working prompt as `SKILL.md`. Run again next week, no thinking. **Share the file with your team — it's a library entry.** | Every time you nail a pattern. |

---

## Cowork vs Claude Code — when to use what

Both live inside the Claude Desktop app. Different tabs, different jobs.

| Reach for... | When you're doing... | Examples |
|---|---|---|
| **Cowork tab** | Knowledge work that doesn't touch a codebase | Synthesizing 200 customer comments. Turning meeting notes into a deck. Organizing a Downloads folder. Scheduled recurring tasks. |
| **Code tab** ⭐ | Code-grounded work — you need Claude to read your real codebase | Scoping a feature. Auditing a product you just inherited. Generating a component against your design system. PRD round-trips. |

**Default:** start in the Cowork tab unless you specifically need Claude to read or edit code.

**Today's workshop is in the Code tab.** Cowork is what you'll use Monday morning for daily knowledge work.

---

## In the Desktop app — the buttons that matter

- **New session** — top-left sidebar. Pick a folder; Claude opens with that folder as context.
- **Mode toggle** — near the input box. Cycles **Default → Plan → Accept-edits → Bypass**. Click once to step forward; long-press for the menu.
- **Stop button** — interrupts Claude mid-task. Use this when Claude is heading the wrong direction.
- **Plan sidebar** — right side when plan mode is active. Shows each step Claude intends to take. You can edit a step or interrupt.
- **File tree** — left side. Shows files Claude has read or edited. Click a file to open it inline.
- **Settings → MCP servers** — connect Atlassian, Notion, Figma, GitHub through the GUI.
- **Settings → Models** — switch between Sonnet (fast) and Opus (deeper reasoning).

## In the CLI — the commands that matter (for advanced users)

```bash
claude                    # start a session in the current folder
claude -c                 # continue your last session
/init                     # generate a CLAUDE.md from the codebase
/clear                    # wipe context. Use between unrelated tasks.
/compact                  # summarize context when it's getting heavy
/cost                     # see your token spend so far
/model opus               # switch to Opus for hard reasoning
Shift+Tab                 # cycle modes (Default → Plan → Accept-edits → Bypass)
Esc                       # interrupt Claude mid-task
@filename                 # mention a specific file
```

---

## The 3 patterns you learned today

### 1. Product audit (4 steps, never skip step 4)
Open the project folder in Claude. Switch to plan mode. Then:
1. **Survey** — "Read the codebase. What does this product do? What features exist?"
2. **Push back.** "What did you miss? What looks half-built?"
3. **Audit.** Produce: what it is, features (with files), three half-built things, three quick wins, three questions for the CEO.
4. **Self-critique.** "Find 3 things in your own audit that are wrong."

### 2. Figma → component (system-first)
Connect Figma MCP via Settings → MCP servers. Read the system FIRST (`tokens.json`, `components/ui`, `CLAUDE.md`). Then read the frame. Then build using only system primitives. Mark every system bend with `// SYSTEM-BEND:`.

### 3. PRD round-trip
**Step 0 (Synthesize):** scan the customer feedback file. Find the top theme. Define the feature.
**Role 1 (PM):** Write the grounded PRD.
**Role 2 (Dev):** Implement it. Note ambiguities.
**Role 3 (PM again):** Read the diff. Revise the PRD.

---

## Steering Claude when it goes wrong

| Symptom | What to do |
|---|---|
| Going in circles | Click the **Stop** button, then type "stop. that's the wrong direction. let's restart with X." |
| Confidently wrong | "Read the file again. What did you miss?" |
| Inventing things | "Show me the line in the actual code. If it's not there, say so." |
| Too verbose | "One paragraph. No preamble." |
| Context heavy / slow | Start a new session and re-open the same folder |
| Lost the thread | New session. Restart with a tighter prompt. |

---

## The pushback playbook

> First answers from Claude are rarely the best ones. Copy these prompts. Use them often.

| Prompt | When to use |
|---|---|
| *"Show me where in the actual code this is true. If it's not, say so."* | When Claude makes a confident claim about the codebase. |
| *"What assumptions are you making?"* | When the answer feels too smooth or generic. |
| *"List the edge cases you're missing."* | Always. Before accepting any output. |
| *"Cite the exact file for each claim."* | When the output is abstract. |
| *"What would a senior engineer disagree with here?"* | When you suspect the answer is too optimistic. |
| *"What did you skip that I should have asked about?"* | At the end of any complex task. |

**The Challenger's job in your pod:** the experienced person doesn't drive the keyboard — they drive the pushback. Their voice is "wait, is that actually right?"

---

## Authentication paths

- **Pro $20/mo** — recommended for most. Includes Claude Code (Desktop + CLI).
- **Max $100 / $200** — for heavy daily use. Adds computer use, remote sessions.
- **Teams / Enterprise** — your company plan, ask your admin.
- ❌ **Free tier does NOT include Claude Code.**

---

## When Claude Code wins vs alternatives

| Tool | Best for |
|---|---|
| **Claude Code Desktop** | Real codebases, multi-file work, MCP, file system, iteration depth — **all without a terminal** |
| **Claude Code CLI** | Same as Desktop, plus headless automation, scripts, advanced flags |
| **Claude.ai (browser)** | Thinking, drafting, research, single-file work |
| **Lovable / Bolt / v0** | Disposable prototypes, marketing pages |
| **Cursor** | If you live in the IDE; Claude Code patterns transfer |

> **Rule of thumb:** If your output is an image, use Lovable. If your output is a file system, use Claude Code.

---

## Where to ask when stuck

1. **Your pod first.**
2. **The cohort Slack/Discord channel** (link in your invite).
3. **The graduate panelists** — they agreed to be reachable.
4. **Then** Google / ChatGPT.

---

*BrAIght Wave · Claude Code Workshop · April 2026*
