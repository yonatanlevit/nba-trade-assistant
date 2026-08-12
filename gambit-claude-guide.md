# Claude Learning Guide — for new Gambit Sports Product Managers

> A self-paced onboarding to Claude Code, built on top of Shmulik's "Claude Code for Product Teams" workshop (May 7, 2026). Work through it solo — by the end you'll have three reusable skills in your `~/.claude/skills/`, one of them pushed as a PR to our team repo `gambit-labs/gambit-ai-config`.
>
> **Author:** Ido — using the workshop materials in `Claude Learning/claude-workshop/`
> **Time budget:** ~8–10 hours total, spread across 2–3 sittings.
> **Audience:** new PMs at Gambit Sports — assumes zero Claude Code experience and **basic-to-zero git knowledge**, comfortable opening a terminal, GitHub access to `gambit-labs/gambit-ai-config`.

---

## How to use this guide

Read it top-to-bottom. Don't skip the course. Don't skip the concepts. The hands-on workshop replay only makes sense once you have the vocabulary.

The arc is exactly the one Shmulik used, plus a Git primer because every workflow below ends with a PR:

1. **Foundations** — Anthropic's official Claude Code course
2. **The 5 concepts you must internalize** — `CLAUDE.md`, memory, context/state, `SKILL.md`, slash commands
3. **Git for AI-coding tools** — commit, branch, checkout, rebase, PR, worktree, Git Graph, GitHub Actions
4. **Hands-on (the workshop replay)** — three real exercises: Explore → Constrain → Collaborate
5. **The two Gambit rules** — when to make a skill, where to push it
6. **Going to production at Gambit** — global skills, the `gambit-ai-config` repo, and PR etiquette

If any step fails, ping the team in `#ai-tooling` on Slack. You're not stuck alone.

---

## Step 0 — Take the official course first

Before you touch any Gambit code or Shmulik's workshop materials, take Anthropic's free course:

> 🔗 **Claude Code in Action** — https://anthropic.skilljar.com/claude-code-in-action

Budget 2–3 hours for it. Do not skim. The course covers the core mental model (sessions, context, plan mode, slash commands, hooks, MCP) better than I can in this doc — this guide is the *Gambit-specific* layer on top of it.

When you finish the course you should be able to answer, without looking it up:

- What is plan mode and when do you toggle it?
- What does Claude read automatically at the start of every session?
- What's the difference between a slash command and a skill?
- What does Claude *forget* when you start a new session, and what does it *keep*?

If you can't, re-watch the relevant module before continuing.

---

## Step 1 — The 5 concepts every Gambit PM must internalize

These are the words you'll use every day. The course teaches them; this section drills them through the lens of how we work at Gambit.

### 1.1 `CLAUDE.md` — the project memory file

`CLAUDE.md` is a Markdown file that lives at the root of a repo. Claude reads it **automatically** at the start of every session in that folder. You don't have to remind it.

What goes in it:

- What this product is (one paragraph, plain English).
- The stack (Next.js? Python? Postgres?).
- Conventions Claude must follow (e.g. "server components by default", "currency formatting goes through `lib/currency.ts`").
- Files Claude must **never** touch (e.g. `prisma/migrations/`, `package-lock.json`).
- Known issues so Claude doesn't "discover" them as bugs and waste your time.

A good real-world example is in the workshop sample repo: `claude-workshop/sample-repo/claude-code-pm-starter/CLAUDE.md`. Open it and read all 113 lines — that's the standard you should hold our `CLAUDE.md` files to.

> **Gambit rule:** every Gambit repo you work in should have a `CLAUDE.md`. If it doesn't, **adding one is your first PR.** Spend 30 minutes; it pays back every Claude session forever.

Keep it under 150 lines. Bigger context = slower, lazier Claude. Move details to separate files and `@`-import them.

### 1.2 `memory.md` and how it differs from `CLAUDE.md`

This is where most new PMs get confused. Don't.

| | `CLAUDE.md` | `memory/` directory (and `memory.md`) |
|---|---|---|
| **Lives at** | Repo root | Your global Claude config — `~/.claude/memory/` (and a top-level `CLAUDE.md` in your home Claude folder for working memory) |
| **Scope** | One project | You — across every project, every session |
| **Loaded** | Automatically when you open that folder | Loaded on every Claude session, anywhere |
| **Contains** | Project facts (stack, conventions, files-to-avoid) | Personal facts (your role, your team, your shorthand, who's who at Gambit) |
| **Updated by** | The team — committed to git | You — typically through the `productivity:memory-management` skill |

In other words: **`CLAUDE.md` is "what this project is." `memory/` is "who I am and how Gambit talks."**

A good `memory/` file teaches Claude that "GAM-XX" is a Linear ticket, that "Shmulik" runs our AI workshops, that "the streakkeeper repo" is a Python habit tracker, etc. Without it, every session starts from zero and you re-explain everything.

Use the productivity plugin's `memory-management` skill to seed your `memory/` (it's already installed in your Claude Desktop). After two or three Claude sessions where you say "remember this for next time", you'll have a real personal Claude.

