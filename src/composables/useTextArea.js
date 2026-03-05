import { computed, ref, watch } from 'vue';
import {
  normalizePositiveInteger,
  normalizeText,
} from '../shared/sharedHelpers';

export const TEXT_AREA_DEFAULT_PLACEHOLDER = 'Placeholder Enter Smthng';
export const TEXT_AREA_DEFAULT_INPUT = 'Lorem ipsum dolor sit amet consectetur.';
export const TEXT_AREA_DEFAULT_HINT = '';

function clampTextByLimit(value, maxlength) {
  if (!maxlength) {
    return value;
  }
  return value.slice(0, maxlength);
}

export function useTextArea(props, emit) {
  const internalValue = ref('');
  const resolvedMaxlength = computed(() => normalizePositiveInteger(props.maxlength, null));

  watch(() => props.modelValue, (value) => {
    const normalizedValue = normalizeText(value, TEXT_AREA_DEFAULT_INPUT);
    const clampedValue = clampTextByLimit(normalizedValue, resolvedMaxlength.value);
    internalValue.value = clampedValue;

    if (clampedValue !== normalizedValue) {
      emit('update:modelValue', clampedValue);
    }
  }, { immediate: true });

  watch(resolvedMaxlength, (nextLimit) => {
    const clampedValue = clampTextByLimit(internalValue.value, nextLimit);
    if (clampedValue !== internalValue.value) {
      internalValue.value = clampedValue;
      emit('update:modelValue', clampedValue);
    }
  });

  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, TEXT_AREA_DEFAULT_PLACEHOLDER)
  );

  const normalizedHint = computed(() => normalizeText(props.hint, TEXT_AREA_DEFAULT_HINT));
  const showHint = computed(() => normalizedHint.value.trim().length > 0);
  const showCounter = computed(() => resolvedMaxlength.value !== null);

  const counterText = computed(() => {
    if (resolvedMaxlength.value) {
      return `${internalValue.value.length}/${resolvedMaxlength.value}`;
    }
    return `${internalValue.value.length}`;
  });

  const inputValue = computed({
    get() {
      return internalValue.value;
    },
    set(nextValue) {
      const nextText = String(nextValue ?? '');
      const clamped = clampTextByLimit(nextText, resolvedMaxlength.value);
      internalValue.value = clamped;
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
    resolvedMaxlength,
    counterText,
    rootClasses,
  };
}
