import Chip from './Chip.vue';

export default {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'tonal'] },
    color: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'neutral', 'pink', 'purple', 'indigo', 'teal'],
    },
    size: { control: 'select', options: ['default', 'small', 'large'] },
  },
};

export const Default = {
  args: { label: 'Chip Label' },
};

export const Tonal = {
  args: { label: 'Tonal Chip', variant: 'tonal' },
};

export const Success = {
  args: { label: 'Success', color: 'success' },
};

export const Warning = {
  args: { label: 'Warning', color: 'warning' },
};

export const Error = {
  args: { label: 'Error', color: 'error' },
};

export const Small = {
  args: { label: 'Small', size: 'small' },
};

export const Large = {
  args: { label: 'Large', size: 'large' },
};

export const Closable = {
  args: { label: 'Closable', closable: true },
};

export const Rounded = {
  args: { label: 'Rounded', rounded: true },
};

export const WithIcon = {
  args: { label: 'With Icon', prependIcon: 'mdi-check-circle' },
};

export const Disabled = {
  args: { label: 'Disabled', disabled: true },
};
