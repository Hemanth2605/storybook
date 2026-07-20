import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    label: 'Notifications',
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

/** Off by default — reads "Off". Click the toggle and the text flips to "On". */
export const Default: Story = {};

export const StartsOn: Story = {
  args: { label: 'Auto-save', defaultChecked: true },
};

export const CustomText: Story = {
  args: {
    label: 'Availability',
    onText: 'Available',
    offText: 'Away',
  },
};

export const Small: Story = {
  args: { label: 'Compact toggle', size: 'small' },
};

export const Disabled: Story = {
  args: { label: 'Locked setting', disabled: true, defaultChecked: true },
};

export const Error: Story = {
  args: {
    label: 'Accept the terms',
    error: true,
    helperText: 'You must turn this on to continue.',
  },
};

export const Loading: Story = {
  args: { label: 'Loading your setting…', loading: true },
};

/** Controlled usage: state is owned by the parent and driven by onChange. */
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(false);
    return (
      <Switch
        {...args}
        label="Controlled switch"
        checked={checked}
        onChange={setChecked}
        helperText={`Current state: ${checked ? 'on' : 'off'}`}
      />
    );
  },
};
