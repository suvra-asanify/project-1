import ProgressCircular from './ProgressCircular.vue';

export default {
  title: 'Components/ProgressCircular',
  component: ProgressCircular,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
};

export const Default = {
  args: { value: '1/4' },
};

export const Half = {
  args: { value: '1/2' },
};

export const ThreeQuarters = {
  args: { value: '3/4' },
};

export const Complete = {
  args: { value: '4/4' },
};

export const WithLabel = {
  args: { value: '2/5', label: '40%' },
};

export const Small = {
  args: { size: 'sm', value: '1/3' },
};

export const Large = {
  args: { size: 'lg', value: '2/3' },
};
