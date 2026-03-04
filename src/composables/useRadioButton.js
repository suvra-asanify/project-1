import { computed } from 'vue';

export const RADIO_BUTTON_DEFAULT_LABEL = '';

export function useRadioButton(props) {
  const displayLabel = computed(() => (props.label == null ? '' : String(props.label).trim()));
  const isChecked = computed(() => {
    if (typeof props.modelValue === 'boolean') {
      return props.modelValue;
    }
    return props.value === true;
  });
  const showLabel = computed(() => displayLabel.value.length > 0);

  const rootClasses = computed(() => [
    isChecked.value && 'checked',
    showLabel.value && 'has-label',
    props.disabled && 'disabled',
  ].filter(Boolean));

  const controlClasses = computed(() => [
    isChecked.value && 'radio-control--checked',
    props.disabled && 'radio-control--disabled',
  ].filter(Boolean));

  return {
    displayLabel,
    isChecked,
    showLabel,
    rootClasses,
    controlClasses,
  };
}
