import { computed } from 'vue';
import { parseProgressValue } from './useProgressLinear';

export const PROGRESS_CIRCULAR_SIZES = Object.freeze(['default', 'small', 'large']);
const PROGRESS_CIRCULAR_DEFAULTS = Object.freeze({ size: 'default' });

export function useProgressCircular(props) {
  const rawValue = computed(() => String(props.value == null ? '' : props.value).trim());
  const fillPercent = computed(() => parseProgressValue(rawValue.value));
  const displayLabel = rawValue;

  const rootClasses = computed(() => [
    props.size !== PROGRESS_CIRCULAR_DEFAULTS.size && `size-${props.size}`,
  ].filter(Boolean));

  const rootStyles = computed(() => ({
    '--progress-circular-fill': fillPercent.value,
  }));

  return {
    displayLabel,
    rootClasses,
    rootStyles,
  };
}
