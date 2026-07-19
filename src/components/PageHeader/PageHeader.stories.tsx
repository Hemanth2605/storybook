import type { Meta, StoryObj } from '@storybook/react-vite';
import AddIcon from '@mui/icons-material/Add';
import { AppButton } from '../AppButton/AppButton';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    title: 'Customers',
    subtitle: 'Manage your customer accounts and subscriptions.',
  },
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

export const WithBreadcrumbsAndActions: Story = {
  args: {
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Workspace', href: '#' },
      { label: 'Customers' },
    ],
    actions: <AppButton startIcon={<AddIcon />}>New customer</AppButton>,
  },
};
