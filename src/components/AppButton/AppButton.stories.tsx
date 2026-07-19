import type { Meta, StoryObj } from '@storybook/react-vite';
import SaveIcon from '@mui/icons-material/Save';
import { AppButton } from './AppButton';

const meta: Meta<typeof AppButton> = {
  title: 'Components/AppButton',
  component: AppButton,
  tags: ['autodocs'],
  args: { children: 'Save changes' },
  argTypes: {
    variant: { control: 'select', options: ['contained', 'outlined', 'text'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof AppButton>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { startIcon: <SaveIcon /> },
};

export const Loading: Story = {
  args: { loading: true, loadingText: 'Saving…' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};
