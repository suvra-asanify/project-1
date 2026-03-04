import { computed } from 'vue';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseProgressValue(rawValue) {
  const value = String(rawValue == null ? '' : rawValue).trim();
  if (!value) return 0;

  if (/^full$/i.test(value)) return 100;

  const ratioMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    const numerator = Number(ratioMatch[1]);
    const denominator = Number(ratioMatch[2]);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return clamp((numerator / denominator) * 100, 0, 100);
    }
    return 0;
  }

  const percentMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    return clamp(Number(percentMatch[1]), 0, 100);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return clamp(parsed, 0, 100);
}

export const PROGRESS_CIRCULAR_SIZES = Object.freeze(['default', 'small', 'large']);
const PROGRESS_CIRCULAR_DEFAULTS = Object.freeze({ size: 'default' });
const PROGRESS_CIRCULAR_SIZE_VALUES = Object.freeze({
  default: 54,
  small: 36,
  large: 80,
});

export function useProgressCircular(props) {
  const rawValue = computed(() => {
    const source = props.value ?? props.progress;
    return String(source == null ? '' : source).trim();
  });
  const normalizedLabel = computed(() => String(props.label == null ? '' : props.label).trim());

  const fillPercent = computed(() => parseProgressValue(rawValue.value));
  const displayLabel = computed(() => normalizedLabel.value || rawValue.value);

  const rootClasses = computed(() => [
    props.size !== PROGRESS_CIRCULAR_DEFAULTS.size && `size-${props.size}`,
  ].filter(Boolean));

  const vuetifySize = computed(() => PROGRESS_CIRCULAR_SIZE_VALUES[props.size] || PROGRESS_CIRCULAR_SIZE_VALUES.default);

  return {
    fillPercent,
    displayLabel,
    rootClasses,
    vuetifySize,
  };
}
