export interface ComponentRequest {
  /** Name of the missing component being requested. */
  componentName: string;
  /** Free-text description of the desired functionality. */
  description: string;
  /** Project the requester belongs to. */
  project: string;
}

export interface BuiltEmail {
  subject: string;
  /** Plain-text body (used for the mailto link). */
  body: string;
  /** Full `mailto:` href that opens the request email pre-filled. */
  mailtoHref: string;
  /** `mailto:` href that composes an approval reply. */
  approveHref: string;
  /** `mailto:` href that composes a rejection reply. */
  rejectHref: string;
}

const mailto = (to: string, subject: string, body: string) =>
  `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

/**
 * Composes the request email plus the approve/reject reply links for a
 * given recipient. Pure and easily testable.
 */
export function buildRequestEmail(
  request: ComponentRequest,
  recipient: string,
): BuiltEmail {
  const { componentName, description, project } = request;

  const subject = `New Component Request: ${componentName}`;

  const approveHref = mailto(
    recipient,
    `APPROVED — ${componentName}`,
    `The component request "${componentName}" (project: ${project}) has been APPROVED.`,
  );
  const rejectHref = mailto(
    recipient,
    `REJECTED — ${componentName}`,
    `The component request "${componentName}" (project: ${project}) has been REJECTED.\n\nReason: `,
  );

  const body = [
    'A new component request has been submitted.',
    '',
    `Component : ${componentName}`,
    `Project   : ${project}`,
    '',
    'Description / desired functionality:',
    description,
    '',
    '--------------------------------------------------',
    'Please review this request:',
    `Approve : ${approveHref}`,
    `Reject  : ${rejectHref}`,
    '',
    'Submitted via the Component Request Wizard.',
  ].join('\n');

  return {
    subject,
    body,
    mailtoHref: mailto(recipient, subject, body),
    approveHref,
    rejectHref,
  };
}

export default buildRequestEmail;
