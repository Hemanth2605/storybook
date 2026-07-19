import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataTable, type Column } from './DataTable';
import { StatusChip, type StatusKind } from '../StatusChip/StatusChip';

interface User {
  id: number;
  name: string;
  email: string;
  status: StatusKind;
  signups: number;
}

const rows: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', status: 'active', signups: 42 },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com', status: 'pending', signups: 17 },
  { id: 3, name: 'Grace Hopper', email: 'grace@example.com', status: 'active', signups: 88 },
  { id: 4, name: 'Katherine Johnson', email: 'kat@example.com', status: 'inactive', signups: 5 },
];

const columns: Column<User>[] = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'signups', label: 'Signups', align: 'right' },
  {
    id: 'status',
    label: 'Status',
    render: (row) => <StatusChip status={row.status} />,
  },
];

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DataTable<User>>;

export const Default: Story = {
  args: { columns, rows, getRowId: (r) => r.id, onRowClick: fn() },
};

export const Dense: Story = {
  args: { columns, rows, getRowId: (r) => r.id, dense: true },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    getRowId: (r) => r.id,
    emptyMessage: 'No users found.',
  },
};
