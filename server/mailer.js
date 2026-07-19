import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer transport. If real SMTP credentials are present it uses
 * them; otherwise it creates an Ethereal test account so the send flow works
 * out of the box (mail is captured, not delivered, and a preview URL is logged).
 *
 * @returns {Promise<{ transport: import('nodemailer').Transporter, isTest: boolean }>}
 */
export async function createMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_USER && SMTP_PASS) {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT || 465),
      secure: String(SMTP_SECURE ?? 'true') === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return { transport, isTest: false };
  }

  // No credentials -> fall back to an Ethereal test inbox.
  const testAccount = await nodemailer.createTestAccount();
  const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return { transport, isTest: true };
}

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Builds the request email (HTML + plain text) including working
 * Approve / Reject buttons that link back to the server.
 */
export function buildEmail({ request, id, baseUrl }) {
  const { componentName, description, project } = request;
  const approveUrl = `${baseUrl}/approve/${id}`;
  const rejectUrl = `${baseUrl}/reject/${id}`;

  const subject = `New Component Request: ${componentName}`;

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <div style="background:#4f46e5;color:#fff;padding:20px 24px">
      <h2 style="margin:0;font-size:18px">New Component Request</h2>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:6px 0;color:#64748b;width:120px">Component</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600">${escape(componentName)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b">Project</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600">${escape(project)}</td>
        </tr>
      </table>
      <p style="margin:16px 0 6px;color:#64748b;font-size:13px">Description / desired functionality</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:14px;color:#0f172a;white-space:pre-wrap">${escape(description)}</div>

      <div style="margin-top:24px">
        <a href="${approveUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-weight:600;font-size:14px;margin-right:8px">Approve</a>
        <a href="${rejectUrl}" style="display:inline-block;background:#fff;color:#dc2626;text-decoration:none;padding:9px 21px;border:1px solid #dc2626;border-radius:8px;font-weight:600;font-size:14px">Reject</a>
      </div>
    </div>
    <div style="padding:12px 24px;background:#f8fafc;color:#94a3b8;font-size:12px">
      Submitted via the Component Request Wizard.
    </div>
  </div>`;

  const text = [
    'New Component Request',
    '',
    `Component: ${componentName}`,
    `Project:   ${project}`,
    '',
    'Description / desired functionality:',
    description,
    '',
    `Approve: ${approveUrl}`,
    `Reject:  ${rejectUrl}`,
  ].join('\n');

  return { subject, html, text, approveUrl, rejectUrl };
}
