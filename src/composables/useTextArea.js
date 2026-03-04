import { computed, ref, watch } from 'vue';
import {
  normalizePositiveInteger,
  normalizeText,
} from '../shared/sharedHelpers';

export const TEXT_AREA_DEFAULT_PLACEHOLDER = 'Placeholder Enter Smthng';
export const TEXT_AREA_DEFAULT_INPUT = 'Lorem ipsum dolor sit amet consectetur.';
export const TEXT_AREA_DEFAULT_HINT = '';

function clampTextByLimit(value, charLimit) {
  if (!charLimit) {
    return value;
  }
  return value.slice(0, charLimit);
}

export function useTextArea(props, emit) {
  const internalValue = ref('');
  const resolvedCharLimit = computed(() => normalizePositiveInteger(props.charLimit, null));

  watch(() => (
    typeof props.modelValue === 'string' ? props.modelValue : props.input
  ), (value) => {
    const normalizedValue = normalizeText(value, TEXT_AREA_DEFAULT_INPUT);
    const clampedValue = clampTextByLimit(normalizedValue, resolvedCharLimit.value);
    internalValue.value = clampedValue;

    if (clampedValue !== normalizedValue) {
      emit('update:input', clampedValue);
      emit('update:modelValue', clampedValue);
    }
  }, { immediate: true });

  watch(resolvedCharLimit, (nextLimit) => {
    const clampedValue = clampTextByLimit(internalValue.value, nextLimit);
    if (clampedValue !== internalValue.value) {
      internalValue.value = clampedValue;
      emit('update:input', clampedValue);
      emit('update:modelValue', clampedValue);
    }
  });

  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, TEXT_AREA_DEFAULT_PLACEHOLDER)
  );

  const normalizedHint = computed(() => normalizeText(props.hint, TEXT_AREA_DEFAULT_HINT));
  const showHint = computed(() => normalizedHint.value.trim().length > 0);
  const showCounter = computed(() => resolvedCharLimit.value !== null);

  const counterText = computed(() => {
    if (resolvedCharLimit.value) {
      return `${internalValue.value.length}/${resolvedCharLimit.value}`;
    }
    return `${internalValue.value.length}`;
  });

  const inputValue = computed({
    get() {
      return internalValue.value;
    },
    set(nextValue) {
      const nextText = String(nextValue ?? '');
      const clamped = clampTextByLimit(nextText, resolvedCharLimit.value);
      internalValue.value = clamped;
      emit('update:input', clamped);
      emit('update:modelValue', clamped);
    },
  });

  const rootClasses = computed(() => [
    props.autoGrow && 'auto-grow',
    props.disabled && 'disabled',
  ].filter(Boolean));

  return {
    inputValue,
    normalizedPlaceholder,
    normalizedHint,
    showHint,
    showCounter,
    resolvedCharLimit,
    counterText,
    rootClasses,
  };
}
