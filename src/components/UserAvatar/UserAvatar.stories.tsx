import type { Meta, StoryObj } from '@storybook/react-vite';
import Stack from '@mui/material/Stack';
import { UserAvatar } from './UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Components/UserAvatar',
  component: UserAvatar,
  tags: ['autodocs'],
  args: { name: 'Ada Lovelace', tooltip: true },
};
export default meta;

type Story = StoryObj<typeof UserAvatar>;

export const Initials: Story = {};

export const Online: Story = {
  args: { online: true },
};

export const Offline: Story = {
  args: { online: false },
};

export const Group: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <UserAvatar name="Ada Lovelace" online />
      <UserAvatar name="Alan Turing" online={false} />
      <UserAvatar name="Grace Hopper" online />
      <UserAvatar name="Katherine Johnson" />
    </Stack>
  ),
};
