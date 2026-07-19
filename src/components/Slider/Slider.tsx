import { useId, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiSlider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Skeleton from '@mui/material/Skeleton';

export type SliderSize = 'small' | 'medium';

export interface SliderProps {
  /** Controlled value. Omit for an uncontrolled input. */
  value?: number;
  /** Initial value when uncontrolled. */
  defaultValue?: number;
  /** Emitted continuously while dragging (click or keyboard). */
  onChange?: (value: number) => void;
  /** Emitted once the user releases the thumb — good for committing a value. */
  onChangeCommitted?: (value: number) => void;
  /** Lowest selectable value. */
  min?: number;
  /** Highest selectable value. */
  max?: number;
  /** Smallest selectable increment. */
  step?: number;
  /** Fully disables interaction and dims the control. */
  disabled?: boolean;
  /** Thumb/track size. */
  size?: SliderSize;
  /** Field label rendered above the track. */
  label?: string;
  /** Helper or validation text rendered below the track. */
  helperText?: ReactNode;
  /** Marks the field as invalid (critical color for track, label, helper). */
  error?: boolean;
  /** Renders a numeric percentage readout next to the track. */
  showValue?: boolean;
  /** Render evenly spaced tick marks along the track. */
  marks?: boolean;
  /**
   * Formats the label shown on the thumb (the circle) on hover/focus/drag.
   * Receives both the raw value and its percentage of the min–max range.
   * Defaults to a rounded percentage, e.g. `"40%"`.
   */
  formatLabel?: (value: number, percent: number) => ReactNode;
  /** Renders a skeleton in place of the track while a value is loading. */
  loading?: boolean;
  /** Input name; auto-generated when omitted. */
  name?: string;
}

/** Percentage of `value` within the `[min, max]` range, clamped to 0–100. */
function toPercent(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const pct = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, pct));
}

/**
 * Range slider built on MUI v7 Slider. Adds an ADS contract on top of the
 * substrate: a field label, an optional percentage readout, and
 * loading/empty/error states. Its headline behavior is a percentage label that
 * appears **on the slider circle (thumb)** on hover — as well as on focus and
 * while dragging — so the current position is always legible at the point of
 * interaction. Keyboard operation and dragging come from the substrate; all
 * styling is driven by ADS tokens (via the shared theme).
 */
export function Slider({
  value,
  defaultValue = 0,
  onChange,
  onChangeCommitted,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'medium',
  label,
  helperText,
  error = false,
  showValue = false,
  marks = false,
  formatLabel,
  loading = false,
  name,
}: SliderProps) {
  const reactId = useId();
  const fieldId = name ?? `slider-${reactId}`;
  const labelId = `${fieldId}-label`;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number>(defaultValue);
  const current = isControlled ? value : internal;
  const percent = toPercent(current, min, max);

  const handleChange = (_event: Event, next: number | number[]) => {
    const value = Array.isArray(next) ? next[0] : next;
    if (!isControlled) setInternal(value);
    onChange?.(value);
  };

  const handleCommitted = (
    _event: Event | React.SyntheticEvent,
    next: number | number[],
  ) => {
    onChangeCommitted?.(Array.isArray(next) ? next[0] : next);
  };

  const renderLabel = (raw: number) =>
    formatLabel
      ? formatLabel(raw, toPercent(raw, min, max))
      : `${Math.round(toPercent(raw, min, max))}%`;

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
          sx={(theme) => ({ width: '100%', height: theme.spacing(1) })}
        />
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          <MuiSlider
            name={fieldId}
            aria-labelledby={label ? labelId : undefined}
            value={current}
            onChange={handleChange}
            onChangeCommitted={handleCommitted}
            min={min}
            max={max}
            step={step}
            marks={marks}
            disabled={disabled}
            size={size}
            color={error ? 'error' : 'primary'}
            // The percentage rides on the thumb (circle): shown on hover, focus,
            // and while dragging via the substrate's "auto" value-label mode.
            valueLabelDisplay="auto"
            valueLabelFormat={renderLabel}
            getAriaValueText={(v) => `${Math.round(toPercent(v, min, max))} percent`}
            sx={(theme) => ({
              '& .MuiSlider-valueLabel': {
                backgroundColor: error
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: theme.shape.borderRadius,
                fontWeight: 600,
              },
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 ${theme.spacing(1)} ${
                    error ? theme.palette.error.main : theme.palette.primary.main
                  }24`,
                },
              },
            })}
          />

          {showValue && (
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                minWidth: (theme) => theme.spacing(5),
                textAlign: 'right',
                color: error ? 'error.main' : 'text.secondary',
              }}
            >
              {`${Math.round(percent)}%`}
            </Typography>
          )}
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

export default Slider;
