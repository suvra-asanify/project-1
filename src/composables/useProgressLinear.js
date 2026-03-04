import { computed } from 'vue';

export const PROGRESS_LINEAR_SIZES = Object.freeze(['default', 'large']);
export const PROGRESS_LINEAR_RANGES = Object.freeze(['1/5', '2/5', '3/5', '4/5', '5/5']);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseRangeStep(rawRange) {
  const text = String(rawRange == null ? '' : rawRange).trim();
  const match = text.match(/^([1-5])\s*\/\s*5$/);
  if (!match) return null;
  return Number(match[1]);
}

function parsePercentFromValue(rawValue) {
  const value = String(rawValue == null ? '' : rawValue).trim();
  if (!value) return null;

  const ratioMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    const numerator = Number(ratioMatch[1]);
    const denominator = Number(ratioMatch[2]);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return clamp((numerator / denominator) * 100, 0, 100);
    }
    return null;
  }

  const percentMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    return clamp(Number(percentMatch[1]), 0, 100);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return clamp(parsed, 0, 100);
}

export function useProgressLinear(props) {
  const isLarge = computed(() => props.size === 'large');

  const rangeStep = computed(() => {
    const directStep = parseRangeStep(props.range);
    if (directStep != null) return directStep;

    // Backward compatibility for previous `value` prop.
    const fallbackPercent = parsePercentFromValue(props.value);
    if (fallbackPercent == null) return 1;

    const stepped = clamp(Math.round(fallbackPercent / 20), 1, 5);
    return stepped;
  });

  const normalizedRange = computed(() => `${rangeStep.value}/5`);
  const fillPercent = computed(() => rangeStep.value * 20);
  const trackHeight = computed(() => (isLarge.value ? 20 : 10));
  const applyRounded = computed(() => isLarge.value && props.rounded === true);

  const currentValue = computed(() => String(props.current == null ? '' : props.current).trim());
  const limitValue = computed(() => String(props.limit == null ? '' : props.limit).trim());

  const countText = computed(() => {
    if (props.count == null || String(props.count).trim().length === 0) {
      return String(fillPercent.value);
    }
    return String(props.count);
  });

  const showLabel = computed(() => isLarge.value);
  const showPercentage = computed(() => isLarge.value && props.percentage === true);
  const showLimit = computed(() => isLarge.value && props.currentLimit === true);

  const rootClasses = computed(() => [
    props.size !== 'default' && `size-${props.size}`,
    applyRounded.value && 'rounded',
    showLimit.value && 'show-limit',
  ].filter(Boolean));

  const fillClasses = computed(() => [
    applyRounded.value && fillPercent.value < 100 && 'progress-linear__fill--partial',
    applyRounded.value && fillPercent.value >= 100 && 'progress-linear__fill--rounded',
  ].filter(Boolean));

  return {
    normalizedRange,
    fillPercent,
    trackHeight,
    applyRounded,
    countText,
    showLabel,
    showPercentage,
    showLimit,
    currentValue,
    limitValue,
    rootClasses,
    fillClasses,
  };
}
