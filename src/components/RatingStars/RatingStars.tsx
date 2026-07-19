import { useId, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Skeleton from '@mui/material/Skeleton';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

export type RatingStarsSize = 'small' | 'medium' | 'large';

export interface RatingStarsProps {
  /** Controlled value (number of stars). Omit for an uncontrolled input. */
  value?: number | null;
  /** Initial value when uncontrolled. */
  defaultValue?: number;
  /** Emitted whenever the rating changes (click or keyboard). */
  onChange?: (value: number | null) => void;
  /** Number of stars. */
  max?: number;
  /** Smallest selectable increment. `0.5` enables half-star support. */
  precision?: number;
  /** Show the stars without allowing input (e.g. an average score). */
  readOnly?: boolean;
  /** Fully disables interaction and dims the control. */
  disabled?: boolean;
  /** Star size. */
  size?: RatingStarsSize;
  /** Field label rendered above the stars. */
  label?: string;
  /** Helper or validation text rendered below the stars. */
  helperText?: ReactNode;
  /** Marks the field as invalid (critical color for stars, label, helper). */
  error?: boolean;
  /** Renders a numeric readout next to the stars. */
  showValue?: boolean;
  /** Readout text shown when nothing is rated yet. */
  emptyText?: string;
  /** Renders a skeleton in place of the stars while a value is loading. */
  loading?: boolean;
  /** Radio-group name; auto-generated when omitted. */
  name?: string;
}

/**
 * Star rating input built on MUI v7 Rating. Adds an ADS contract on top of the
 * substrate: a field label, a numeric readout, and loading/empty/error states.
 * Hover preview, keyboard arrows, and half-star precision come from the
 * substrate; all styling is driven by ADS tokens (via the shared theme).
 */
export function RatingStars({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  precision = 0.5,
  readOnly = false,
  disabled = false,
  size = 'medium',
  label,
  helperText,
  error = false,
  showValue = false,
  emptyText = 'Not rated',
  loading = false,
  name,
}: RatingStarsProps) {
  const reactId = useId();
  const fieldId = name ?? `rating-${reactId}`;
  const labelId = `${fieldId}-label`;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue || null);
  const current = isControlled ? value ?? null : internal;

  const handleChange = (_event: React.SyntheticEvent, next: number | null) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

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
          sx={(theme) => ({
            width: theme.spacing(max * 4),
            height: theme.spacing(4),
          })}
        />
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          <Rating
            name={fieldId}
            aria-labelledby={label ? labelId : undefined}
            value={current}
            onChange={handleChange}
            precision={precision}
            max={max}
            readOnly={readOnly}
            disabled={disabled}
            size={size}
            icon={<StarRoundedIcon fontSize="inherit" />}
            emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
            getLabelText={(v) => `${v} Star${v === 1 ? '' : 's'}`}
            sx={(theme) => ({
              color: error ? theme.palette.error.main : theme.palette.primary.main,
              '& .MuiRating-iconEmpty': {
                color: theme.palette.text.disabled,
              },
              '& .MuiRating-iconHover': {
                color: error ? theme.palette.error.dark : theme.palette.primary.dark,
              },
              '& .MuiRating-iconFocus': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: theme.spacing(0.25),
                borderRadius: theme.shape.borderRadius,
              },
            })}
          />

          {showValue && (
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: error ? 'error.main' : 'text.secondary' }}
            >
              {current ? `${current} / ${max}` : emptyText}
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

export default RatingStars;
