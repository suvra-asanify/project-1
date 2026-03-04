import { computed, ref, watch } from 'vue';

export const TEXT_FIELD_VARIANTS = Object.freeze(['default', 'underlined']);
export const TEXT_FIELD_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

export const TEXT_FIELD_DEFAULT_PLACEHOLDER = '';
export const TEXT_FIELD_DEFAULT_INPUT = '';

function normalizeText(value, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

function normalizePositiveInteger(value, fallback = 1) {
  if (Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return fallback;
}

function toMdiClass(rawIcon) {
  const icon = normalizeText(rawIcon).trim();
  if (!icon) {
    return '';
  }
  if (icon.startsWith('mdi mdi-')) {
    return icon;
  }
  if (icon.startsWith('mdi-')) {
    return `mdi ${icon}`;
  }
  return `mdi mdi-${icon}`;
}

function isFlagCdnUrl(icon) {
  return /^(?:https?:\/\/|\/\/)?(?:www\.)?flagcdn\.com\/.+/i.test(icon);
}

function isUrlLike(icon) {
  return /^(?:https?:\/\/|\/\/|\/|\.\/|\.\.\/|data:image\/|blob:)/i.test(icon);
}

function ensureHttpsUrl(icon) {
  if (/^http:\/\/(?:www\.)?flagcdn\.com\//i.test(icon)) {
    return icon.replace(/^http:\/\//i, 'https://');
  }
  if (/^https?:\/\//i.test(icon)) {
    return icon;
  }
  if (/^\/\//.test(icon)) {
    return `https:${icon}`;
  }
  if (/^(?:www\.)?flagcdn\.com\//i.test(icon)) {
    return `https://${icon}`;
  }
  return icon;
}

function toIconConfig(rawIcon) {
  const icon = normalizeText(rawIcon).trim();

  if (!icon) {
    return { type: 'none', className: '', src: '', alt: '' };
  }

  // Accept direct FlagCDN URLs.
  if (isFlagCdnUrl(icon)) {
    return { type: 'asset', className: '', src: ensureHttpsUrl(icon), alt: 'flag icon' };
  }

  // Accept shorthand format for flags:
  // - "flag:in" -> https://flagcdn.com/w20/in.png
  const flagMatch = icon.match(/^flag:([a-z]{2})$/i);
  if (flagMatch) {
    const shorthand = flagMatch[1].toLowerCase();
    return {
      type: 'asset',
      className: '',
      src: `https://flagcdn.com/w20/${shorthand}.png`,
      alt: `${shorthand.toUpperCase()} flag`,
    };
  }

  // Accept generic custom image URLs from backend.
  if (isUrlLike(icon)) {
    return { type: 'asset', className: '', src: ensureHttpsUrl(icon), alt: 'icon' };
  }

  // Fallback to MDI syntax.
  return { type: 'mdi', className: toMdiClass(icon), src: '', alt: '' };
}

export function useTextField(props, emit) {
  const internalValue = ref('');

  watch(() => props.modelValue, (value) => {
    internalValue.value = normalizeText(value, TEXT_FIELD_DEFAULT_INPUT);
  }, { immediate: true });

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

  const resolvedTotalChar = computed(() => (
    props.seeCharCount ? normalizePositiveInteger(props.totalChar, null) : null
  ));

  const showPrependInnerIcon = computed(() => prependIconConfig.value.type !== 'none');
  const showAppendInnerIcon = computed(() => appendIconConfig.value.type !== 'none');
  const showPrefix = computed(() => normalizedPrefix.value.trim().length > 0);
  const showSuffix = computed(() => normalizedSuffix.value.trim().length > 0);
  const showHint = computed(() => normalizedHint.value.trim().length > 0);
  const showCounter = computed(() => props.seeCharCount);

  const counterText = computed(() => {
    if (resolvedTotalChar.value) {
      return `${internalValue.value.length}/${resolvedTotalChar.value}`;
    }
    return `${internalValue.value.length}`;
  });

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
      emit('update:modelValue', clamped);
    },
  });

  const rootClasses = computed(() => [
    props.variant !== 'default' && props.variant,
    props.size !== 'default' && props.size,
    props.disabled && 'disabled',
  ].filter(Boolean));

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
    resolvedTotalChar,
    hintId,
    counterId,
    describedBy,
  };
}