### 1.3 Context, state, and what Claude forgets

Three words. They sound similar. They are not.

- **Context** = what's currently in Claude's "head" right now: this session's messages, files Claude has read, tool results. Token-budgeted; gets full and slow.
- **State** = the actual files on disk after Claude edits something. Survives sessions. Survives reboots. This is the *real* output.
- **Memory** = `CLAUDE.md` (project) + `memory/` (personal). The only things Claude reliably remembers between sessions.

Practical implications you'll feel daily:

1. **`/clear` wipes context, not state.** Your edited files are still on disk. Use `/clear` between unrelated tasks — it makes Claude faster and cheaper.
2. **`/compact` summarizes context** when it's getting heavy. Use this when the session has been running for an hour and Claude is starting to drift.
3. **A new session forgets everything except `CLAUDE.md`, `memory/`, and the files in the folder.** If Claude figured something out clever in session A, *write it down somewhere* before session B.
4. **Long sessions get worse, not better.** When Claude starts repeating itself or "losing the thread", start a new session and restart with a tight prompt referencing the file paths that matter.

> **Gambit rule:** if you said something to Claude twice this week, it doesn't belong in a session — it belongs in `CLAUDE.md`, in your `memory/`, or in a skill.

### 1.4 `SKILL.md` — reusable prompt patterns

A skill is a Markdown file that captures a multi-step prompt pattern. It lives in `.claude/skills/<skill-name>.md` (project skill) or `~/.claude/skills/<skill-name>.md` (global skill, available everywhere).

