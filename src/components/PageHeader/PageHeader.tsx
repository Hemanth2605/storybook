import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Trail of breadcrumbs; the last item renders as current page text. */
  breadcrumbs?: Crumb[];
  /** Action buttons rendered on the right (e.g. "New item"). */
  actions?: ReactNode;
}

/**
 * Standard page header built on MUI v7 primitives: breadcrumbs, a title,
 * an optional subtitle, and a slot for actions.
 */
export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <Box component="header" sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }} aria-label="breadcrumb">
          {breadcrumbs.map((crumb, i) =>
            i < breadcrumbs.length - 1 && crumb.href ? (
              <Link key={crumb.label} underline="hover" color="inherit" href={crumb.href}>
                {crumb.label}
              </Link>
            ) : (
              <Typography key={crumb.label} color="text.primary">
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h1">{title}</Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Stack direction="row" spacing={1} flexShrink={0}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default PageHeader;
