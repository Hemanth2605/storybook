import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    label: 'Adjust the level',
    defaultValue: 40,
  },
};
export default meta;

type Story = StoryObj<typeof Slider>;

/** Hover (or focus, or drag) the circle to reveal the percentage on the thumb. */
export const Default: Story = {};

export const WithReadout: Story = {
  args: { label: 'Volume', defaultValue: 65, showValue: true },
};

export const WithMarks: Story = {
  args: { label: 'Quality', defaultValue: 50, step: 25, marks: true, showValue: true },
};

export const CustomRange: Story = {
  args: {
    label: 'Temperature (16–30 °C)',
    min: 16,
    max: 30,
    step: 1,
    defaultValue: 22,
    showValue: true,
    helperText: 'The thumb label still reads as a percentage of the range.',
  },
};

export const Small: Story = {
  args: { label: 'Compact', size: 'small', defaultValue: 30, showValue: true },
};

export const Empty: Story = {
  args: { label: 'Not set', defaultValue: 0, showValue: true },
};

export const Disabled: Story = {
  args: { label: 'Level (locked)', defaultValue: 55, disabled: true, showValue: true },
};

export const Error: Story = {
  args: {
    label: 'Set a threshold',
    defaultValue: 0,
    error: true,
    showValue: true,
    helperText: 'Please choose a value above zero.',
  },
};

export const Loading: Story = {
  args: { label: 'Loading your setting…', loading: true },
};

/** Override the on-thumb label — here it shows the raw value instead of a percent. */
export const CustomLabel: Story = {
  args: {
    label: 'Downloaded',
    defaultValue: 3,
    min: 0,
    max: 8,
    showValue: true,
    formatLabel: (value) => `${value} GB`,
  },
};

/** Controlled usage: value is owned by the parent and driven by onChange. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>(20);
    return (
      <Slider
        {...args}
        label="Controlled slider"
        value={value}
        onChange={setValue}
        showValue
        helperText={`Current value: ${value}`}
      />
    );
  },
};
