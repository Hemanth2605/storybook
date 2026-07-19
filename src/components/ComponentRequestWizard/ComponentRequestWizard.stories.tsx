import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentRequestWizard } from './ComponentRequestWizard';

/**
 * Submitting POSTs to the backend (see the `server/` folder). Storybook has no
 * dev proxy, so the story targets the server's absolute URL directly (the
 * server enables CORS). Start it first: `cd server && npm run dev`. Without the
 * server running, the review step shows a "Could not send" error, as expected.
 */
const meta: Meta<typeof ComponentRequestWizard> = {
  title: 'Components/ComponentRequestWizard',
  component: ComponentRequestWizard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    apiUrl: 'http://localhost:4000/api/request',
    recipientEmail: 'hemanth.mareedu8@gmail.com',
    onSubmit: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof ComponentRequestWizard>;

export const Default: Story = {};

export const CustomRecipient: Story = {
  args: { recipientEmail: 'design-system@acme.com' },
};
