import DateTimePicker from './DateTimePicker.vue';

export default {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'underlined'] },
    type: { control: 'select', options: ['date', 'month', 'date-range', 'time', 'date-time'] },
  },
};

export const Date = {
  args: { type: 'date', value: '' },
};

export const DateWithValue = {
  args: { type: 'date', value: '2024-06-15' },
};

export const Month = {
  args: { type: 'month', value: '' },
};

export const Time = {
  args: { type: 'time', value: '' },
};

export const DateTime = {
  args: { type: 'date-time', value: { date: '', time: '' } },
};

export const DateRange = {
  args: { type: 'date-range', value: [] },
};

export const DateRangeWithValue = {
  args: { type: 'date-range', value: ['2024-06-01', '2024-06-15'] },
};

export const Underlined = {
  args: { type: 'date', variant: 'underlined', value: '' },
};

export const WithLeadingIcon = {
  args: { type: 'date', hasIcon: true, icon: 'mdi-calendar-star', value: '' },
};

export const WithHint = {
  args: { type: 'date', hint: 'Select a date from the calendar.', value: '' },
};

export const Disabled = {
  args: { type: 'date', value: '2024-06-15', disabled: true },
};
