import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@mui/material/Button';
import { AlertBanner } from './AlertBanner';

const meta: Meta<typeof AlertBanner> = {
  title: 'Components/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  args: {
    severity: 'info',
    title: 'Heads up',
    children: 'Your trial ends in 5 days.',
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof AlertBanner>;

export const Info: Story = {};

export const Dismissible: Story = {
  args: { dismissible: true, severity: 'warning', title: 'Storage almost full' },
};

export const WithAction: Story = {
  args: {
    severity: 'error',
    title: 'Payment failed',
    children: 'We could not process your last payment.',
    action: (
      <Button color="inherit" size="small">
        Retry
      </Button>
    ),
  },
};
