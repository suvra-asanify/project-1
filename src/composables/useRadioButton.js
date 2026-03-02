import { computed } from 'vue';

export const RADIO_BUTTON_STATES = Object.freeze(['default', 'hover', 'pressed']);
export const RADIO_BUTTON_DEFAULT_LABEL = 'label';

export function useRadioButton(props) {
  // Backend-safe normalization: always treat label as trimmed string.
  const displayLabel = computed(() => (props.label == null ? '' : String(props.label).trim()));
  const isChecked = computed(() => props.value === true);
  const showLabel = computed(() => props.hasLabel && displayLabel.value.length > 0);

  // Default state is implicit (no "state-default" / "value-false" class noise).
  const rootClasses = computed(() => [
    props.state !== 'default' && `state-${props.state}`,
    isChecked.value && 'value-true',
    showLabel.value && 'has-label',
    props.disabled && 'disabled',
  ].filter(Boolean));

  const controlClasses = computed(() => [
    `radio-control--${props.state}`,
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
