import { computed, ref, watch } from 'vue';

export const TEXT_FIELD_VARIANTS = Object.freeze(['default', 'underlined']);
export const TEXT_FIELD_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

export const TEXT_FIELD_DEFAULT_PLACEHOLDER = 'Placeholder Enter Smthng';
export const TEXT_FIELD_DEFAULT_INPUT = 'Input Text';

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

function isCountryCode(icon) {
  return /^[a-z]{2}$/i.test(icon);
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
    return { type: 'flag', className: '', src: ensureHttpsUrl(icon), alt: 'flag icon' };
  }

  // Accept shorthand formats for flags:
  // - "in" -> https://flagcdn.com/in.svg
  // - "flag:in" -> https://flagcdn.com/in.svg
  const shorthand = icon.toLowerCase().replace(/^flag:/, '');
  if (isCountryCode(shorthand)) {
    return {
      type: 'flag',
      className: '',
      src: `https://flagcdn.com/w20/${shorthand}.png`,
      alt: `${shorthand.toUpperCase()} flag`,
    };
  }

  // Accept generic custom image URLs from backend.
  if (isUrlLike(icon)) {
    return { type: 'image', className: '', src: ensureHttpsUrl(icon), alt: 'icon' };
  }

  // Fallback to MDI syntax.
  return { type: 'mdi', className: toMdiClass(icon), src: '', alt: '' };
}

export function useTextField(props, emit) {
  const internalValue = ref(normalizeText(props.modelValue, TEXT_FIELD_DEFAULT_INPUT));
  const isHovered = ref(false);
  const isFocused = ref(false);

  watch(() => props.modelValue, (value) => {
    internalValue.value = normalizeText(value, TEXT_FIELD_DEFAULT_INPUT);
  });

  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, TEXT_FIELD_DEFAULT_PLACEHOLDER)
  );
  const normalizedPrefix = computed(() => normalizeText(props.prefix));
  const normalizedSuffix = computed(() => normalizeText(props.suffix));
  const normalizedHint = computed(() => normalizeText(props.hint));
  const resolvedPrependIcon = computed(() =>
    normalizeText(props.prependInnerIcon).trim() || normalizeText(props.prependIcon).trim()
  );
  const resolvedAppendIcon = computed(() =>
    normalizeText(props.appendInnerIcon).trim() || normalizeText(props.appendIcon).trim()
  );

  const prependIconConfig = computed(() => toIconConfig(resolvedPrependIcon.value));
  const appendIconConfig = computed(() => toIconConfig(resolvedAppendIcon.value));

  const normalizedTotalChar = computed(() => (
    props.seeCharCount
      ? normalizePositiveInteger(props.totalChar, null)
      : null
  ));

  const effectiveCharCount = computed(() => internalValue.value.length);

  const showPrependInnerIcon = computed(() => prependIconConfig.value.type !== 'none');
  const showAppendInnerIcon = computed(() => appendIconConfig.value.type !== 'none');
  const showPrefix = computed(() => normalizedPrefix.value.trim().length > 0);
  const showSuffix = computed(() => normalizedSuffix.value.trim().length > 0);
  const showHint = computed(() => normalizedHint.value.trim().length > 0);
  const showCounter = computed(() => props.seeCharCount);

  const counterText = computed(() => {
    if (normalizedTotalChar.value) {
      return `${effectiveCharCount.value}/${normalizedTotalChar.value}`;
    }
    return `${effectiveCharCount.value}`;
  });

  function onInput(event) {
    const nextValue = String(event?.target?.value ?? '');
    const clamped = normalizedTotalChar.value
      ? nextValue.slice(0, normalizedTotalChar.value)
      : nextValue;
    internalValue.value = clamped;
    emit('update:modelValue', clamped);
    emit('input', clamped);
  }

  function onMouseEnter() {
    if (props.disabled) {
      return;
    }
    isHovered.value = true;
  }

  function onMouseLeave() {
    isHovered.value = false;
  }

  function onFocusIn() {
    if (props.disabled) {
      return;
    }
    isFocused.value = true;
  }

  function onFocusOut() {
    isFocused.value = false;
  }

  const effectiveState = computed(() => {
    if (props.disabled) {
      return 'default';
    }
    if (isFocused.value) {
      return 'active';
    }
    if (isHovered.value) {
      return 'hover';
    }
    return 'default';
  });

  const rootClasses = computed(() => [
    props.variant !== 'default' && props.variant,
    props.size !== 'default' && props.size,
    props.disabled && 'disabled',
  ].filter(Boolean));

  const controlStyles = computed(() => {
    if (props.disabled) {
      return null;
    }
    if (effectiveState.value === 'active') {
      if (props.variant === 'underlined') {
        return {
          borderBottomColor: 'var(--primary, #005a9c)',
          borderBottomWidth: 'var(--border-md)',
          boxShadow: 'none',
        };
      }
      return {
        borderColor: 'var(--primary, #005a9c)',
        boxShadow: '0 0 0 var(--base-1) rgba(0, 90, 156, 0.24)',
      };
    }
    if (effectiveState.value === 'hover') {
      return {
        borderColor: 'rgba(0, 0, 0, 0.5)',
      };
    }
    return null;
  });

  return {
    internalValue,
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
    controlStyles,
    onInput,
    onMouseEnter,
    onMouseLeave,
    onFocusIn,
    onFocusOut,
  };
}
