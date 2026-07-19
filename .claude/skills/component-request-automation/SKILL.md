---
name: component-request-automation
description: Operate the component-request pipeline — the email backend and the worker that turns an approved request into a PR that implements the component in ADS. Use when asked about component requests, approvals, the email server, or auto-building approved components.
---

# Component-request automation

Turns an **approved** component request into a **pull request** that implements
the component in ADS — no one re-typing the spec.

```
ComponentRequestWizard (app) → POST /api/request → email with Approve/Reject
  Approve click → server sets status=approved (persisted to server/data)
  worker polls the store → picks up approved & unbuilt requests
    → branch feat/<name> → `claude -p` implements in ADS (reads DESIGN.md)
    → npm run build (verify) → commit → push → open PR   (NEVER auto-merges)
```

## Pieces
| File | Role |
| --- | --- |
| `server/index.js` | API: `/api/request`, `/approve/:id`, `/reject/:id`, `/api/approved`, `/api/status/:id`. |
| `server/store.js` | JSON persistence in `server/data/` (`requests.json`, `builds.json`) — gitignored. |
| `server/worker.js` | Poll → implement → PR loop. Runs as its own process. |
| `server/AUTOMATION.md` | Full reference. |

## Running the worker
```bash
cd server
npm run worker         # continuous
npm run worker:once    # one pass, then exit (supervised runs / cron)
```

### Env (or server/.env)
| Var | Default | Meaning |
| --- | --- | --- |
| `DRY_RUN` | `true` | Safe default: skips Claude, push, and PR; makes a placeholder commit. Set `false` for real runs. |
| `BOT_DIR` | `D:/automate-bot` | Isolated clone the worker builds in. Set to the repo root (`D:/automate`) for **in-place / no-isolation** runs — only safe when the working tree is clean (the worker `git reset --hard origin/main`). |
| `REPO_URL` | the GitHub remote | Repo to clone / open PRs against. |
| `BASE_BRANCH` | `main` | Build on / target PRs at. |
| `POLL_MS` | `15000` | Poll interval. |
| `CLAUDE_BIN` | `claude` | Claude CLI used headless as the implementer. |

## Agent vs. workflow (what to call this)
This pipeline is a **human-gated automation workflow**, not "an AI agent" as a
whole. Only the `claude -p` implementation step is an actual agent (the LLM
dynamically directs its own tool use to build the component); the email,
approval, polling, and git/PR steps are deterministic orchestration. Accurate
label: "agentic workflow" / "AI-powered automation pipeline." See
`server/AUTOMATION.md` for the full breakdown.

## Rules & safety
- **Approve = authorization** to branch, push, and open a PR. It **never merges**;
  every PR waits for human review. Merging is always the user's explicit call.
- The base branch must contain the ADS foundation (`DESIGN.md`, `src/theme/`,
  `src/components/`) — the worker builds on top of it.
- PR creation uses the GitHub API with the token from Git Credential Manager
  (`git credential fill`); no `gh` CLI needed. Falls back to a compare URL.
- **In-place caveat:** with `BOT_DIR` = the repo root, the worker switches
  branches and `reset --hard` on the live tree every build. Don't hand-edit or
  leave uncommitted files there while it runs, and expect the repo to be left on
  the last feature branch (it resets to `main` on the next build).
- The build ledger (`server/data/builds.json`) marks each request `done` so it
  isn't reprocessed.
