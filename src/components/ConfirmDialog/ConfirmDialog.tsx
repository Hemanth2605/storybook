import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { AppButton } from '../AppButton/AppButton';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** Body text or arbitrary content. */
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** Uses the error palette + wording for irreversible actions. */
  destructive?: boolean;
  /** Shows a spinner on the confirm button and blocks closing. */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable confirmation dialog built on MUI v7 Dialog. Handy for delete
 * confirmations and other guarded actions.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      aria-labelledby="confirm-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText component="div">{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading} color="inherit">
          {cancelText}
        </Button>
        <AppButton
          onClick={onConfirm}
          loading={loading}
          color={destructive ? 'error' : 'primary'}
        >
          {confirmText}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
