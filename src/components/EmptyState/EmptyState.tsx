import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Icon shown in the tinted circle. Defaults to an inbox icon. */
  icon?: ReactNode;
  /** Call-to-action node, e.g. a button. */
  action?: ReactNode;
}

/**
 * Empty-state placeholder built on MUI v7 primitives: a tinted icon,
 * a title, description, and an optional call to action.
 */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Stack
      alignItems="center"
      textAlign="center"
      spacing={2}
      sx={{ py: 6, px: 3 }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}
      >
        {icon ?? <InboxIcon fontSize="large" />}
      </Box>

      <Stack spacing={0.5} alignItems="center">
        <Typography variant="h6">{title}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" maxWidth={360}>
            {description}
          </Typography>
        )}
      </Stack>

      {action && <Box>{action}</Box>}
    </Stack>
  );
}

export default EmptyState;
