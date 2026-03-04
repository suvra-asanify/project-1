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

function clampTextByLimit(value, charLimit) {
  if (!charLimit) {
    return value;
  }
  return value.slice(0, charLimit);
}

export function useTextField(props, emit) {
  const internalValue = ref('');
  const resolvedCharLimit = computed(() => normalizePositiveInteger(props.charLimit, null));

  watch(() => props.modelValue, (value) => {
    const normalizedValue = normalizeText(value, TEXT_FIELD_DEFAULT_INPUT);
    const clampedValue = clampTextByLimit(normalizedValue, resolvedCharLimit.value);
    internalValue.value = clampedValue;

    if (clampedValue !== normalizedValue) {
      emit('update:modelValue', clampedValue);
    }
  }, { immediate: true });

  watch(resolvedCharLimit, (nextLimit) => {
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
  const resolvedPrependIcon = computed(() => props.prependInnerIcon || props.prependIcon);
  const resolvedAppendIcon = computed(() => props.appendInnerIcon || props.appendIcon);

  const prependIconConfig = computed(() => toIconConfig(resolvedPrependIcon.value));
  const appendIconConfig = computed(() => toIconConfig(resolvedAppendIcon.value));

  const showPrependInnerIcon = computed(() => prependIconConfig.value.type !== 'none');
  const showAppendInnerIcon = computed(() => appendIconConfig.value.type !== 'none');
  const showPrefix = computed(() => normalizedPrefix.value.trim().length > 0);
  const showSuffix = computed(() => normalizedSuffix.value.trim().length > 0);
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
      emit('update:modelValue', clamped);
    },
  });

  const rootClasses = computed(() => [
    props.variant !== 'default' && props.variant,
    props.size !== 'default' && props.size,
    props.disabled && 'disabled',
  ].filter(Boolean));

  const vuetifyVariant = computed(() => (
    props.variant === 'underlined' ? 'underlined' : 'outlined'
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
    showPrependInnerIcon,
    showAppendInnerIcon,
    showPrefix,
    showSuffix,
    showHint,
    showCounter,
    counterText,
    rootClasses,
    vuetifyVariant,
    vuetifyDensity,
    resolvedCharLimit,
    hintId,
    counterId,
    describedBy,
  };
}
