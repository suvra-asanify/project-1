import ComboBox from './ComboBox.vue';

export default {
  title: 'Components/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'underlined'] },
  },
};

const sampleItems = [
  { title: 'Apple', value: 'apple' },
  { title: 'Banana', value: 'banana' },
  { title: 'Cherry', value: 'cherry' },
  { title: 'Date', value: 'date' },
  { title: 'Elderberry', value: 'elderberry' },
];

export const Default = {
  args: {
    placeholder: 'Select an option...',
    items: sampleItems,
    value: null,
  },
};

export const WithSelection = {
  args: {
    placeholder: 'Select an option...',
    items: sampleItems,
    value: 'banana',
  },
};

export const Underlined = {
  args: {
    variant: 'underlined',
    placeholder: 'Select an option...',
    items: sampleItems,
    value: null,
  },
};

export const MultiSelect = {
  args: {
    placeholder: 'Select options...',
    items: sampleItems,
    multiple: true,
    value: ['apple', 'cherry'],
  },
};

export const WithHint = {
  args: {
    placeholder: 'Select a fruit...',
    items: sampleItems,
    hint: 'Choose your favourite fruit.',
    value: null,
  },
};

export const WithIcon = {
  args: {
    placeholder: 'Select an option...',
    items: sampleItems,
    icon: 'mdi-fruit-cherries',
    value: null,
  },
};

export const Disabled = {
  args: {
    placeholder: 'Disabled...',
    items: sampleItems,
    value: 'apple',
    disabled: true,
  },
};
