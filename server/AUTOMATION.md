# Approved-Request Automation

Turns an **approved** component request (from the email's Approve button) into a
**pull request** that implements the component in our design system (ADS) — with
no human re-typing the spec.

```
Approve (email)  →  server marks status=approved + persists to disk
                 →  worker polls /store, picks up approved & unbuilt requests
                 →  isolated clone → branch feat/<name>
                 →  claude -p implements the component in ADS (reads DESIGN.md)
                 →  npm run build (verify) → commit → push
                 →  open PR via GitHub API   (NEVER auto-merges)
```

## Pieces

| File | Role |
| --- | --- |
| `index.js` | API server. Persists requests; `/approve/:id` sets `status=approved`; `/api/approved` lists them. |
| `store.js` | JSON persistence in `server/data/` (`requests.json`, `builds.json`) — gitignored. |
| `worker.js` | The automation loop: poll → implement → PR. Runs as its own process. |

## One-time setup

1. **The base branch must contain the ADS foundation.** The worker clones
   `main` and builds on top of it, so `DESIGN.md`, `src/theme/`, and the existing
   `src/components/` must be committed to `main`. (Until then the worker has no
   design system to build on.)
2. **Auth is already handled**: the worker reads your GitHub token from Git
   Credential Manager for the PR API, and `git push` uses the same credential.
   No `gh` CLI needed.
3. **Claude CLI** must be on PATH (used headless as the implementer).

## Running

```bash
cd server
npm run worker          # continuous poll loop
# or
npm run worker:once     # process the current queue once and exit (good for cron)
```

## Configuration (env / .env)

| Var | Default | Meaning |
| --- | --- | --- |
| `DRY_RUN` | `true` | **Safe default.** Skips Claude, push, and PR; makes a placeholder commit to prove the pipeline. Set `false` for real runs. |
| `BOT_DIR` | `D:/automate-bot` | Isolated clone the worker builds in (never your working copy). |
| `REPO_URL` | the GitHub remote | Repo to clone / open PRs against. |
| `BASE_BRANCH` | `main` | Branch to build on and target PRs at. |
| `POLL_MS` | `15000` | Poll interval. |
| `CLAUDE_BIN` | `claude` | Path to the Claude CLI. |

## Safety model

- **Approve = authorization** to branch, push, and open a PR — set by the user.
- The worker **never merges**; every PR waits for human review.
- It runs in an **isolated clone** (`BOT_DIR`), so it can never disturb your live
  working tree.
- **`DRY_RUN=true` by default** — flip it off deliberately when you're ready for
  real Claude-generated PRs.
- Generated code lands in a PR (the review gate), never directly on `main`.

## Is this an "AI agent"? (agent vs. workflow)

Calling this whole pipeline "an AI agent" is imprecise. Only one part is
actually agentic.

| Part | AI? | What it is |
| --- | --- | --- |
| Wizard collects the request | no | Plain React form |
| Email + Approve/Reject | no | Nodemailer + Express |
| You clicking Approve | no | A human decision (the gate) |
| Worker polls & picks up approvals | no | A deterministic Node loop |
| Branch → commit → push → PR | no | Scripted git / GitHub API calls |
| **Headless Claude implements the component** | **yes** | **The AI agent** |

The useful distinction:

- **Workflow** — LLMs/tools orchestrated through *predefined code paths*
  (deterministic; the steps are written in `worker.js`).
- **Agent** — the *LLM dynamically directs its own process* and tool use.

Only the `claude -p` step qualifies as an agent: given a goal ("build this
component in ADS"), it autonomously reads `DESIGN.md`, writes the code, runs
`npm run build`, fixes errors, and iterates — a tool-using loop with no
step-by-step instruction. Everything around it is orchestration.

**So this system is:** a *human-gated automation workflow that delegates the
implementation to an AI coding agent.* Accurate labels: "agentic workflow" or
"AI-powered automation pipeline" — not "an AI agent" for the whole thing.

Quick test: **who decides the steps?** Code/human decides → automation; the
model decides → agent. Only the implementation step passes.

## Status ledger

`server/data/builds.json` records each request's outcome:
`{ status: 'building' | 'done' | 'error', branch, prUrl, dryRun, error, at }`.
A request is retried on the next tick only if it isn't already recorded.
