# NEW SLIDES — Claude Code Fundamentals (4 slides)

> **Insert position:** Between Slide 23 ("Today you become the PM/designer your engineers wish they had") and Slide 24 ("PART 2 — Explore").
>
> **Becomes Slides 24, 25, 26, 27 in v12.** Everything after shifts +4.
>
> **Time on stage:** ~6 minutes (90 sec per slide, can flex faster on the day).
> **Style:** Match existing deck — dark theme, white text, subtle visuals. Each slide is its own concept with breathing room.

---

# SLIDE A — Plan Mode

**[Layout: Two-column. Left: title + headline + bullets. Right: visual showing the plan mode toggle.]**

**THE FUNDAMENTALS · 1 of 4**

## 🔍 Plan Mode

### Read-only exploration. Toggle near the input.

- **On** — Claude reads your files. Cannot edit anything.
- **Off** — Claude can write, edit, run commands.

**Use it for:** surveys, audits, scoping, "I just want to understand this codebase."

**Toggle off when:** you're ready for Claude to actually change something.

> *You'll use Plan Mode in Step 1 of every exercise tonight. It's the safety story for non-coders — you literally cannot break what you're not editing.*

**[Visual prompt for Gamma: A clean screenshot or illustration of the Plan Mode toggle in a chat interface — a switch labeled "Plan Mode" near a text input area, shown in both ON (highlighted) and OFF states.]**

### SPEAKER NOTES (90 sec)

- *"Plan Mode is the single most important feature for non-coders in this room."*
- *"On = read-only. Claude reads your files but cannot edit anything. Toggle the switch right next to the input box."*
- **Show me moment:** Cmd+Tab to Claude Desktop. Toggle Plan Mode on, then off. *"On. Off. On. Off. That's the whole interface."*
- *"Why this matters: in Plan Mode you literally cannot break anything. If you're nervous about Claude editing files in front of you, Plan Mode is your training wheels — and you can keep them on as long as you want."*
- *"We use Plan Mode in Step 1 of every exercise tonight. The 'survey' step is always read-only. Claude reads, plans, asks questions. Then you toggle off and let it write."*
- **Bridge:** *"Next concept — the file Claude reads at the start of every session, automatically."*

---

# SLIDE B — CLAUDE.md

**[Layout: Two-column. Left: title + headline + explanation. Right: a screenshot or visual of a CLAUDE.md file content.]**

**THE FUNDAMENTALS · 2 of 4**

## 📋 CLAUDE.md

### The project memory file. Lives at the repo root.

- Markdown file Claude reads at the start of every session — **automatically.**
- Tells Claude: what this product is, what conventions matter, what files to avoid touching, what to grep when in doubt.
- Think of it as **the onboarding doc you wish your last new hire had.**

> *Tonight's repo has one. Claude is using it right now. You don't have to remind it.*

**[Visual prompt for Gamma: An open Markdown file showing CLAUDE.md content with sections like "What this product is", "Conventions", "Files to avoid", styled like a code editor or document viewer with a dark theme.]**

### SPEAKER NOTES (90 sec)

- *"CLAUDE.md is the project memory file. It lives at the root of any repo Claude reads."*
- *"You write it once. Claude reads it at the start of every session — you don't have to remind it."*
- *"What goes in it: what your product does, what conventions your team follows, what files Claude should never touch, where to grep when uncertain."*
- **Show me moment:** Open `CLAUDE.md` from the repo file panel. Show 5–7 lines on screen. Read 2 lines aloud. Close it.
- *"Tonight's repo has one. Claude already has it loaded. When the audit in Part 2 says things like 'this product is a freelance invoicing tool' — that's not Claude guessing. That's Claude reading CLAUDE.md."*
- *"Most teams don't have a CLAUDE.md yet. The first one you write is a 30-minute investment that pays off every session forward."*
- **Bridge:** *"Next concept — the most important one for the team-library thesis. Skills."*

---

# SLIDE C — Skills

