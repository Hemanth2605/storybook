import type { Meta, StoryObj } from '@storybook/react-vite';
import Stack from '@mui/material/Stack';
import { StatusChip, type StatusKind } from './StatusChip';

const meta: Meta<typeof StatusChip> = {
  title: 'Components/StatusChip',
  component: StatusChip,
  tags: ['autodocs'],
  args: { status: 'active' },
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'pending', 'inactive', 'error', 'success', 'warning'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof StatusChip>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => {
    const statuses: StatusKind[] = [
      'active',
      'pending',
      'inactive',
      'error',
      'success',
      'warning',
    ];
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {statuses.map((s) => (
          <StatusChip key={s} status={s} />
        ))}
      </Stack>
    );
  },
};

export const Filled: Story = {
  args: { variant: 'filled' },
};
