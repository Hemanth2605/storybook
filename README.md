# Automate Design System (ADS)

A React 19 + TypeScript component library built on **Material UI v7**, documented
in Storybook — plus a small backend that turns **component requests** into
**pull requests** automatically, using an AI coding agent.

Two things live here:

1. **A design system + component library** — our own tokens, typography, spacing,
   and 13 components layered on top of MUI. The system of record is
   [`DESIGN.md`](DESIGN.md); MUI is only the implementation substrate.
2. **A request → approve → PR automation** — an in-app wizard emails a component
   request with Approve/Reject buttons; approving triggers a worker that
   implements the component in ADS and opens a PR. See
   [`server/AUTOMATION.md`](server/AUTOMATION.md).

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript, Material UI v7, Emotion |
| Docs | Storybook 10 |
| Build | Vite 8 |
| Backend | Node + Express + Nodemailer |
| Automation | Headless Claude (Claude Code) as the implementer |

## Getting started

```bash
# Frontend (repo root)
npm install
npm run dev          # app        → http://localhost:5173
npm run storybook    # Storybook  → http://localhost:6006

# Backend (email + automation)
cd server
npm install
npm run dev          # API server → http://localhost:4000
```

Vite proxies `/api/*` to the backend on `:4000`, so the in-app wizard reaches the
email server with no CORS setup. See the `run-project` skill for full details.

## Design system

ADS is defined in [`DESIGN.md`](DESIGN.md): color/typography/spacing/radius/
elevation tokens, component contracts, and an accessibility checklist. The rule:
**consumers use ADS tokens and ADS components, never raw MUI values**. New
components must follow the `create-ads-component` skill.

### Components (`src/components/`)

`AlertBanner` · `AppButton` · `ComponentRequestWizard` · `ConfirmDialog` ·
`DataTable` · `EmptyState` · `PageHeader` · `RatingStars` · `SearchField` ·
`Slider` · `StatCard` · `StatusChip` · `UserAvatar`

Each lives in its own folder with the component, a Storybook story, and a barrel
export. Full contracts are in `DESIGN.md` → Appendix B.

## Request → PR automation

```
Wizard (app) → POST /api/request → email with Approve / Reject
  Approve → server marks it approved (persisted)
  worker → branch feat/<name> → AI agent implements in ADS
         → npm run build → commit → push → open PR   (never auto-merges)
```

This is a **human-gated automation workflow**, not "an AI agent" end to end —
only the implementation step is truly agentic; the email, approval, polling, and
git/PR steps are deterministic. The PR title/description are authored by the
agent (hybrid); the git plumbing stays code. Full breakdown and setup:
[`server/AUTOMATION.md`](server/AUTOMATION.md).

### Email delivery
Copy `server/.env.example` → `server/.env` and set SMTP credentials (Gmail needs
a 16-char **App Password**). Without credentials the server uses a test inbox and
logs a preview URL — no real delivery.

## Scripts

| Command | Where | Does |
| --- | --- | --- |
| `npm run dev` | root | Vite dev server |
| `npm run storybook` | root | Storybook |
| `npm run build` | root | `tsc -b` + `vite build` |
| `npm run dev` | `server/` | Email/API server |
| `npm run worker` | `server/` | Automation watcher (continuous) |
| `npm run worker:once` | `server/` | Process the approval queue once |

## Project layout

```
src/
  theme/            ADS theme (tokens projected onto MUI)
  components/       ADS components (13)
  App.tsx           Demo dashboard
server/
  index.js          Email/API server
  worker.js         Request → PR automation
  AUTOMATION.md     Automation reference
DESIGN.md           The design system (source of truth)
.claude/skills/     Project skills (run, build-a-component, automation)
```

## Skills

Project workflows are captured as Claude Code skills in `.claude/skills/`:
`create-ads-component`, `run-project`, `component-request-automation`.
