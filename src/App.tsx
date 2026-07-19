import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import {
  AlertBanner,
  AppButton,
  ComponentRequestWizard,
  ConfirmDialog,
  DataTable,
  EmptyState,
  PageHeader,
  SearchField,
  StatCard,
  StatusChip,
  UserAvatar,
  type Column,
  type StatusKind,
} from './components';

interface User {
  id: number;
  name: string;
  email: string;
  status: StatusKind;
  signups: number;
}

const users: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', status: 'active', signups: 42 },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com', status: 'pending', signups: 17 },
  { id: 3, name: 'Grace Hopper', email: 'grace@example.com', status: 'active', signups: 88 },
  { id: 4, name: 'Katherine Johnson', email: 'kat@example.com', status: 'inactive', signups: 5 },
];

const columns: Column<User>[] = [
  {
    id: 'name',
    label: 'Name',
    render: (row) => (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <UserAvatar name={row.name} sx={{ width: 32, height: 32, fontSize: 14 }} />
        {row.name}
      </Stack>
    ),
  },
  { id: 'email', label: 'Email' },
  { id: 'signups', label: 'Signups', align: 'right' },
  { id: 'status', label: 'Status', render: (row) => <StatusChip status={row.status} /> },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Dashboard"
        subtitle="A showcase of 10 custom components built on MUI v7."
        breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Dashboard' }]}
        actions={
          <AppButton startIcon={<AddIcon />} onClick={() => setConfirmOpen(true)}>
            New customer
          </AppButton>
        }
      />

      <AlertBanner severity="info" title="Welcome" dismissible>
        These components are also available as isolated Storybook stories.
      </AlertBanner>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Active users" value="12,480" icon={<PeopleIcon />} changePercent={12.5} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Revenue" value="$48,120" icon={<PaidIcon />} changePercent={8.2} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Orders" value="1,024" icon={<ShoppingCartIcon />} changePercent={-2.1} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <SearchField placeholder="Search customers…" onSearch={setQuery} sx={{ width: 320 }} />
      </Stack>

      {filtered.length > 0 ? (
        <DataTable columns={columns} rows={filtered} getRowId={(r) => r.id} onRowClick={() => {}} />
      ) : (
        <Paper variant="outlined">
          <EmptyState
            title="No customers match your search"
            description="Try a different name or email."
            action={<AppButton onClick={() => setQuery('')}>Clear search</AppButton>}
          />
        </Paper>
      )}

      <Divider sx={{ my: 4 }} />

      <Stack spacing={2} sx={{ mb: 2 }}>
        <PageHeader
          title="Request a component"
          subtitle="Missing something? Send a request — it's emailed to the reviewer with Approve / Reject buttons."
        />
      </Stack>
      <ComponentRequestWizard />

      <ConfirmDialog
        open={confirmOpen}
        title="Add a new customer?"
        description="This is just a demo dialog wired up to the toolbar action."
        confirmText="Add"
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}
