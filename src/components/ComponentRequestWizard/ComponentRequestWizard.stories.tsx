import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentRequestWizard } from './ComponentRequestWizard';

const meta: Meta<typeof ComponentRequestWizard> = {
  title: 'Components/ComponentRequestWizard',
  component: ComponentRequestWizard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    recipientEmail: 'hemanth.mareedu8@gmail.com',
    onSubmit: fn(),
    // Keep the mail client from opening inside Storybook.
    openMailClient: false,
  },
};
export default meta;

type Story = StoryObj<typeof ComponentRequestWizard>;

export const Default: Story = {};

export const CustomRecipient: Story = {
  args: { recipientEmail: 'design-system@acme.com' },
};
