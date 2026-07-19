import type { Meta, StoryObj } from '@storybook/react-vite';
import PeopleIcon from '@mui/icons-material/People';
import { StatCard } from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: {
    title: 'Active users',
    value: '12,480',
    changePercent: 12.5,
    changeLabel: 'vs last month',
  },
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { icon: <PeopleIcon /> },
};

export const NegativeTrend: Story = {
  args: { title: 'Churn rate', value: '3.2%', changePercent: -1.8 },
};

export const NoTrend: Story = {
  args: { title: 'Total orders', value: '1,024', changePercent: undefined },
};
