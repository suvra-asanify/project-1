import List from './List.vue';

export default {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
};

const items = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'People', value: 'people' },
  { label: 'Payroll', value: 'payroll' },
  { label: 'Leave', value: 'leave' },
  { label: 'Expenses', value: 'expenses' },
];

export const Default = {
  args: { items, value: null },
};

export const WithSelection = {
  args: { items, value: 'people' },
};

export const Scrollable = {
  args: {
    items: [
      ...items,
      { label: 'Settings', value: 'settings' },
      { label: 'Reports', value: 'reports' },
      { label: 'Integrations', value: 'integrations' },
    ],
    value: null,
    maxHeight: 200,
  },
};
