# Setup Guide — Before the Claude Code Workshop

> **Read this 1 week before the workshop. Spend 30 minutes. Show up green.**
>
> If you only have 5 minutes right now, jump to **[The 5-minute path](#the-5-minute-path)**.

---

## Table of contents

1. [What Claude Code actually is](#what-claude-code-actually-is)
2. [Three flavors — and why we use the Desktop app](#three-flavors)
3. [Account & subscription requirements](#accounts-and-subscriptions)
4. [System requirements](#system-requirements)
5. [The 5-minute path (recommended for everyone)](#the-5-minute-path)
6. [Step-by-step install — Desktop app](#step-by-step-install)
7. [First-time authentication](#first-time-authentication)
8. [Verify your setup](#pre-flight-check)
9. [Optional but recommended](#optional-but-recommended)
10. [Common problems & fixes](#troubleshooting)
11. [Workshop-day checklist](#workshop-day-checklist)
12. [FAQ](#faq)

---

## What Claude Code actually is {#what-claude-code-actually-is}

Four things share the "Claude" name and are easy to confuse:

| Product | What it is | What you do with it |
|---|---|---|
| **Claude.ai** (browser) | The chat window at claude.ai | Have conversations. Draft text. Research. **No file system access.** |
| **Claude Desktop — Cowork tab** | An AI agent for daily knowledge work that doesn't touch code | Synthesize feedback. Organize files. Create documents. We'll demo this briefly in Part 1. |
| **Claude Code** ⭐ | An AI agent that runs *on your computer* and reads/edits your real codebase | Scope features, write PRDs grounded in real code, build internal tools, automate workflows. **The hands-on tool for Parts 2-4.** |
| **Claude API** | The raw API for developers | Build apps and integrations |

**The workshop's hands-on Parts (2-4) are about Claude Code** — the agent that actually touches your file system. Cowork gets a 7-minute live demo in Part 1 so you know when to reach for it instead. Browser Claude is great for thinking and drafting; Cowork is for daily knowledge work; Claude Code is for shipping work grounded in real code.

---

## Three flavors — and why we use the Desktop app {#three-flavors}

Claude Code ships in **three flavors**. They use the same underlying models. Same skills. Same `CLAUDE.md`. Same MCP. Different surface.

| Flavor | What it looks like | Best for |
|---|---|---|
| **Desktop app** ⭐ | A native macOS/Windows app with chat, visible file tree, plan sidebar, split-pane views | **The workshop. Everyone.** Visual, beginner-friendly, no terminal required. |
| **CLI** (terminal) | A command-line interface in your terminal app | Power users, advanced features (flags, scripting, headless automation) |

### Why the Desktop app for this workshop

You're a product manager or designer. You shouldn't have to learn the terminal to use AI on your laptop. The Desktop app gives you:

- A **visible file tree** — you see what Claude is reading and editing.
- A **plan sidebar** — when Claude maps out a multi-step task, you see each step before it runs.
- **Split-pane views** — review what Claude wrote on one side while it keeps working on the other.
- **One-click mode switching** — toggle plan mode, accept-edits, etc., from buttons instead of keyboard combos.
- **MCP through the GUI** — connect Figma, Atlassian, Notion through a settings panel, not config files.

Everything we'll do in the workshop — the 4-step grounded scoping, the Figma-to-component pattern, the PRD round-trip — works identically in the Desktop app. The skills you save (`SKILL.md` files in `.claude/skills/`) work across all three flavors. **You can switch between Desktop and CLI later if you want; the skills come with you.**

### What about the CLI?

We mention it. Some advanced participants may already use it. After the workshop, you're free to try it — the patterns transfer 1:1. But during the workshop, **everyone uses the Desktop app** so we're working from one shared mental model.

---

## Account & subscription requirements {#accounts-and-subscriptions}

You need a paid Claude account to use Claude Code. The free Claude.ai tier does **not** include access. Your options, ranked for the workshop:

### Path A — Pro plan ($20/month) — recommended

Best for most people. Covers Claude Code (Desktop + CLI), Claude.ai browser chat, and most of what you'll do in the workshop. Cancel anytime.

Sign up: [claude.ai/upgrade](https://claude.ai/upgrade) → choose Pro.

### Path B — Max plan ($100 or $200/month)

If you're already a heavy daily Claude user, Max gives you 5× the usage limits, computer use access, and remote sessions. Overkill for a single workshop.

### Path C — Teams / Enterprise

If your company has a Teams or Enterprise plan, ask your admin to grant you Claude Code access. Same access as Pro/Max.

### Path D — API pay-as-you-go

Possible but not recommended for the Desktop app workshop. The Desktop app's smoothest experience is on a Pro/Max subscription. If you need API for a specific reason, talk to the organizer.

### What does NOT work

❌ The free tier of Claude.ai. It does not include Claude Code.
❌ Sharing someone else's account. The auth is browser-based and tied to one person.

---

## System requirements {#system-requirements}

For the Desktop app:

- **macOS** 13 (Ventura) or later
- **Windows** 10 build 1809 or later, or Windows 11
- **4 GB RAM** minimum, 8+ GB recommended
- **Internet connection** (Claude Code talks to Anthropic's servers in real-time)

The Desktop app is **not yet available for Linux**. Linux participants should follow the optional CLI install at the bottom of this guide.

You do **not** need:

- A GPU
- Node.js
- Admin/root access (the Desktop installer prompts for permissions only when needed)

---

## The 5-minute path (recommended for everyone) {#the-5-minute-path}

1. **Sign up** for Claude Pro (or use your existing Claude account if you already have one): [claude.ai/upgrade](https://claude.ai/upgrade).
2. **Download the Desktop app** for your OS: [claude.ai/download](https://claude.ai/download).
3. **Install** by opening the downloaded file and following the prompts.
4. **Open the app** and sign in with your Claude account.
5. **Verify** by clicking "New session" and asking Claude "What can you do here?"

If all five worked, you're done. Skip ahead to [Optional but recommended](#optional-but-recommended).

If anything failed, see the step-by-step section below.

---

## Step-by-step install — Desktop app {#step-by-step-install}

### macOS

1. Go to [claude.ai/download](https://claude.ai/download).
2. Click "Download for Mac". You'll get a `.dmg` file.
3. Open the `.dmg`. Drag the Claude icon into your Applications folder.
4. Open the app from Applications.
5. If macOS says *"Claude can't be opened because it's from an unidentified developer"*, right-click the app and choose Open. Confirm.
6. Sign in with your Claude account.

That's it.

### Windows

1. Go to [claude.ai/download](https://claude.ai/download).
2. Click "Download for Windows". You'll get a `.exe` installer.
3. Open the installer and follow the prompts.
4. Launch Claude from your Start menu.
5. Sign in with your Claude account.

That's it.

### What you should see after install

When you open the app for the first time, you should see:

- A welcome screen.
- A **"New session"** or **"Open folder"** button.
- A **sidebar on the left** for sessions, MCP connections, and settings.
- An **empty main pane** for the conversation.

If you see all of that, you're set up correctly.

---

## First-time authentication {#first-time-authentication}

The first time you launch the Desktop app, it'll open a browser window for sign-in.

**If you have a Pro/Max/Teams account:** sign in with the same email. You'll be redirected back to the app, signed in.

**If you're on the free tier:** you'll see a message about needing Pro. Upgrade at [claude.ai/upgrade](https://claude.ai/upgrade), then return to the app.

**If your browser doesn't open automatically:** the app shows a URL you can copy and paste into a browser manually.

---

## Verify your setup {#pre-flight-check}

Run through this 5-step check the day before the workshop:

1. ✅ **Open the Claude Desktop app.** It should open without errors.
2. ✅ **Click "New session"** and select any folder on your computer (your Desktop is fine).
3. ✅ **Type:** "Hi Claude, list the files in this folder." Claude should respond and list a few files. This proves the file system connection works.
4. ✅ **Look at the left sidebar.** You should see your session listed.
5. ✅ **Find the plan-mode toggle** somewhere in the UI (typically a button near the input box). Don't click yet — just confirm it's there.

If all 5 work, **post a screenshot of step 3 in the workshop WhatsApp room with a ✅**.

If anything fails, see [Troubleshooting](#troubleshooting). If you can't resolve it, post the error in the WhatsApp room — we'll get you sorted before the day.

---

## Optional but recommended {#optional-but-recommended}

These aren't required, but they make the workshop smoother.

### 1. Git and GitHub — what they are, and why you need both

These two names sound like one thing said twice. They're not.

> **Git** is software that runs on your laptop. It tracks changes to files. Free, open-source, made in 2005.
>
> **GitHub** is a website (owned by Microsoft) where Git projects live online. It hosts code so multiple people can share it.
>
> **Git is the engine. GitHub is one place that engine connects to.**

Real-world analogy: Git is like the Microsoft Word app on your laptop. GitHub is like OneDrive — where you store and share documents. You need Word to open a `.docx`. You need OneDrive to host it.

For the workshop:
- We've put the InvoiceFlow sample repo on **GitHub** at `github.com/braightwave/claude-code-pm-starter`.
- You'll use **Git** on your laptop to download a copy of it (the technical word is "clone").
- Without Git, you can't download. Without a GitHub account, you can't authenticate the download.

You need both. The good news: GitHub is a 1-minute signup, and Git is a one-time install you'll forget about afterward.

### 2. Sign up for GitHub (1 minute)

Go to [github.com/signup](https://github.com/signup). The free plan is everything you need.

That's it. You don't need to know Git yet — the account just needs to exist.

### 3. Install Git (5 minutes)

> **You'll only need the Terminal / Command Prompt ONCE in this whole workshop — to install Git. After that, you never see it again.** The Claude Desktop app handles everything else through buttons and menus.

First, check if you already have Git installed. Some systems ship with it.

**macOS:** Open the Terminal app (⌘+Space → type "Terminal" → Enter), type `git --version`, press Enter.

> **Screenshot to add here:** macOS Terminal window — show the dark window with the prompt and a successful `git --version` response like `git version 2.39.5 (Apple Git-145)`. Caption: *"This is the Terminal app on Mac. The black window with the blinking cursor is normal."*

**Windows:** Open the Command Prompt app (Windows key → type "cmd" → Enter), type `git --version`, press Enter.

> **Screenshot to add here:** Windows Command Prompt window — show the black window with `C:\Users\YourName>` prompt and a successful `git --version` response. Caption: *"This is Command Prompt on Windows. Same idea as Terminal on Mac — text in, text out."*

If you see something like `git version 2.39.5`, **you're done — skip ahead to "Tell Git who you are."**

If you see *"command not found"* or *"is not recognized"*, install it:

#### macOS install

Easiest path — Apple's developer tools include Git. In Terminal, run:

```
xcode-select --install
```

A system popup appears. Click **Install**. Wait 2–5 minutes. Done.

> **Screenshot to add here:** the macOS "Command Line Developer Tools" install popup, with the Install button highlighted. Caption: *"Click Install — that's the only click required. The download takes 2-5 minutes."*

(If you'd rather use a graphical installer, [download Git from git-scm.com](https://git-scm.com/download/mac) and run the `.dmg`. Either path works.)

#### Windows install

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win).
2. The download starts automatically. Run the `.exe` when it finishes.
3. Click **Next** through every screen. The defaults are fine — don't second-guess them.
4. When the installer finishes, **close any open Command Prompt windows**, then open a fresh one.
5. Type `git --version`. If you see a version, you're done.

> **Screenshot to add here:** the Git for Windows installer's first screen ("Information" / license screen). Caption: *"This is the installer. Click Next through every screen — defaults are fine. There are about 12 screens; none of them require a decision."*

#### Tell Git who you are

After install, set your name and email once. This is required so files you save get tagged with who saved them. In Terminal (Mac) or Command Prompt (Windows), run these two lines, replacing the values with yours:

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the same email you used for your GitHub account — it lets the two systems link up properly.

**That's the last time you'll need Terminal or Command Prompt for the rest of the workshop.**

### 4. Get a Figma account with one editable file

Part 2 uses Figma. You'll need an account at [figma.com](https://figma.com) (free is fine) with edit access to at least one file. We'll provide a sample file on the day, but participants who bring their own get more value out of Part 2.

### 5. (Linux participants only) Install the CLI

The Desktop app isn't available for Linux yet. Install the CLI instead:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Close and reopen your terminal. Verify with `claude --version`. Sign in by running `claude` and following the browser flow. Workshop facilitators will help you map the Desktop-app demos to CLI equivalents — same skills, same `CLAUDE.md`, just a different surface.

---

## Common problems & fixes {#troubleshooting}

### Mac says "Claude can't be opened — unidentified developer"

Right-click the app icon in Applications, choose **Open**. macOS will show a confirmation dialog with an "Open" button. Click it once. Future launches won't ask.

### Windows SmartScreen says "Windows protected your PC"

Click **More info** → **Run anyway**. This is normal for newly-released apps. If your IT department blocks this, talk to them — see "Behind a corporate firewall" below.

### App opens but won't sign in

Common causes:
1. **You're on the free Claude tier.** Upgrade to Pro. The Desktop app does not work on free.
2. **Your browser blocked the redirect.** Manually copy the URL from the app and paste into a browser.
3. **You have an old session cached.** Quit the app fully (right-click in the dock/tray → Quit, not just close the window), reopen.

### App opens but shows blank/unresponsive screen

1. Restart the app (quit fully, reopen).
2. Check for pending updates in the app's settings.
3. On Windows, check Event Viewer for crash logs (Windows Logs → Application).
4. If still broken, uninstall and reinstall.

### Claude can't find tools like `git` or `node`

The Desktop app uses your system's PATH. If a tool works in your regular terminal but Claude can't find it:
1. Quit the app fully.
2. Reopen the app — it reloads environment variables on launch.
3. If still broken, ensure the tool is in your standard PATH (in Terminal, `which git` should print a path).

### "This tier does not include Claude Code"

You're on the free Claude.ai plan. Upgrade to Pro at [claude.ai/upgrade](https://claude.ai/upgrade).

### Behind a corporate firewall, can't install or sign in

Talk to your IT department now (not on workshop morning). They'll need to whitelist:
- `claude.ai`
- `*.anthropic.com`
- `*.claude.com`
- `github.com` (for cloning the workshop repo)

If your laptop is locked down to the point where you can't install software, **flag this in the WhatsApp room immediately**. We have backup options including a pre-configured cloud environment, but we need to know in advance.

### My laptop is on Linux

The Desktop app isn't available for Linux. Install the CLI instead — see "Optional but recommended" above. Workshop demos translate 1:1; a facilitator will pair with you if needed.

---

## Workshop-day checklist {#workshop-day-checklist}

The morning of the workshop, run through this:

- [ ] Laptop is charged. Bring the charger anyway.
- [ ] Claude Desktop app opens and you're signed in.
- [ ] You can start a new session and Claude responds.
- [ ] Git works (`git --version` in any terminal).
- [ ] You're signed into GitHub in a browser.
- [ ] You're signed into Figma in a browser.
- [ ] Phone is charged (you'll use it for the WhatsApp room and possibly QR codes).
- [ ] You re-signed into Claude in a browser at some point in the last week (sessions can expire).

Arrive 15 minutes before start time. Doors open then.

---

## FAQ {#faq}

**Q: I'm a complete beginner. Will I be lost?**
No. The Desktop app is designed exactly for people in your position. Your pod has someone experienced. The work is designed in 4 steps anyone can follow. The skill is asking the right product questions, not knowing terminal commands.

**Q: I'm advanced and use Claude Code's CLI daily. Can I use the CLI in the workshop?**
Yes — for your own pod work, the CLI is fine. But please follow along with the Desktop-app demos when Shmulik is presenting, so we can refer to the same buttons and panels in pod discussions. After the workshop, swap freely.

**Q: Can I just use the Claude.ai browser version?**
No. Browser Claude has no file system access, no MCP, no plan mode, no skills. The whole workshop depends on Claude Code's ability to read and edit real files.

**Q: My company won't let me install things on my work laptop.**
Reach out to the organizer this week, not on the day. We have a hosted backup environment for exactly this case, but we need to provision it in advance.

**Q: Can I do the workshop on an iPad / Chromebook?**
iPad: no — Claude Code requires a real desktop OS. Chromebook: only via the Linux container (Crostini), which is fiddly. If you have a real laptop, use it.

**Q: I haven't done the prep. Can I show up and figure it out on the day?**
Strongly discouraged. The workshop's first 30 minutes don't pause for installs — you'll miss the keynote dealing with sign-in errors. If you really can't prep in advance, arrive 30 minutes early and find a floater immediately.

**Q: Why not start with the CLI? Isn't it more "real"?**
The CLI is more powerful for advanced use. But the workshop's pedagogy is about *patterns* (grounded scoping, the PRD round-trip, the system-first component approach) — not terminal proficiency. Adding "learn the terminal" on top of "learn agentic AI" doubles the cognitive load for beginners. The Desktop app removes the terminal tax. You'll learn the patterns first, and pick up the CLI naturally over the next 30 days if you want to.

**Q: What if I lose internet mid-workshop?**
Claude Code stops working without internet — it's a real-time agent talking to Anthropic's servers. Tether your phone if needed. We'll have backup hotspots, but treat them as last resort.

**Q: Does this work with my company's SSO?**
The Pro/Max plans use a personal Claude account. If your company has Teams or Enterprise with SSO, ask your admin to grant you Claude Code access — that uses your work email and SSO. Both work equally well.

---

## Questions before the day?

WhatsApp room: [LINK]
Email: [EMAIL]

See you on **Thursday, May 7, 2026**.

— Shmulik & the BrAIght Wave team
