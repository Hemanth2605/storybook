import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: { onSearch: fn(), placeholder: 'Search customers…' },
};
export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {};

export const Prefilled: Story = {
  args: { value: 'acme corp' },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ width: 480 }}>
      <SearchField {...args} />
    </div>
  ),
};
