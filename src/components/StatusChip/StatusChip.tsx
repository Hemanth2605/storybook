import Chip, { type ChipProps } from '@mui/material/Chip';
import CircleIcon from '@mui/icons-material/Circle';

export type StatusKind =
  | 'active'
  | 'pending'
  | 'inactive'
  | 'error'
  | 'success'
  | 'warning';

type StatusConfig = { label: string; color: ChipProps['color'] };

const STATUS_MAP: Record<StatusKind, StatusConfig> = {
  active: { label: 'Active', color: 'success' },
  success: { label: 'Success', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  warning: { label: 'Warning', color: 'warning' },
  inactive: { label: 'Inactive', color: 'default' },
  error: { label: 'Error', color: 'error' },
};

export interface StatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: StatusKind;
  /** Override the default label for the status. */
  label?: string;
  /** Renders a small status dot instead of leaving the icon empty. */
  showDot?: boolean;
}

/**
 * Chip built on MUI v7 that maps a semantic status to a consistent
 * label + color, with an optional leading status dot.
 */
export function StatusChip({
  status,
  label,
  showDot = true,
  size = 'small',
  variant = 'outlined',
  ...rest
}: StatusChipProps) {
  const config = STATUS_MAP[status];
  return (
    <Chip
      {...rest}
      size={size}
      variant={variant}
      color={config.color}
      label={label ?? config.label}
      icon={showDot ? <CircleIcon sx={{ fontSize: 10 }} /> : undefined}
    />
  );
}

export default StatusChip;
