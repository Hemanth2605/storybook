import { useState } from 'react';
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
import Link from '@mui/material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { AppButton } from '../AppButton/AppButton';
import { AlertBanner } from '../AlertBanner/AlertBanner';
import type { ComponentRequest } from './buildRequestEmail';

export interface SubmitResult {
  ok: boolean;
  id?: string;
  to?: string;
  /** Present when the server used a test inbox: a URL to view the sent mail. */
  previewUrl?: string;
}

export interface ComponentRequestWizardProps {
  /** Endpoint that sends the email. Defaults to the proxied `/api/request`. */
  apiUrl?: string;
  /** Address shown to the user as the destination (informational). */
  recipientEmail?: string;
  /** Called after a successful submit with the payload + server result. */
  onSubmit?: (request: ComponentRequest, result: SubmitResult) => void;
}

const STEPS = ['Missing component', 'Describe it', 'Your project', 'Review & send'];

const EMPTY: ComponentRequest = { componentName: '', description: '', project: '' };

/**
 * A guided, step-by-step intake wizard (built on MUI v7 Stepper). It asks for a
 * missing component, a functionality description, and the requester's project,
 * then POSTs to a backend that emails the request — with working Approve /
 * Reject buttons — to a fixed recipient.
 */
export function ComponentRequestWizard({
  apiUrl = '/api/request',
  recipientEmail = 'hemanth.mareedu8@gmail.com',
  onSubmit,
}: ComponentRequestWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<ComponentRequest>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

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

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: SubmitResult & { error?: string } = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setResult(data);
      onSubmit?.(form, data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not reach the email server.',
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setActiveStep(0);
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <Paper variant="outlined" sx={{ p: 4, maxWidth: 640, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <CheckCircleIcon color="success" sx={{ fontSize: 56 }} />
          <Typography variant="h6">Request sent</Typography>
          <Typography variant="body2" color="text.secondary">
            Your request for <strong>{form.componentName}</strong> was emailed to{' '}
            <strong>{result.to ?? recipientEmail}</strong>. The reviewer can Approve
            or Reject it directly from the email.
          </Typography>
          {result.previewUrl && (
            <Typography variant="body2">
              Test inbox preview:{' '}
              <Link href={result.previewUrl} target="_blank" rel="noreferrer">
                view the sent email
              </Link>
            </Typography>
          )}
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
            <RequestSummary recipient={recipientEmail} request={form} />
            {error && (
              <AlertBanner severity="error" title="Could not send">
                {error}
              </AlertBanner>
            )}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" justifyContent="space-between">
        <Button onClick={back} disabled={activeStep === 0 || loading} color="inherit">
          Back
        </Button>
        {activeStep < STEPS.length - 1 ? (
          <AppButton onClick={next} disabled={!stepValid}>
            Next
          </AppButton>
        ) : (
          <AppButton
            onClick={submit}
            loading={loading}
            loadingText="Sending…"
            startIcon={<SendIcon />}
          >
            Submit
          </AppButton>
        )}
      </Stack>
    </Paper>
  );
}

/** Read-only summary of the request shown on the review step. */
function RequestSummary({
  recipient,
  request,
}: {
  recipient: string;
  request: ComponentRequest;
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'action.hover', px: 2, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Will be emailed to: {recipient}
        </Typography>
        <Typography variant="subtitle2">
          New Component Request: {request.componentName || '—'}
        </Typography>
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
        <Typography variant="caption" color="text.secondary">
          The email includes <strong>Approve</strong> and <strong>Reject</strong>{' '}
          buttons the reviewer can click.
        </Typography>
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
