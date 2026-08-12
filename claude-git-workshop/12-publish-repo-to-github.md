# Publishing `claude-code-pm-starter` to GitHub

> **You're 5 minutes from a public repo participants can clone.**
>
> The repo is already prepped: clean `.gitignore`, no real secrets, README updated for v9, all 3 starter skills in place, initial commit made. You just need to upload it to GitHub from your laptop.

---

## Two paths to choose from

**Path A — `gh` CLI** (3 commands, fastest if you already have GitHub CLI)
**Path B — GitHub website + git** (5 commands, works for everyone)

If you're not sure which you have, run `gh --version` in your terminal. If it returns a version, use Path A. If it says "command not found," use Path B.

---

## Step 1 — Get the prepped repo onto your laptop

The repo with its initial commit already made lives in `claude-code-pm-starter.zip` (the one **with** `.git`). Download it from this conversation if you haven't already.

```bash
# Wherever you keep code projects — pick a folder
cd ~/code   # or ~/projects, ~/Documents, whatever you use

# Move the zip there and unzip
mv ~/Downloads/claude-code-pm-starter.zip .
unzip claude-code-pm-starter.zip
cd claude-code-pm-starter

# Verify git is already initialized (this should show 1 commit)
git log --oneline
```

You should see one commit: `Initial commit — Claude Code for Product Teams workshop sample repo`.

If `git log` errors out with "not a git repository," you grabbed the wrong zip — use `claude-code-pm-starter.zip` (162 KB), not `claude-code-pm-starter-files-only.zip` (56 KB).

---

## Path A — Publish with `gh` CLI

```bash
# From inside the claude-code-pm-starter folder

gh repo create braightwave/claude-code-pm-starter \
  --public \
  --source=. \
  --description "Sample repo for the Claude Code for Product Teams workshop — BrAIght Wave" \
  --remote=origin \
  --push
```

Done. Repo is live at:
**`https://github.com/braightwave/claude-code-pm-starter`**

---

## Path B — Publish via GitHub website + git push

### B1. Create the empty repo on GitHub

- Go to **[github.com/new](https://github.com/new)**
- Owner: `braightwave` (your org) — or your personal account if you want it under your own name
- Repository name: **`claude-code-pm-starter`**
- Description: *Sample repo for the Claude Code for Product Teams workshop — BrAIght Wave*
- **Public** (so participants can clone without auth)
- **Do NOT check** "Add a README," "Add .gitignore," or "Add license" — your repo already has all three. Adding them on GitHub will create a conflict you'd have to resolve.
- Click **Create repository**

GitHub will show you a page that says "…or push an existing repository from the command line." That's exactly what we're about to do.

### B2. Push from your laptop

Copy the repository URL from the GitHub page. It looks like one of these:

- HTTPS: `https://github.com/braightwave/claude-code-pm-starter.git`
- SSH: `git@github.com:braightwave/claude-code-pm-starter.git`

Use whichever your GitHub auth is set up for (most people use HTTPS with a personal access token, or SSH with keys).

```bash
# From inside the claude-code-pm-starter folder

git remote add origin https://github.com/braightwave/claude-code-pm-starter.git
git push -u origin main
```

If GitHub asks for credentials and you're using HTTPS, use a [personal access token](https://github.com/settings/tokens), not your password — GitHub stopped accepting passwords years ago.

---

## Step 2 — Verify the public repo works

Open a **new terminal** (so you don't accidentally test from the prepped folder) and run:

```bash
cd /tmp
git clone https://github.com/braightwave/claude-code-pm-starter.git
cd claude-code-pm-starter
ls
```

You should see all the workshop files: `CLAUDE.md`, `README.md`, `app/`, `components/`, `workshop-data/`, `.claude/skills/`, etc.

**Then test the install path participants will hit:**

```bash
npm install
cp .env.example .env
npm run db:setup   # creates the SQLite db with seed data
npm run dev
```

Open `http://localhost:3000` in your browser. You should see the InvoiceFlow login page. Login with `demo@invoiceflow.test` / `password123`. You should land on a dashboard showing seeded invoices.

If any of that fails, **fix it before Thursday** — participants will hit the same failures.

---

## Step 3 — Update the workshop materials with the real URL

The student syllabus, pre-workshop email, and dry-run guide all reference `braightwave/claude-code-pm-starter` as if it's already public. Once it actually is, no changes needed — the references will resolve.

**One thing to add to the WhatsApp room:**

> The sample repo is now live at https://github.com/braightwave/claude-code-pm-starter — clone it tonight or tomorrow morning before the workshop, run `npm install`, and confirm the dev server starts. We'll use this in Parts 2, 3, and 4.

---

## Step 4 — (Recommended) Tag a stable version

So participants in future cohorts can pin to a known-good version even if you push changes later:

```bash
git tag -a workshop-2026-05-07 -m "Stable version for May 7, 2026 workshop cohort"
git push origin workshop-2026-05-07
```

Now if you make changes after Thursday, future cohorts can use this tag's snapshot.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `gh: command not found` | Install with `brew install gh` (Mac), or use Path B |
| `Permission denied (publickey)` when pushing | Your SSH key isn't set up. Use HTTPS instead, or follow [GitHub SSH setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) |
| `Updates were rejected because the remote contains work that you do not have locally` | You created the GitHub repo with a README/license. Either delete the GitHub repo and recreate without those, or run `git pull origin main --rebase` then `git push` |
| `npm install` fails with peer dependency errors | Try `npm install --legacy-peer-deps`. If that's the experience for participants, document it. |
| `npm run db:setup` errors | Check `package.json` for the actual script name. Workshop participants will hit the same issue — fix before Thursday. |
| Want to set the org but it's owned by another team | Create on your personal account first (`yourusername/claude-code-pm-starter`), then transfer to the org via GitHub Settings → Transfer ownership |

---

## When you're done

You should have:

- ✅ A public GitHub repo at `https://github.com/braightwave/claude-code-pm-starter`
- ✅ A successful test clone + `npm install` + `npm run dev` cycle
- ✅ The URL posted in the WhatsApp room
- ✅ (Optional) A `workshop-2026-05-07` tag

Total time: 5–10 minutes if everything goes smoothly. 15–20 if you hit auth or install issues.

If you do hit issues, paste the error here and I'll help debug.
