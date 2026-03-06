import TextArea from './TextArea.vue';

export default {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
};

export const Default = {
  args: { placeholder: 'Enter text...', value: '' },
};

export const WithValue = {
  args: { value: 'This is some example text in the textarea.', placeholder: 'Enter text...' },
};

export const WithHint = {
  args: { placeholder: 'Add a description...', hint: 'Maximum 500 characters.', value: '' },
};

export const WithCounter = {
  args: { placeholder: 'Enter text...', value: '', maxlength: 200 },
};

export const AutoGrow = {
  args: { placeholder: 'Grows as you type...', value: '', autoGrow: true },
};

export const WithError = {
  args: { placeholder: 'Required field...', value: '', ariaInvalid: true },
};

export const Disabled = {
  args: { placeholder: 'Disabled...', value: 'Cannot edit this content.', disabled: true },
};
