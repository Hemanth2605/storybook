import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export interface AppButtonProps extends ButtonProps {
  /** Shows a spinner and disables the button while true. */
  loading?: boolean;
  /** Text shown next to the spinner while loading. Falls back to children. */
  loadingText?: string;
}

/**
 * Opinionated wrapper around MUI v7 Button that adds an inline loading state.
 * Defaults to a contained primary button.
 */
export function AppButton({
  loading = false,
  loadingText,
  disabled,
  children,
  startIcon,
  variant = 'contained',
  color = 'primary',
  ...rest
}: AppButtonProps) {
  return (
    <Button
      {...rest}
      variant={variant}
      color={color}
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" thickness={5} />
        ) : (
          startIcon
        )
      }
    >
      {loading ? loadingText ?? children : children}
    </Button>
  );
}

export default AppButton;
