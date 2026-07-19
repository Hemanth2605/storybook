import type { Meta, StoryObj } from '@storybook/react-vite';
import AddIcon from '@mui/icons-material/Add';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { AppButton } from '../AppButton/AppButton';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No projects yet',
    description: 'Create your first project to start collaborating with your team.',
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <AppButton startIcon={<AddIcon />}>New project</AppButton>,
  },
};

export const NoResults: Story = {
  args: {
    icon: <SearchOffIcon fontSize="large" />,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
};
