import { computed, ref, watch } from 'vue';
import {
  normalizePositiveInteger,
  normalizeText,
  toIconConfig,
} from '../shared/sharedHelpers';

export const TEXT_FIELD_VARIANTS = Object.freeze(['default', 'underlined']);
export const TEXT_FIELD_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

export const TEXT_FIELD_DEFAULT_PLACEHOLDER = '';
export const TEXT_FIELD_DEFAULT_INPUT = '';

function clampTextByLimit(value, maxlength) {
  if (!maxlength) {
    return value;
  }
  return value.slice(0, maxlength);
}

export function useTextField(props, emit) {
  const internalValue = ref('');
  const resolvedMaxlength = computed(() => normalizePositiveInteger(props.maxlength, null));

  watch(() => props.modelValue, (value) => {
    const normalizedValue = normalizeText(value, TEXT_FIELD_DEFAULT_INPUT);
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
    normalizeText(props.placeholder, TEXT_FIELD_DEFAULT_PLACEHOLDER)
  );
  const normalizedPrefix = computed(() => normalizeText(props.prefix));
  const normalizedSuffix = computed(() => normalizeText(props.suffix));
  const normalizedHint = computed(() => normalizeText(props.hint));
  const prependIconConfig = computed(() => toIconConfig(props.prependIcon));
  const appendIconConfig = computed(() => toIconConfig(props.appendIcon));

  const showPrependIcon = computed(() => prependIconConfig.value.type !== 'none');
  const showAppendIcon = computed(() => appendIconConfig.value.type !== 'none');
  const showPrefix = computed(() => normalizedPrefix.value.trim().length > 0);
  const showSuffix = computed(() => normalizedSuffix.value.trim().length > 0);
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
    props.variant !== 'default' && props.variant,
    props.size !== 'default' && props.size,
    props.disabled && 'disabled',
  ].filter(Boolean));

  const vuetifyVariant = computed(() => (
    props.variant === 'underlined' ? 'underlined' : 'filled'
  ));

  const vuetifyDensity = computed(() => {
    if (props.size === 'small') return 'compact';
    if (props.size === 'large') return 'default';
    return 'comfortable';
  });

  const hintId = computed(() => (
    props.id && showHint.value ? `${props.id}-hint` : null
  ));
  const counterId = computed(() => (
    props.id && showCounter.value ? `${props.id}-counter` : null
  ));
  const describedBy = computed(() => (
    [hintId.value, counterId.value].filter(Boolean).join(' ') || null
  ));

  return {
    inputValue,
    normalizedPlaceholder,
    normalizedPrefix,
    normalizedSuffix,
    normalizedHint,
    prependIconConfig,
    appendIconConfig,
    showPrependIcon,
    showAppendIcon,
    showPrefix,
    showSuffix,
    showHint,
    showCounter,
    counterText,
    rootClasses,
    vuetifyVariant,
    vuetifyDensity,
    resolvedMaxlength,
    hintId,
    counterId,
    describedBy,
  };
}
