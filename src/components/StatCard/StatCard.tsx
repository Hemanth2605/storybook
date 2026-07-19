import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export interface StatCardProps {
  /** Metric label, e.g. "Monthly revenue". */
  title: string;
  /** Primary value, e.g. "$48,120". */
  value: ReactNode;
  /** Optional icon rendered in a tinted avatar. */
  icon?: ReactNode;
  /** Percentage change; positive is up, negative is down. */
  changePercent?: number;
  /** Helper text shown under the trend, e.g. "vs last month". */
  changeLabel?: string;
}

/**
 * Compact metric card built on MUI v7 Card, showing a value and an
 * optional trend indicator.
 */
export function StatCard({
  title,
  value,
  icon,
  changePercent,
  changeLabel = 'vs last period',
}: StatCardProps) {
  const isUp = (changePercent ?? 0) >= 0;
  const trendColor = isUp ? 'success.main' : 'error.main';

  return (
    <Card sx={{ minWidth: 240 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Stack>
          {icon && (
            <Avatar
              variant="rounded"
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
            >
              {icon}
            </Avatar>
          )}
        </Stack>

        {changePercent !== undefined && (
          <Stack direction="row" spacing={0.5} alignItems="center" mt={1.5}>
            {isUp ? (
              <TrendingUpIcon fontSize="small" sx={{ color: trendColor }} />
            ) : (
              <TrendingDownIcon fontSize="small" sx={{ color: trendColor }} />
            )}
            <Typography variant="body2" sx={{ color: trendColor }} fontWeight={600}>
              {isUp ? '+' : ''}
              {changePercent}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {changeLabel}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;
