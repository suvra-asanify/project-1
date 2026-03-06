import RadioButton from './RadioButton.vue';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
};

export const Unchecked = {
  args: { label: 'Option A', value: false },
};

export const Checked = {
  args: { label: 'Option A', value: true },
};

export const WithoutLabel = {
  args: { label: '', value: false },
};

export const Disabled = {
  args: { label: 'Disabled option', value: false, disabled: true },
};

export const DisabledChecked = {
  args: { label: 'Disabled checked', value: true, disabled: true },
};
