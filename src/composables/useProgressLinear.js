import { computed } from 'vue';

export const PROGRESS_LINEAR_SIZES = Object.freeze(['default', 'large']);

// Local parser shared by linear + circular to avoid a separate utils file.
function normalizePercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  if (parsed < 0) return 0;
  if (parsed > 100) return 100;
  return parsed;
}

export function parseProgressValue(rawValue) {
  const value = String(rawValue == null ? '' : rawValue).trim();
  if (!value) return 0;

  if (/^full$/i.test(value)) return 100;

  const ratioMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    const numerator = Number(ratioMatch[1]);
    const denominator = Number(ratioMatch[2]);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return normalizePercent((numerator / denominator) * 100);
    }
  }

  const percentMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    return normalizePercent(Number(percentMatch[1]));
  }

  return normalizePercent(Number(value));
}

export function useProgressLinear(props) {
  const isLarge = computed(() => props.size === 'large');
  const rawValue = computed(() => String(props.value == null ? '' : props.value).trim());

  // Single backend value drives both determinate fill and label.
  const fillPercent = computed(() => parseProgressValue(rawValue.value));
  const displayLabel = rawValue;
  const currentValue = computed(() => String(props.current == null ? '' : props.current).trim());
  const limitValue = computed(() => String(props.limit == null ? '' : props.limit).trim());

  const showLabel = computed(() => isLarge.value && displayLabel.value.length > 0);
  // If backend sends current/limit value(s), show the limit row automatically.
  const showLimit = computed(() => (
    isLarge.value && (currentValue.value.length > 0 || limitValue.value.length > 0)
  ));

  const trackClasses = computed(() => [
    isLarge.value && 'progress-linear__track--large',
    props.rounded && 'progress-linear__track--rounded',
  ].filter(Boolean));

  // fill--partial applies only when rounded, so the right-side radius makes sense.
  const fillClasses = computed(() => [
    props.rounded && fillPercent.value < 100 && 'progress-linear__fill--partial',
    props.rounded && 'progress-linear__fill--rounded',
  ].filter(Boolean));

  // Public state class: emitted only when size is non-default (for consumer hooks).
  const rootClasses = computed(() => [
    props.size !== 'default' && `size-${props.size}`,
    props.rounded !== true && 'not-rounded',
    showLimit.value && 'show-limit',
  ].filter(Boolean));

  return {
    fillPercent,
    displayLabel,
    showLabel,
    showLimit,
    rootClasses,
    trackClasses,
    fillClasses,
  };
}