**[Layout: Two-column. Left: title + headline + 3 short bullets. Right: visual showing the .claude/skills/ folder structure with file icons.]**

**THE FUNDAMENTALS · 3 of 4**

## 🛠️ Skills

### Reusable prompt patterns saved as Markdown.

- Live in `.claude/skills/` — one Markdown file per skill.
- Invoke with: *"Use the {skill-name} skill on this codebase."*
- **Three skills tonight: `product-audit`, `figma-to-component`, `prd-round-trip`.**

> *This is the team-library thesis. What you save tonight, your teammate runs next week — without writing a prompt.*

**[Visual prompt for Gamma: A file-tree visualization showing `.claude/skills/` folder with three files inside — `product-audit.md`, `figma-to-component.md`, `prd-round-trip.md`. Style it like a code editor file tree, dark theme, with small Markdown file icons.]**

### SPEAKER NOTES (90 sec)

- *"Skills are the lever. This is what makes Claude Code different from Cursor or Copilot."*
- *"A skill is a Markdown file in `.claude/skills/` that captures a prompt pattern. Once saved, you invoke it by saying 'use the X skill.' Claude reads the file, runs the pattern."*
- **Show me moment:** Open `.claude/skills/` folder in the file panel. Show the 3 starter skill files. Click into one — read the frontmatter (`name: product-audit`, `description: ...`).
- *"You'll save three tonight. One after Part 2. One after Part 3. One after Part 4. By the end of the night, you have three entries in your team's library."*
- *"Now the magic — your teammate clones this repo next Monday. They never typed a prompt. They say 'use the product-audit skill.' It runs. Same audit, same quality, zero ramp-up."*
- *"This is what I mean when I say Claude Code is a team operating system, not a personal tool. Skills are how one PM's good prompt becomes your team's standard practice."*
- **Bridge:** *"Last concept — how Claude Code talks to tools outside your codebase."*

---

# SLIDE D — MCP

**[Layout: Two-column. Left: title + headline + 3 examples. Right: visual showing the MCP hub-and-spoke diagram (Claude in center, tools around it).]**

**THE FUNDAMENTALS · 4 of 4**

## 🔌 MCP

### Model Context Protocol. How Claude Code reaches outside.

- Connects Claude to **external tools and services** — Figma, Jira, Slack, GitHub, your own services.
- Pre-configured for tonight in `.mcp.json` — you don't set up anything.
- Claude treats external sources **like just another file**: reads, writes, acts.

> *You'll use MCP in Part 3. Claude pulls a Figma frame as if it's reading a local file. Same protocol works for Jira tickets, Slack messages, Notion pages.*

**[Visual prompt for Gamma: Hub-and-spoke diagram. Claude Code in the center (highlighted), with spokes connecting to Figma, Jira, Slack, GitHub, Notion, and a generic "Your APIs" node. Dark theme. Use the same visual style as Slide 11 in the existing deck (the "2026 workspace" diagram).]**

### SPEAKER NOTES (90 sec)

- *"MCP — Model Context Protocol. The plumbing that lets Claude Code reach outside your codebase."*
- *"Tonight Figma is connected. That's how Part 3 works — Claude pulls a Figma frame and treats it like just another file in the repo."*
- *"Same protocol works for Jira, Slack, Notion, GitHub, and any custom service your team has an API for. There's a `.mcp.json` file in tonight's repo that lists what's connected. You don't configure anything — it's already set up."*
- *"For tonight, just know the word. When something happens in Part 3 that looks like Claude reading Figma — that's MCP. When you scope features at work next week and someone says 'can Claude read our Jira?' — the answer is yes, via MCP."*
- *"This is the protocol the whole industry is converging on. Cursor uses it. ChatGPT uses it. Whatever tool wins in 2027 will use it. The patterns transfer."*
- **Bridge:** *"Plan mode. CLAUDE.md. Skills. MCP. Four words. That's the whole vocabulary you need. Now — Part 2."*

