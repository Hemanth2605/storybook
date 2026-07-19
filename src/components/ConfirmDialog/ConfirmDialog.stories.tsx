import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@mui/material/Button';
import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

const Interactive = (args: Partial<React.ComponentProps<typeof ConfirmDialog>>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <ConfirmDialog
        title="Delete project?"
        description="This permanently removes the project and all of its data. This action cannot be undone."
        destructive
        confirmText="Delete"
        {...args}
        open={open}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export const Destructive: Story = {
  render: (args) => <Interactive {...args} />,
};

export const Neutral: Story = {
  render: (args) => (
    <Interactive
      {...args}
      title="Publish changes?"
      description="Your changes will go live immediately."
      destructive={false}
      confirmText="Publish"
    />
  ),
};
