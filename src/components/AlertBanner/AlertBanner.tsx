import { useState, type ReactNode } from 'react';
import Alert, { type AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';

export interface AlertBannerProps {
  severity?: AlertColor;
  title?: string;
  children: ReactNode;
  /** Renders a close button and animates the banner away when dismissed. */
  dismissible?: boolean;
  /** Optional action node (e.g. a button) shown on the right. */
  action?: ReactNode;
  /** Called after the banner is dismissed. */
  onClose?: () => void;
}

/**
 * Dismissible alert banner built on MUI v7 Alert with a collapse animation
 * and an optional title and action.
 */
export function AlertBanner({
  severity = 'info',
  title,
  children,
  dismissible = false,
  action,
  onClose,
}: AlertBannerProps) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={action}
        onClose={dismissible ? handleClose : undefined}
        variant="outlined"
        sx={{ alignItems: 'center' }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </Collapse>
  );
}

export default AlertBanner;
