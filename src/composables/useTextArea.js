import { computed, ref, watch } from 'vue';

export const TEXT_AREA_STATES = Object.freeze(['default', 'hover', 'active']);

export const TEXT_AREA_DEFAULT_PLACEHOLDER = 'Placeholder Enter Smthng';
export const TEXT_AREA_DEFAULT_INPUT = 'Lorem ipsum dolor sit amet consectetur.';
export const TEXT_AREA_DEFAULT_HINT = 'suffix';

function normalizeText(value, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

function normalizeNonNegativeInteger(value, fallback = 0) {
  if (Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  return fallback;
}

function normalizePositiveInteger(value, fallback = 1) {
  if (Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return fallback;
}

export function useTextArea(props, emit) {
  const internalValue = ref('');

  watch(() => props.input, (value) => {
    internalValue.value = normalizeText(value, TEXT_AREA_DEFAULT_INPUT);
  }, { immediate: true });

  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, TEXT_AREA_DEFAULT_PLACEHOLDER)
  );

  const normalizedHint = computed(() => normalizeText(props.hint, TEXT_AREA_DEFAULT_HINT));
  const showHint = computed(() => props.hasHint && normalizedHint.value.trim().length > 0);

  const resolvedTotalChar = computed(() => (
    props.seeCharCount ? normalizePositiveInteger(props.totalChar, 600) : null
  ));

  const inputValue = computed({
    get() {
      return internalValue.value;
    },
    set(nextValue) {
      const nextText = String(nextValue ?? '');
      const clamped = resolvedTotalChar.value
        ? nextText.slice(0, resolvedTotalChar.value)
        : nextText;
      internalValue.value = clamped;
      emit('update:input', clamped);
    },
  });

  const effectiveCharCount = computed(() => {
    if (!props.seeCharCount) {
      return 0;
    }

    const providedCount = normalizeNonNegativeInteger(props.charCount, -1);
    if (providedCount >= 0) {
      return resolvedTotalChar.value
        ? Math.min(providedCount, resolvedTotalChar.value)
        : providedCount;
    }
    return internalValue.value.length;
  });

  const counterText = computed(() => {
    if (!props.seeCharCount) {
      return '';
    }
    if (resolvedTotalChar.value) {
      return `${effectiveCharCount.value}/${resolvedTotalChar.value}`;
    }
    return `${effectiveCharCount.value}`;
  });

  const rootClasses = computed(() => [
    `state-${props.state}`,
    props.disabled && 'disabled',
  ].filter(Boolean));

  return {
    inputValue,
    normalizedPlaceholder,
    normalizedHint,
    showHint,
    counterText,
    rootClasses,
  };
}
