---
name: run-project
description: Start this project's dev servers — the React app (Vite), Storybook, and the email/automation backend. Use when asked to run, serve, preview, or start the app, Storybook, or the component-request backend.
---

# Run the project

Node 20+/24 required. Two npm projects: the root (frontend) and `server/` (backend).

## Frontend (root)
| Command | What it does | URL |
| --- | --- | --- |
| `npm install` | Install frontend deps (first time) | — |
| `npm run dev` | Vite dev server (React 19 + MUI v7 app) | http://localhost:5173 |
| `npm run storybook` | Storybook component explorer | http://localhost:6006 |
| `npm run build` | Typecheck (`tsc -b`) + production build | — |
| `npm run build-storybook` | Static Storybook build | — |

Vite proxies `/api/*` to the backend on `:4000` (see `vite.config.ts`), so the
in-app ComponentRequestWizard reaches the email server with no CORS setup.

## Backend (`server/`)
```bash
cd server
npm install            # first time
npm run dev            # email API server on http://localhost:4000
```
- Sends component-request emails with Approve/Reject buttons (Nodemailer).
- **Email delivery** needs SMTP creds: copy `server/.env.example` → `server/.env`
  and fill `SMTP_USER` / `SMTP_PASS` (Gmail needs a 16-char **App Password**, not
  the account password). With no creds it falls back to an Ethereal test inbox
  and logs a preview URL — no real delivery.

## Automation worker (`server/`)
Turns approved requests into PRs. See the `component-request-automation` skill.
```bash
cd server
npm run worker         # continuous poll
npm run worker:once    # process the queue once and exit
```

## Notes
- Long-running dev servers should be started by the user (or in the background),
  not blocked on in the foreground.
- Storybook has no `/api` proxy; the wizard story targets the server's absolute
  URL (`http://localhost:4000/api/request`) instead.
