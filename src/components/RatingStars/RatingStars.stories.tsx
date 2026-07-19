import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RatingStars } from './RatingStars';

const meta: Meta<typeof RatingStars> = {
  title: 'Components/RatingStars',
  component: RatingStars,
  tags: ['autodocs'],
  args: {
    label: 'How would you rate this?',
    defaultValue: 3,
  },
};
export default meta;

type Story = StoryObj<typeof RatingStars>;

export const Default: Story = {};

export const HalfStars: Story = {
  args: { label: 'Precision rating', defaultValue: 3.5, showValue: true },
};

export const Empty: Story = {
  args: { label: 'Not rated yet', defaultValue: 0, showValue: true },
};

export const ReadOnly: Story = {
  args: { label: 'Average score', value: 4.5, readOnly: true, showValue: true },
};

export const Disabled: Story = {
  args: { label: 'Rating (locked)', defaultValue: 2, disabled: true },
};

export const Error: Story = {
  args: {
    label: 'Rate before submitting',
    defaultValue: 0,
    error: true,
    helperText: 'A rating is required.',
  },
};

export const Loading: Story = {
  args: { label: 'Loading your rating…', loading: true },
};

export const Large: Story = {
  args: { label: 'Big stars', size: 'large', defaultValue: 4, showValue: true },
};

/** Controlled usage: value is owned by the parent and driven by onChange. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | null>(2.5);
    return (
      <RatingStars
        {...args}
        label="Controlled rating"
        value={value}
        onChange={setValue}
        showValue
        helperText={value ? `You selected ${value} stars.` : 'Pick a rating.'}
      />
    );
  },
};
