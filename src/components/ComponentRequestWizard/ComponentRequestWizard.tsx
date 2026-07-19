import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { AppButton } from '../AppButton/AppButton';
import {
  buildRequestEmail,
  type BuiltEmail,
  type ComponentRequest,
} from './buildRequestEmail';

export interface ComponentRequestWizardProps {
  /** Fixed address the request email is sent to. */
  recipientEmail?: string;
  /** Called with the request payload + composed email when submitted. */
  onSubmit?: (request: ComponentRequest, email: BuiltEmail) => void;
  /**
   * Opens the user's mail client via `mailto:` on submit. Set false to
   * only preview the email (useful in Storybook). Default true.
   */
  openMailClient?: boolean;
}

const STEPS = ['Missing component', 'Describe it', 'Your project', 'Review & send'];

const EMPTY: ComponentRequest = { componentName: '', description: '', project: '' };

/**
 * A guided, step-by-step intake wizard (built on MUI v7 Stepper). It asks
 * for a missing component, a functionality description, and the requester's
 * project, then composes a formatted request email — with Approve / Reject
 * reply buttons — addressed to a fixed recipient.
 */
export function ComponentRequestWizard({
  recipientEmail = 'hemanth.mareedu8@gmail.com',
  onSubmit,
  openMailClient = true,
}: ComponentRequestWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<ComponentRequest>(EMPTY);
  const [sent, setSent] = useState(false);

  const email = useMemo(
    () => buildRequestEmail(form, recipientEmail),
    [form, recipientEmail],
  );

  const set = (key: keyof ComponentRequest) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const stepValid = [
    form.componentName.trim() !== '',
    form.description.trim() !== '',
    form.project.trim() !== '',
    true,
  ][activeStep];

  const next = () => setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    onSubmit?.(form, email);
    if (openMailClient) window.location.href = email.mailtoHref;
    setSent(true);
  };

  const reset = () => {
    setForm(EMPTY);
    setActiveStep(0);
    setSent(false);
  };

  if (sent) {
    return (
      <Paper variant="outlined" sx={{ p: 4, maxWidth: 640, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <CheckCircleIcon color="success" sx={{ fontSize: 56 }} />
          <Typography variant="h6">Request sent</Typography>
          <Typography variant="body2" color="text.secondary">
            Your request for <strong>{form.componentName}</strong> was composed for{' '}
            <strong>{recipientEmail}</strong>. The reviewer can Approve or Reject it
            directly from the email.
          </Typography>
          <Button onClick={reset}>Submit another request</Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, maxWidth: 640, mx: 'auto' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 210 }}>
        {activeStep === 0 && (
          <Stack spacing={1.5}>
            <Typography variant="h6">Is any component missing?</Typography>
            <Typography variant="body2" color="text.secondary">
              Tell us the name of the component you'd like added.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Component name"
              placeholder="e.g. DateRangePicker"
              value={form.componentName}
              onChange={(e) => set('componentName')(e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={1.5}>
            <Typography variant="h6">Describe the component</Typography>
            <Typography variant="body2" color="text.secondary">
              How should it look and behave? List the functionality you need.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={5}
              label="Description & functionality"
              placeholder="e.g. Two linked calendars, presets for last 7/30 days, min/max dates, emits a start/end range…"
              value={form.description}
              onChange={(e) => set('description')(e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={1.5}>
            <Typography variant="h6">Which project are you from?</Typography>
            <Typography variant="body2" color="text.secondary">
              This helps the reviewer route your request.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Project"
              placeholder="e.g. Billing Dashboard"
              value={form.project}
              onChange={(e) => set('project')(e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack spacing={2}>
            <Typography variant="h6">Review your request</Typography>
            <EmailPreview
              recipient={recipientEmail}
              request={form}
              email={email}
            />
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" justifyContent="space-between">
        <Button onClick={back} disabled={activeStep === 0} color="inherit">
          Back
        </Button>
        {activeStep < STEPS.length - 1 ? (
          <AppButton onClick={next} disabled={!stepValid}>
            Next
          </AppButton>
        ) : (
          <AppButton onClick={submit} startIcon={<SendIcon />}>
            Submit
          </AppButton>
        )}
      </Stack>
    </Paper>
  );
}

/** Formatted preview of the email that will be sent, incl. action buttons. */
function EmailPreview({
  recipient,
  request,
  email,
}: {
  recipient: string;
  request: ComponentRequest;
  email: BuiltEmail;
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'action.hover', px: 2, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          To: {recipient}
        </Typography>
        <Typography variant="subtitle2">{email.subject}</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Field label="Component" value={request.componentName || '—'} />
          <Field label="Project" value={request.project || '—'} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Description / desired functionality
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {request.description || '—'}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          Reviewer actions (included in the email):
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            href={email.approveHref}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            href={email.rejectHref}
          >
            Reject
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

export default ComponentRequestWizard;
