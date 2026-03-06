import ProgressLinear from './ProgressLinear.vue';

export default {
  title: 'Components/ProgressLinear',
  component: ProgressLinear,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
};

export const Default = {
  args: { count: '1/5' },
};

export const HalfFilled = {
  args: { count: '3/5' },
};

export const Complete = {
  args: { count: '5/5' },
};

export const Rounded = {
  args: { count: '2/4', rounded: true },
};

export const WithLimits = {
  args: { count: '7/10', current: '7', limit: '10' },
};

export const Small = {
  args: { size: 'sm', count: '2/5' },
};

export const Large = {
  args: { size: 'lg', count: '2/5' },
};