---

## TIME-CHECK ADJUSTMENT

These 4 slides add ~6 minutes to Part 1 (vs the +4 min for the single combined slide).

**Updated time-check:**

| Block | Time | Notes |
|---|---|---|
| Pod intros | 17:00–17:10 (10 min) | |
| Part 1: Context | 17:10–18:01 (51 min) | +6 min for fundamentals slides |
| Part 2: Explore | 18:01–18:51 (50 min) | starts 6 min later |
| Break | 18:51–19:01 (10 min) | |
| Part 3: Constrain | 19:01–19:51 (50 min) | |
| Break | 19:51–20:01 (10 min) | |
| Part 4: Collaborate | 20:01–20:51 (50 min) | |
| Panel | 20:51–21:01 (10 min) | tighter — 2 panelists × 4 min + 2 min Q&A |
| Closing | 21:01–21:15 (14 min) | |

**Endpoint: 21:15** (15 min over original 21:00 target).

If you need to land at 21:00 hard, options:
- **Easiest:** 2 panelists × 4 min, no Q&A → saves 2 min
- **Plus:** Skip Slide 13 (Career Paths in keynote) → saves 90 sec
- **Plus:** Run each fundamentals slide in 60 sec instead of 90 sec (skip the "show me" moments) → saves 2 min
- **Combined:** lands you at 21:09 — still over, but acceptable

**My recommendation: don't fight the 15-min slip.** 21:15 is fine. The keynote content + fundamentals + exercises are all valuable; cutting any of them to save 15 min hurts more than running over.

---

## HOW TO ADD TO YOUR GAMMA DECK

**Option 1 (recommended given time pressure) — Add manually:**

1. Open your current Gamma deck
2. Click between current Slide 23 ("Today you become...") and current Slide 24 ("PART 2")
3. For each of the 4 slides above:
   - Click "Add slide"
   - Paste the content (everything between `# SLIDE X` and the next `# SLIDE` or `---`)
   - Set layout: 2-column (text left, visual right)
   - For the visual, paste the visual prompt from the `[Visual prompt for Gamma:]` line into Gamma's image-generation field
   - Theme: same as your current deck
4. Save

Total time: ~10 minutes for all 4 slides.

**Option 2 — Regenerate from outline:**
Less recommended right now (workshop is tomorrow). If you do want to do this for a future cohort, the slides above are clean enough to drop into the v11 Gamma outline at position 24-27.

---

## WHAT TO DO IF YOU'RE RUNNING LONG ON THE DAY

If at minute 25 of Part 1 you realize you're behind, here's the fast-forward order:

1. **Skip the "show me" moments** in Slides B (CLAUDE.md) and D (MCP) — saves ~30 sec each. Keep them in A (Plan Mode) and C (Skills) since those are the most important.
2. **If still behind:** rush through Slide D (MCP) in 30 sec — *"MCP connects Claude to external tools. You'll see it in Part 3 with Figma. That's all you need."* Click forward.
3. **If REALLY behind:** combine Slides B and D verbally — *"CLAUDE.md is project memory. MCP is how Claude reaches outside. Both are pre-configured tonight. Moving on."* Saves ~3 min total.

**Don't compromise on Slides A (Plan Mode) and C (Skills).** Plan Mode is the safety story (non-coders need it). Skills is the team-library thesis (the whole "why save anything" argument depends on it). Compromising on those undermines the rest of the workshop.

---

## CHEAT SHEET SYNC

These 4 concepts already appear on the cheat sheet's "5 power moves" section (Plan Mode, CLAUDE.md, Skills, MCP, plus slash commands as the 5th). The cheat sheet definitions match what's in these slides — no edit needed.

If you want to be cute, you could re-order the cheat sheet so the 4 you teach explicitly come first and slash commands comes last. But it's polish, not necessary.

---

*BrAIght Wave · Workshop deck v12 addition · Claude Code Fundamentals — 4-slide expansion · May 2026*
