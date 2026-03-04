import { computed } from 'vue';

export const PROGRESS_LINEAR_SIZES = Object.freeze(['default', 'large']);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return `${Number(value)}`;
}

function parseProgressValue(rawValue) {
  const value = String(rawValue == null ? '' : rawValue).trim();
  if (!value) return null;

  const ratioMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    const numerator = Number(ratioMatch[1]);
    const denominator = Number(ratioMatch[2]);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0) {
      return {
        fillPercent: clamp((numerator / denominator) * 100, 0, 100),
        labelText: `${formatNumber(numerator)}/${formatNumber(denominator)}`,
        rangeText: `${formatNumber(numerator)}/${formatNumber(denominator)}`,
      };
    }
    return null;
  }

  const percentMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    const percentValue = Number(percentMatch[1]);
    if (!Number.isFinite(percentValue)) {
      return null;
    }
    const clampedPercent = clamp(percentValue, 0, 100);
    return {
      fillPercent: clampedPercent,
      labelText: `${formatNumber(clampedPercent)}%`,
      rangeText: `${formatNumber(clampedPercent)}/100`,
    };
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  const clampedPercent = clamp(parsed, 0, 100);
  return {
    fillPercent: clampedPercent,
    labelText: `${formatNumber(clampedPercent)}%`,
    rangeText: `${formatNumber(clampedPercent)}/100`,
  };
}

export function useProgressLinear(props) {
  const isLarge = computed(() => props.size === 'large');

  const parsedValue = computed(() => parseProgressValue(props.value));

  const fillPercent = computed(() => {
    if (!parsedValue.value) {
      return 0;
    }
    return parsedValue.value.fillPercent;
  });

  const normalizedRange = computed(() => (
    parsedValue.value ? parsedValue.value.rangeText : ''
  ));

  const labelText = computed(() => (
    parsedValue.value ? parsedValue.value.labelText : ''
  ));

  const trackHeight = computed(() => (isLarge.value ? 20 : 10));
  const applyRounded = computed(() => props.rounded === true);

  const currentValue = computed(() => String(props.current == null ? '' : props.current).trim());
  const limitValue = computed(() => String(props.limit == null ? '' : props.limit).trim());

  const showLabel = computed(() => isLarge.value && labelText.value.length > 0);
  const showLimit = computed(() => (
    isLarge.value && (currentValue.value.length > 0 || limitValue.value.length > 0)
  ));

  const rootClasses = computed(() => [
    props.size !== 'default' && `size-${props.size}`,
    applyRounded.value && 'rounded',
    showLimit.value && 'show-limit',
  ].filter(Boolean));

  return {
    normalizedRange,
    fillPercent,
    trackHeight,
    applyRounded,
    labelText,
    showLabel,
    showLimit,
    currentValue,
    limitValue,
    rootClasses,
  };
}
