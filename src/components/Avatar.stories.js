import Avatar from './Avatar.vue';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'img'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
};

export const Default = {
  args: { label: 'JD' },
};

export const Small = {
  args: { label: 'JD', size: 'sm' },
};

export const Large = {
  args: { label: 'JD', size: 'lg' },
};

export const Square = {
  args: { label: 'JD', rounded: false },
};

export const WithCount = {
  args: { label: 'JD', count: 3 },
};

export const WithImage = {
  args: {
    variant: 'img',
    image: 'https://i.pravatar.cc/150?img=3',
  },
};
