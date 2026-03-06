import TextField from './TextField.vue';

export default {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'underlined'] },
    size: { control: 'select', options: ['default', 'small', 'large'] },
  },
};

export const Default = {
  args: { placeholder: 'Enter text...', value: '' },
};

export const WithValue = {
  args: { value: 'Hello World', placeholder: 'Enter text...' },
};

export const Underlined = {
  args: { variant: 'underlined', placeholder: 'Enter text...', value: '' },
};

export const Small = {
  args: { size: 'small', placeholder: 'Small...', value: '' },
};

export const Large = {
  args: { size: 'large', placeholder: 'Large...', value: '' },
};

export const WithHint = {
  args: { placeholder: 'Enter email...', hint: 'We will never share your email.', value: '' },
};

export const WithPrependIcon = {
  args: { prependIcon: 'mdi-magnify', placeholder: 'Search...', value: '' },
};

export const WithAppendIcon = {
  args: { appendIcon: 'mdi-eye', placeholder: 'Password...', value: '' },
};

export const WithCounter = {
  args: { placeholder: 'Enter text...', value: '', maxlength: 100 },
};

export const WithError = {
  args: { placeholder: 'Enter text...', value: '', ariaInvalid: true },
};

export const Disabled = {
  args: { placeholder: 'Disabled...', value: 'Cannot edit', disabled: true },
};