Anatomy of a skill (you'll write three today):

```markdown
---
name: product-audit
description: Audit an unfamiliar codebase to produce a 1-page brief — what it does, every user-facing feature, what looks half-built, three quick wins. Use when joining a new team.
---

# Product Audit

You are auditing this codebase for a PM joining the team...

## Step 1 — Survey (read-only)
[instructions]

## Step 2 — Push back on yourself
[instructions]

## Step 3 — Write the product brief
[output format]

## Step 4 — Self-critique
[instructions]
```

Two things make a skill good:

1. **The `description` is the trigger.** Claude reads descriptions to decide which skill to run. If yours is vague ("Audit code"), Claude won't pick it. If it's specific ("Audit an unfamiliar codebase to produce a 1-page brief… use when joining a new team"), Claude will reach for it correctly.
2. **It includes a self-critique step.** The single highest-leverage prompt pattern in this entire guide is "now find 3 things you got wrong." Bake it into every skill you write.

You invoke a skill by saying "use the `product-audit` skill on this codebase" or by enabling the skill globally and letting Claude pick it based on the description.

### 1.5 Slash commands — the one-liner version of skills

Slash commands live in `.claude/commands/<name>.md`. Same idea as skills, but invoked explicitly with `/name` and typically much shorter — single-purpose, no subagents, often parameterized.

Rule of thumb:

- **Multi-step pattern with self-critique?** → skill.
- **One-liner you type often?** → slash command.

Examples of slash commands you'll want at Gambit:

- `/standup` — generate today's standup from your recent commits and Linear tickets
- `/linear-autopilot GAM-XX` — drive a Linear issue end-to-end (we already have this in our config)
- `/review` — review the current PR

You can see existing Gambit slash commands in `gambit-labs/gambit-ai-config` — it's worth cloning that repo right now and reading what's already there.

---

## Step 2 — Git for AI-coding tools (a primer)

Claude Code edits real files in real repos. If you don't have a working git mental model, you'll either lose work or merge garbage. This section covers exactly the eight things you need — no more.

> **Setup once, before anything below:**
>
> ```bash
> git config --global user.name "Your Name"
> git config --global user.email "you@usegambit.ai"
> # Recommended:
> git config --global pull.rebase true     # rebase on pull instead of merge
> git config --global init.defaultBranch develop
> ```

### 2.1 commit — saving your work

A commit is a snapshot of your changes. After Claude makes edits you like, commit them so you can roll back if Claude messes things up later.

```bash
git status                 # what changed?
git diff                   # show the actual line-level changes
git add <file> <file2>     # stage specific files
git add -p                 # stage chunks interactively (better than -A)
git commit -m "feat: add product-audit skill"
```

**Conventional Commits at Gambit:** `feat:` for new things, `fix:` for bug fixes, `chore:` for housekeeping, `docs:` for docs-only. The CI on `gambit-ai-config` enforces this — bad commit messages get rejected.

> **AI-coding tip:** commit *small* and *often*. After every meaningful Claude turn that you're keeping, commit. That way when Claude later goes off the rails on the next change, you `git reset --hard HEAD` and you're back to a known-good state without losing the earlier work.

### 2.2 branch — isolated workstreams

A branch is a parallel timeline of commits. **Never work directly on `develop` or `main`.** Always make a branch for the change, push it, open a PR, get review, merge.

```bash
git branch                                # list local branches
git branch -a                             # list local + remote
git switch -c feat/add-product-audit-skill  # create + switch in one step
git switch develop                        # switch to develop
```

**Gambit naming convention** (matches our Linear autopilot):

- `feat/GAM-123-short-description` for new work tied to a Linear ticket
- `bugfix/GAM-456-short-description` for fixes
- `chore/short-description` for non-ticketed housekeeping (e.g., adding a skill)

### 2.3 checkout — moving around

`checkout` is the older verb, replaced in modern git by `switch` (for branches) and `restore` (for files). All three work; the modern ones are clearer.

```bash
git switch develop              # switch to develop branch
git switch -c feat/foo          # create + switch
git restore <file>              # discard local edits to a file
git restore --staged <file>     # un-stage a file
git checkout <commit-hash> -- <file>   # restore a file from a specific commit
```

The one classical use of `checkout` you'll still see: `git checkout -b new-branch` (same as `git switch -c`). Both are fine.

### 2.4 rebase — replay your work on top of fresh `develop`

When you've been working on a branch for a while, `develop` keeps moving. Before you open a PR (or before merging one), you rebase your branch on top of the latest `develop` so your commits sit on a clean foundation.

```bash
git switch develop
git pull                            # get latest develop

git switch feat/add-product-audit-skill
git rebase develop                  # replay my commits on top of develop
# (resolve any conflicts, then:)
git rebase --continue
git push --force-with-lease         # update the remote branch (safe)
```

**Why rebase, not merge?** It keeps the history linear and easy to read. Merge commits multiply the noise.

> **Critical safety rule:** **never `git push --force` to a shared branch** (`develop`, `main`). On *your own feature branch* it's fine — use `--force-with-lease` (which refuses if someone else pushed in the meantime).

If a rebase gets messy and you panic: `git rebase --abort` returns you to before you started. You lose nothing.

### 2.5 PR (Pull Request) — at Gambit, **always to `develop`**

A PR is the formal request to merge your branch into another branch. **At Gambit, PRs always target `develop`**, never `main`. `main` is only updated from `develop` on releases.

The end-to-end flow:

```bash
# 1. Branch from up-to-date develop
git switch develop && git pull
git switch -c feat/GAM-123-add-skill

# 2. Make edits. Commit small + often.
git add -p && git commit -m "feat: add product-audit skill"

# 3. Push the branch
git push -u origin feat/GAM-123-add-skill

# 4. Open the PR — easiest way uses the GitHub CLI:
gh pr create --base develop --draft \
  --title "feat: add product-audit skill" \
  --body "Adds a skill that audits an unfamiliar codebase. Tested on InvoiceFlow + StreakKeeper."
```

If you don't have `gh`, GitHub will print a link in the terminal output of `git push` — click it, fill in the form, set the base to `develop`.

**Draft vs Ready:**

- **Draft PR** — opens visibly but signals "not ready for review yet." CI still runs (so you see if tests pass), reviewers don't get pinged. Use this while you're iterating with Claude.
- **Ready for review** — when you're done, click **"Ready for review"** at the top of the PR page (or `gh pr ready`). This is when reviewers get notified.

**Assigning reviewers:**

- On the PR page, right sidebar → **Reviewers** → add 1–2 people. For `gambit-ai-config` PRs, the AI tooling owners (ask in `#ai-tooling` if unsure who's on rota).
- For Gambit code repos, reviewer assignments often happen automatically via `CODEOWNERS`. If they don't, add them manually.
- CLI: `gh pr edit --add-reviewer <github-handle>`

**The minimum-viable PR description we expect at Gambit:**

> **What:** one-line summary
> **Why:** the user/business reason
> **How tested:** what you actually ran. For a skill PR — what codebases you ran it on.
> **Risks/rollback:** what could go wrong, how to undo

### 2.6 worktree — running multiple Claude agents safely in parallel

This is the killer feature once you start running more than one Claude Code session at once. **Two Claude sessions editing the same files at the same time will corrupt each other's work.** Worktrees prevent that.

A worktree is a second checkout of the same repo, on a different branch, in a different folder. Both share the same `.git` history but have independent working files. We keep them under `.worktrees/` (the convention at Gambit, gitignored).

```bash
# From the main repo folder:
git worktree add .worktrees/feat-skill-foo  -b feat/GAM-200-skill-foo  develop
git worktree add .worktrees/feat-skill-bar  -b feat/GAM-201-skill-bar  develop

# Now you have two physical folders:
#   ./                              ← your main checkout, on develop
#   ./.worktrees/feat-skill-foo/    ← Claude session A works here
#   ./.worktrees/feat-skill-bar/    ← Claude session B works here

# Open each in its own Claude Code session. They cannot collide.

# When done with one:
git worktree remove .worktrees/feat-skill-foo
```

Make sure `.worktrees/` is in your `.gitignore` (it usually already is in our repos):

```
.worktrees/
```

> **Rule of thumb:** if you're about to run two Claude agents in parallel — **always `git worktree add` first**. One agent per worktree. One worktree per branch. Don't share.

### 2.7 Git Graph — seeing your changes visually

In **VS Code or Cursor**, install the **"Git Graph"** extension by *mhutchie* (the most popular one). It draws an interactive graph of branches, commits, and merges.

Why a PM cares about it:

1. After Claude makes a series of commits, open Git Graph and **read the graph backwards** — it's the fastest way to verify Claude did what it claimed to do.
2. Click any commit to see its file changes.
3. Click any file in the commit to see the side-by-side **diff**. You'll review more diffs than you write code; this is the tool.
4. Right-click branches/commits for `checkout`, `rebase`, `cherry-pick` from the GUI if you don't want to type.

Alternative: VS Code's built-in **Source Control** panel + **Timeline** view. Less powerful, no install needed.

> **Habit to build:** before pushing any branch Claude wrote, open Git Graph, click your latest commit, walk the diff file by file. **If you can't explain in one sentence what each file change does and why, don't push it.**

### 2.8 GitHub UI — the PR view and CI checks

Once your PR is open, the GitHub PR page is your control center. Three tabs you'll live in:

1. **Conversation** — the description, reviewer comments, status. Where back-and-forth happens.
2. **Files changed** — the master diff. Read this carefully before clicking "Ready for review." Reviewers will look at the same view.
3. **Checks** — every CI job that runs. Each row is a workflow defined in `.github/workflows/`.

**GitHub Actions and CI:**

- Each green ✅ means a CI job passed. Red ❌ means it failed; click the job name to see the logs.
- Common failures on Gambit PRs: lint, type-check, unit tests, conventional-commits check.
- **You cannot merge a PR with red checks.** Branch protection rules block it.
- If a check is flaky (intermittent failure), click **"Re-run jobs"** at the top. If it fails twice, it's not flaky — read the logs.

**Useful CLI shortcuts** (need `gh` installed and authenticated):

```bash
gh pr status                    # what PRs do I have open / am I reviewing?
gh pr view                      # show current branch's PR
gh pr view --web                # open it in the browser
gh pr checks                    # CI status for the current PR
gh pr checks --watch            # live-watch checks until they finish
gh pr ready                     # promote draft → ready for review
gh pr merge --squash --auto     # merge once checks pass + reviews approve
```

> **The end-of-day ritual at Gambit:** before you log off, run `gh pr status`. Anything still red? Fix it or write a comment on the PR explaining why it's blocked. Don't leave Claude-generated PRs rotting overnight.

### 2.9 Git is the AI safety net

Bad things happen with AI coding tools. Claude misunderstands an instruction, accepts a stale stub, "fixes" a test by deleting it. **Git is what saves you.**

Three reflexes to build:

1. **Commit before each risky Claude turn.** If the next ask is non-trivial, commit first. Then if it goes wrong: `git reset --hard HEAD` and try again with a different prompt.
2. **Branch per thing.** One branch per feature/skill/fix. Never let two unrelated changes share a branch — review and rollback get a thousand times harder.
3. **Read the diff before you push.** Always. Git Graph or `git diff develop...HEAD`. If the diff has files you don't recognize touching, ask Claude *"why did you change `<file>`?"* before pushing. Often the answer is "I shouldn't have."

---

## Step 3 — The hands-on workshop replay

The exercises Shmulik ran are still on disk in `Claude Learning/claude-workshop/`. We're going to redo them, in order, to build muscle memory. Each one ends with a saved skill.

### 3.0 Pre-flight (10 min)

1. Make sure Claude Desktop is signed in (Pro plan or higher — Free does NOT include Claude Code).
2. Open the workshop folder in your file manager: `Claude Learning/claude-workshop/`.
3. Read the workshop's own pre-flight guide: `claude-workshop/07-pre-flight-setup-guide.md`. Skim, don't memorize.
4. Print or pin the cheat sheet: `claude-workshop/05-cheat-sheet.md`. Keep it next to your laptop the whole time you do the exercises.
5. Open the original deck and skim it as you go: `claude-workshop/Docs/Claude-Code-for-Product-Teams-Final.pdf`. The deck is the parallel narrative — read the relevant slides before each exercise.

### 3.1 Part A1 — Cowork (the take-home reference)

Before diving into Code, spend 10 minutes with the Cowork tab. This is what you'll actually use Monday morning for non-code work — synthesis, doc drafting, scheduled tasks.

- **Read:** `claude-workshop/handouts/A1-cowork-takehome.md` (3 pages)
- **Try:** drag the folder `claude-workshop/sample-repo/claude-code-pm-starter/workshop-data/` into Cowork and run the synthesis prompt from the handout:

  > *"Synthesize this customer feedback into a 1-page report — top 3 themes by impact, with representative quotes."*

If the output is generic, push back with the prompts in the handout. **The pushback playbook is the lesson, not the synthesis itself.**

### 3.2 Part A2 — Explore: Product Audit on InvoiceFlow

This is the first real exercise. You'll generate a 1-page audit of an unfamiliar codebase, then save the pattern as a skill, then **run that skill on a totally different codebase** to prove it generalizes.

**Handout:** `claude-workshop/handouts/A2-part1-explore.md` — read it cover to cover before you start.

**Sample repo:** `claude-workshop/sample-repo/claude-code-pm-starter/` (Next.js + TypeScript + Prisma invoicing app, with three deliberate complexity hotspots: tangled auth, two PDF libraries, currency duplication).

Do exactly what the handout says — the 4-step pattern (Survey → Push back → Audit → Self-critique). Plan mode ON for steps 1 & 2, OFF for step 3, ON-or-OFF for step 4. Read every Claude output aloud (yes, even alone — it forces you to actually parse it instead of skimming).

Stop and save at the 18-minute mark with this prompt:

```
Save this 4-step pattern as `.claude/skills/product-audit.md` with proper
frontmatter (name, description). Make the skill general enough to work on
any codebase, not just this one.
```

**Reference output:** the version Shmulik shipped is at `claude-workshop/sample-repo/claude-code-pm-starter/.claude/skills/product-audit.md`. After you save your version, diff it against Shmulik's. The differences are the things you missed — that's the lesson.

#### 3.2.1 Now run your skill on streakkeeper

This is the part the workshop didn't have time for, and it's the most important step. A skill is only valuable if it generalizes.

- Open a **new** Claude Code session.
- Pick the folder `claude-workshop/streakkeeper/` (a Python+Flask habit tracker — completely different stack).
- Tell Claude:

  > *"Use my `product-audit` skill on this codebase. Treat me as a PM joining the StreakKeeper team."*

Read the output. Did the skill work? What broke? Are the steps too Next.js-specific? Did the questions for the CEO make sense for a Flask habit tracker?

Whatever didn't work — go fix the skill file. **The whole point of the "use it twice" rule is that the second use surfaces the bugs in your skill.** Iterate until the same skill produces a credible audit on both InvoiceFlow and StreakKeeper.

### 3.3 Part A3 — Constrain: Figma → Component

This one trips most PMs because it has the most setup. Read carefully.

**Handout:** `claude-workshop/handouts/A3-part2-constrain.md`.

**The Figma file Shmulik used has been replaced.** Use this one instead:

> 🔗 https://www.figma.com/design/m3ttl14MEVxu9PcWFTe3lF/%F0%9F%A7%B6-Invoice-Template-Claude-Code--Workshop--Copy-?node-id=0-1&t=XWqBINvSAg0MM4UO-1

**Important MCP setup before you start:**

1. In Claude Desktop go to **Settings → Connectors → Browse**.
2. Find **Figma** — there are **two Figma connectors** there. **Connect both of them.**
3. Authenticate when prompted.
4. Open the Figma file in your browser (the link above), **not in the Figma desktop app**. The MCP works against the browser session.

Then run the 4-step pattern in the handout:

1. Read the design system FIRST (`tokens.json`, `components/ui/`, `CLAUDE.md`, `tailwind.config.ts`).
2. Read the Figma frame and map every element to a token or primitive.
3. Generate the component. **Zero raw hex codes. Mark every `// SYSTEM-BEND:` with a reason.**
4. Self-review. Find unnecessary bends.

Save as `.claude/skills/figma-to-component.md`.

**Reference output:** the polished version is at `claude-workshop/sample-repo/claude-code-pm-starter/.claude/skills/figma-to-component.md` — and there's an even more refined version at `claude-workshop/final-skills-output/figma-to-component.md`. Diff against both.

#### 3.3.1 Fallback if the Figma MCP won't connect

This is the most common point of failure. If after 10 minutes of fighting it the MCP still won't talk to Figma:

- **Stop fighting.** Move on. Use the pre-baked skill at `claude-workshop/final-skills-output/figma-to-component.md` instead — copy it into your `.claude/skills/` and read it carefully.
- File a ticket in `#ai-tooling` so we can fix the connector for the next person.
- The lesson of A3 is the *system-first discipline*, not the MCP. You can absorb that lesson by reading and tracing the skill even without running it live.

### 3.4 Part A4 — Collaborate: PRD Round-Trip

The hardest exercise and the most important one. You'll write a PRD, implement it, then revise the PRD based on what implementation taught you. The whole "PM ↔ Dev ↔ PM" loop in one session.

**Handout:** `claude-workshop/handouts/A4-part3-collaborate.md`.
**Detailed step-by-step (recommended for solo work):** `claude-workshop/handouts/A4-part3-step-by-step-DETAILED.md`.

The 4 phases:

- **Step 0 — Synthesize:** read `workshop-data/feedback.csv` (200 rows). Find the top theme. Define a *concrete* feature, not "improve UX."
- **Role 1 — PM:** open `docs/prd-template.md`, fill it in for the feature, save as `docs/prd-{slug}.md`. Cite real files.
- **Role 2 — Dev:** read your own PRD cold, implement it, note every ambiguity. Run `git diff` to see the real changes.
- **Role 3 — PM again:** read the diff, revise the PRD, save as `docs/prd-{slug}-v2.md`. The "what I learned about my own spec process" reflection is the keep-forever insight.

If you run out of time at Role 2, **stop. Don't fake Role 3.** An honest "we ran out at the dev hat, here's what we'd revise" is more useful than a faked spec.

Save the pattern as `.claude/skills/prd-round-trip.md`. Reference: `claude-workshop/sample-repo/claude-code-pm-starter/.claude/skills/prd-round-trip.md`.

---

## Step 4 — Make your skills global

A project skill in `.claude/skills/` only works in that one folder. To make a skill available **in every Claude Code session, anywhere**, you have two options.

### 4.1 The Claude Desktop way (point-and-click)

1. Open **Claude Desktop**.
2. Go to **Customize → Skills**.
3. Click **Upload skill**.
4. Pick the `.md` file (e.g. `product-audit.md`).
5. Confirm — it now appears in the global skills list and Claude can pick it in any session based on the description.

Do this for all three skills you wrote (`product-audit`, `figma-to-component`, `prd-round-trip`).

### 4.2 The CLI way (drop the file in `~/.claude/skills/`)

```bash
mkdir -p ~/.claude/skills
cp .claude/skills/product-audit.md ~/.claude/skills/
cp .claude/skills/figma-to-component.md ~/.claude/skills/
cp .claude/skills/prd-round-trip.md ~/.claude/skills/
```

Restart any open Claude Code sessions to pick them up.

> **Test it works:** open a brand-new Claude Code session in some random folder (not the workshop repo) and ask *"use the `product-audit` skill"*. If Claude finds and runs it, you're set up correctly.

---

## Step 5 — Push your skills to `gambit-labs/gambit-ai-config`

This is the team-library thesis. A skill that lives only on your laptop helps only you. A skill in `gambit-labs/gambit-ai-config` helps every PM at Gambit forever.

The repo is the canonical home for everything Claude-related at Gambit: shared `CLAUDE.md` snippets, slash commands, MCP configs, and skills. If you've been at Gambit for more than a week you should already know it. If not, ask the team where it lives.

### 5.1 The PR workflow (puts the git primer to work)

```bash
# 1. Clone if you haven't
git clone git@github.com:gambit-labs/gambit-ai-config.git
cd gambit-ai-config

# 2. Branch from develop (always)
git switch develop && git pull
git switch -c feat/add-product-audit-skill

# 3. Drop your skill in the right folder (skills/ or similar — match what's already there)
cp ~/.claude/skills/product-audit.md skills/

# 4. Open the file. Read it again. Make sure:
#   - Frontmatter description is specific and triggerable
#   - No Gambit-internal slang or PII
#   - The pattern actually generalizes (not just InvoiceFlow-specific)

# 5. Commit + push + open a DRAFT PR
git add skills/product-audit.md
git commit -m "feat: add product-audit skill (PM onboarding to a new codebase)"
git push -u origin feat/add-product-audit-skill

gh pr create --base develop --draft \
  --title "feat: add product-audit skill" \
  --body-file - <<'EOF'
**What:** a skill that produces a 1-page product audit when a PM joins a new codebase.

**Why:** every new PM ramping into a Gambit repo needs the same audit, and we keep doing it ad-hoc.

**How tested:** ran the same skill on InvoiceFlow (Next.js + TS) and StreakKeeper (Python + Flask). Both produced credible audits. Steps 1–4 are stack-agnostic.

**How to use after merge:** install via Claude Desktop → Customize → Skills → Upload, OR copy to `~/.claude/skills/`. Then say *"use the product-audit skill"* in any new repo.

**Risk / rollback:** zero blast radius — additive markdown file. Revert the PR to remove.
EOF
```

Wait for CI checks to go green (`gh pr checks --watch`). Then promote to ready and tag reviewers:

```bash
gh pr ready
gh pr edit --add-reviewer <ai-tooling-lead>
```

### 5.2 What gets reviewed

The reviewers will look for, in order:

1. **Does the description trigger correctly?** — Read it cold. Is it obvious when this skill should run?
2. **Does it generalize?** — Did you test on a second codebase? (You did, in section 3.2.1.)
3. **Self-critique step?** — Every skill should have one.
4. **No Gambit-internal-only language** unless it's deliberate (e.g. a Gambit-PRD-template skill *should* know our template).
5. **Sensible name and filename.**

Once merged, every new PM who follows this guide will get your skill on their laptop. That's the leverage.

---

## Step 6 — The two Gambit rules

Make these two rules muscle memory. They are the difference between using Claude as a fancy autocomplete and using Claude as a team operating system.

### Rule 1 — Start in plan mode, push back until Claude settles, own the result

This is the rule that came out of the workshop more than any other. Internalize it before anything else.

**1. Start in plan mode.** Always. Plan mode is read-only — Claude reads your files but cannot edit them. Toggle near the input box, or `Shift+Tab` in the CLI. Step 1 of every exercise, every audit, every refactor, every PRD round-trip starts in plan mode. There is no situation where "skip plan mode and just edit" is the right call for a PM who didn't write the code being edited.

**2. Push back. Then push back again. Then push back again.** Claude's first answer is almost never the best one. Treat the first response as a draft, not a deliverable.

Don't soften your pushback. **Don't say "please."** Don't apologize for asking. The right voice is direct, specific, and skeptical:

- *"You didn't do a good job. Check again."*
- *"Compare your plan to the actual code in `lib/auth.ts`. Where does your plan diverge from reality?"*
- *"What did you miss? Show me the file you didn't read."*
- *"You said the codebase uses X. Quote the line that proves it. If you can't, say so."*
- *"Read the docs in `docs/architecture.md`. Does your plan still hold?"*
- *"What assumptions are you making? List them. Which ones are weakest?"*
- *"What would a senior engineer disagree with here?"*

The pushback playbook on the cheat sheet (`claude-workshop/05-cheat-sheet.md`) is the reference list — copy those prompts and use them often.

**3. Iterate until Claude *settles*.** You are not done after one round of pushback. You are not done after two. You are done when:

- Claude's plan **stops changing** in response to your challenges. The same answer survives three rounds of "are you sure? check again."
- You and Claude have **no communication gap** — you can both restate the plan in the same words.
- There are no obvious hallucinations — every claim is anchored to a file path, a doc, a real line of code you can see.
- The remaining disagreements (if any) are *real* trade-offs you both name, not Claude papering over uncertainty.

If Claude flips its answer every time you push, that's the signal to keep pushing — it doesn't actually know yet, it's just trying to please you. Keep going. If Claude holds the same answer under pressure and can defend it with file evidence, that's the signal to move forward.

**4. Own the result.** Claude is your expert in the room. Use that. But you ship the output, you carry the bug, you stand in front of the team when the PR breaks something. Claude is the analyst; you are the PM.

This means: read every diff before you push. Open every file Claude edited. If you can't explain a change in one sentence, ask Claude *why* — and if the answer is fuzzy, revert and try again. Never let Claude be the *reason* something happened. **You** are the reason. Claude is how.

> **The shorthand:** plan mode → push back → settle → ship. Repeat for every non-trivial Claude session.

### Rule 2 — If you do something twice, make a skill out of it

You're in a Claude Code session. You finish some piece of work — a deep audit, a refactor plan, a feedback synthesis. It went well. The protocol you followed in the chat was:

1. Survey the codebase
2. Identify hotspots
3. Write the report in this specific format
4. Self-critique

**Before you close the session, type:**

```
Take everything we just did in this session and turn it into a skill.
Save it to .claude/skills/{my-skill-name}.md with proper frontmatter.
The skill should generalize beyond this specific codebase. Include a
self-critique step at the end.
```

Then **read the generated skill carefully**. It will be wrong in places. Push back (Rule 1 applies here too):

```
The description isn't specific enough — Claude won't trigger it correctly.
Rewrite it with the use-case explicit ("use this when X").
```

```
Step 3 hardcodes paths from this repo. Generalize.
```

```
Where's the self-critique step? Add one.
```

Iterate 2–3 rounds until the skill is good. Then push to `gambit-labs/gambit-ai-config` (Step 5 above) and open the PR. **One skill per PR**, with a clear description of what you tested it on.

This is the loop. Workshop-on-Tuesday, skill-on-Wednesday, team-uses-it-on-Thursday.

---

## Step 7 — What "good" looks like after 2 weeks

After two weeks of using Claude this way, your laptop should look like this:

- `~/.claude/skills/` has at least 5 skills. Three from this guide, plus 1–2 you wrote yourself for actual Gambit Sports work (a recurring synthesis, a recurring audit, a recurring spec format).
- Your `~/.claude/CLAUDE.md` (working memory) and `~/.claude/memory/` know who's on your team, what shorthand we use, what the Gambit Sports product is, what Linear project codes mean.
- Every Gambit repo you regularly work in has a `CLAUDE.md`. If one didn't, you added it.
- You've opened at least one PR to `gambit-labs/gambit-ai-config`.
- You default to plan mode and only toggle off intentionally.
- You can answer, in one sentence, when to use Cowork vs Claude Code: *"Code involved → Claude Code. No code involved → Cowork."*
- You commit small + often, branch per change, never push to `develop` directly.
- When you run two Claude agents in parallel, each gets its own `git worktree`.

If after two weeks you don't have most of those, ping me directly and we'll pair on it.

---

## Quick reference — the cheat sheet

| Concept | What it is | Where it lives |
|---|---|---|
| `CLAUDE.md` | Project memory — what this product is, conventions, files-to-avoid | Repo root |
| `memory/` | Personal memory — your role, shorthand, who's who | `~/.claude/memory/` |
| Context | What's in Claude's head right now | This session only |
| State | The actual edited files on disk | Survives sessions |
| Skill | Reusable multi-step prompt pattern | `.claude/skills/` (project) or `~/.claude/skills/` (global) |
| Slash command | One-liner you invoke explicitly with `/name` | `.claude/commands/` |
| Plan mode | Read-only — Claude can't edit anything | Toggle near the input, or `Shift+Tab` |
| MCP | Protocol that lets Claude reach external tools (Figma, Linear, Slack, Notion) | `.mcp.json` and Settings → Connectors |
| Cowork | The non-code tab in Claude Desktop — for synthesis, doc drafting, scheduled tasks | Claude Desktop sidebar |
| Worktree | Second checkout of a repo on a different branch | `.worktrees/<branch>` |
| PR target | Always `develop` at Gambit | `main` is updated only on releases |

The 5 power moves to remember: **plan mode**, **`CLAUDE.md`**, **slash commands**, **MCP**, **skills**. The Rule 1 loop: **plan mode → push back → settle → ship → own the result**. Plus the three git reflexes: **commit-before-risky-turn**, **branch-per-thing**, **read-the-diff-before-pushing**. If you can teach all of those to a colleague, you've internalized this guide.

---

## Reference — files I built this guide from

Everything I leaned on lives in `Claude Learning/claude-workshop/`:

- `README.md` — Shmulik's delivery folder map
- `09-student-syllabus.md` — what participants saw
- `04-fundamentals-slides.md` — the 4 fundamentals slides (plan mode, CLAUDE.md, skills, MCP)
- `05-cheat-sheet.md` — the 1-pager handed to every participant
- `handouts/A1-cowork-takehome.md` — Cowork reference
- `handouts/A2-part1-explore.md` — product audit exercise
- `handouts/A3-part2-constrain.md` — Figma → component exercise
- `handouts/A4-part3-collaborate.md` — PRD round-trip exercise
- `handouts/A4-part3-step-by-step-DETAILED.md` — long-form version of the round-trip
- `sample-repo/claude-code-pm-starter/.claude/skills/` — the three reference skills
- `sample-repo/claude-code-pm-starter/CLAUDE.md` — a real `CLAUDE.md` to model yours on
- `final-skills-output/figma-to-component.md` — polished fallback skill if MCP fails
- `streakkeeper/` — the second codebase you'll re-run product-audit against
- `Docs/Claude-Code-for-Product-Teams-Final.pdf` — the original deck

---

*Gambit Sports · Product onboarding · v1 · May 2026*
