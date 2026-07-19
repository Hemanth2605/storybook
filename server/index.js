import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { createMailer, buildEmail } from './mailer.js';
import { loadRequests, saveRequests } from './store.js';

const PORT = Number(process.env.PORT || 4000);
const BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const MAIL_TO = process.env.MAIL_TO || 'hemanth.mareedu8@gmail.com';
const MAIL_FROM = process.env.MAIL_FROM || 'Component Requests <no-reply@example.com>';

const app = express();
app.use(cors());
app.use(express.json());

// Request store, persisted to disk so approvals survive restarts and the
// automation worker can read them.
/** @type {Map<string, {request:object, status:'pending'|'approved'|'rejected', createdAt:number, decidedAt?:number}>} */
const requests = new Map(Object.entries(loadRequests()));
const persist = () => saveRequests(Object.fromEntries(requests));

const mailerReady = createMailer();

/** POST /api/request — send the request email and return its id. */
app.post('/api/request', async (req, res) => {
  const { componentName, description, project } = req.body ?? {};
  if (!componentName?.trim() || !description?.trim() || !project?.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: 'componentName, description and project are required.' });
  }

  const id = randomUUID();
  const request = {
    componentName: componentName.trim(),
    description: description.trim(),
    project: project.trim(),
  };
  requests.set(id, { request, status: 'pending', createdAt: Date.now() });
  persist();

  try {
    const { transport, isTest } = await mailerReady;
    const { subject, html, text } = buildEmail({ request, id, baseUrl: BASE_URL });

    const info = await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject,
      text,
      html,
    });

    const previewUrl = isTest ? nodemailer.getTestMessageUrl(info) : undefined;
    if (previewUrl) console.log(`[mail] test preview: ${previewUrl}`);

    return res.json({ ok: true, id, to: MAIL_TO, messageId: info.messageId, previewUrl });
  } catch (err) {
    console.error('[mail] send failed:', err);
    requests.delete(id);
    persist();
    return res.status(502).json({ ok: false, error: 'Failed to send email.' });
  }
});

/** Shared handler for the Approve/Reject links inside the email. */
function decide(status) {
  return (req, res) => {
    const entry = requests.get(req.params.id);
    if (!entry) return res.status(404).send(page('Not found', 'This request no longer exists.'));
    entry.status = status;
    entry.decidedAt = Date.now();
    persist();
    const color = status === 'approved' ? '#16a34a' : '#dc2626';
    res.send(
      page(
        `Request ${status}`,
        `<strong>${entry.request.componentName}</strong> (${entry.request.project}) has been <span style="color:${color};font-weight:700">${status}</span>.`,
      ),
    );
  };
}

app.get('/approve/:id', decide('approved'));
app.get('/reject/:id', decide('rejected'));

/** GET /api/approved — all approved requests (consumed by the worker). */
app.get('/api/approved', (_req, res) => {
  const items = [...requests.entries()]
    .filter(([, e]) => e.status === 'approved')
    .map(([id, e]) => ({ id, ...e }));
  res.json({ ok: true, count: items.length, items });
});

/** GET /api/status/:id — inspect a request's current status. */
app.get('/api/status/:id', (req, res) => {
  const entry = requests.get(req.params.id);
  if (!entry) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, id: req.params.id, status: entry.status, request: entry.request });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head>
  <body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;margin:0;padding:60px 20px;text-align:center">
    <div style="max-width:440px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:32px">
      <h2 style="margin:0 0 12px;color:#0f172a">${title}</h2>
      <p style="color:#475569;line-height:1.5">${body}</p>
    </div>
  </body></html>`;
}

app.listen(PORT, async () => {
  const { isTest } = await mailerReady;
  console.log(`Component request server listening on ${BASE_URL}`);
  console.log(`Emails will be sent to: ${MAIL_TO}`);
  console.log(
    isTest
      ? '[mode] No SMTP credentials found -> using Ethereal test inbox (mail is NOT delivered; a preview URL is logged per send).'
      : '[mode] Using configured SMTP credentials -> real delivery.',
  );
});
