import { useId, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiSwitch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Skeleton from '@mui/material/Skeleton';

export type SwitchSize = 'small' | 'medium';

export interface SwitchProps {
  /** Controlled on/off state. Omit for an uncontrolled toggle. */
  checked?: boolean;
  /** Initial state when uncontrolled. Defaults to `false` (shows the off text). */
  defaultChecked?: boolean;
  /** Emitted whenever the toggle flips (click or keyboard). */
  onChange?: (checked: boolean) => void;
  /** Text shown next to the track while on. */
  onText?: string;
  /** Text shown next to the track while off. */
  offText?: string;
  /** Fully disables interaction and dims the control. */
  disabled?: boolean;
  /** Track/thumb size. */
  size?: SwitchSize;
  /** Field label rendered above the track. */
  label?: string;
  /** Helper or validation text rendered below the track. */
  helperText?: ReactNode;
  /** Marks the field as invalid (critical color for label, helper). */
  error?: boolean;
  /** Renders a skeleton in place of the track while a value is loading. */
  loading?: boolean;
  /** Input name; auto-generated when omitted. */
  name?: string;
}

/**
 * On/off toggle built on MUI v7 Switch. Adds an ADS contract on top of the
 * substrate: a field label, a live state readout, and loading/error states.
 * Its headline behavior is the **state text that flips with the toggle** — it
 * reads the off text by default and switches to the on text the moment the
 * control is clicked (or toggled with the keyboard), so the current state is
 * always spelled out in words next to the track. Keyboard operation and focus
 * come from the substrate; all styling is driven by ADS tokens (via the shared
 * theme).
 */
export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  onText = 'On',
  offText = 'Off',
  disabled = false,
  size = 'medium',
  label,
  helperText,
  error = false,
  loading = false,
  name,
}: SwitchProps) {
  const reactId = useId();
  const fieldId = name ?? `switch-${reactId}`;
  const labelId = `${fieldId}-label`;
  const stateId = `${fieldId}-state`;

  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState<boolean>(defaultChecked);
  const current = isControlled ? checked : internal;

  const handleChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    next: boolean,
  ) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  // The word next to the track flips with the state: off text by default,
  // on text once toggled.
  const stateText = current ? onText : offText;

  return (
    <Box>
      {label && (
        <FormLabel
          id={labelId}
          error={error}
          disabled={disabled}
          sx={{ display: 'block', mb: 1, typography: 'body2', fontWeight: 600 }}
        >
          {label}
        </FormLabel>
      )}

      {loading ? (
        <Skeleton
          variant="rounded"
          sx={(theme) => ({ width: theme.spacing(9), height: theme.spacing(3) })}
        />
      ) : (
        <Stack direction="row" spacing={1} alignItems="center">
          <MuiSwitch
            name={fieldId}
            inputProps={{
              'aria-labelledby': label ? labelId : undefined,
              'aria-describedby': stateId,
            }}
            checked={current}
            onChange={handleChange}
            disabled={disabled}
            size={size}
            color={error ? 'error' : 'primary'}
            sx={(theme) => ({
              '& .MuiSwitch-switchBase.Mui-focusVisible .MuiSwitch-thumb': {
                boxShadow: `0 0 0 ${theme.spacing(0.5)} ${
                  error ? theme.palette.error.main : theme.palette.primary.main
                }`,
              },
            })}
          />

          <Typography
            id={stateId}
            variant="body2"
            fontWeight={600}
            sx={{
              minWidth: (theme) => theme.spacing(4),
              color: error
                ? 'error.main'
                : current
                  ? 'text.primary'
                  : 'text.secondary',
            }}
          >
            {stateText}
          </Typography>
        </Stack>
      )}

      {helperText && (
        <FormHelperText error={error} disabled={disabled} sx={{ mx: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default Switch;
