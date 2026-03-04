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

function clampTextByLimit(value, charLimit) {
  if (!charLimit) {
    return value;
  }
  return value.slice(0, charLimit);
}

function toMdiClass(rawIcon) {
  const icon = toMdiIcon(rawIcon);
  if (!icon || icon.startsWith('$')) {
    return '';
  }
  return `mdi ${icon}`;
}

function toMdiIcon(rawIcon) {
  const icon = normalizeText(rawIcon).trim();
  if (!icon) {
    return '';
  }
  if (icon.startsWith('$')) {
    return icon;
  }

  const token = icon
    .split(/\s+/)
    .find((part) => /^mdi-[a-z0-9-]+$/i.test(part));
  if (token) {
    return token;
  }

  const normalized = icon
    .replace(/^mdi:/i, '')
    .replace(/^mdi-/i, '')
    .trim();

  if (!normalized || normalized.toLowerCase() === 'mdi') {
    return '';
  }

  return `mdi-${normalized}`;
}

function isFlagCdnUrl(icon) {
  return /^(?:https?:\/\/|\/\/)?(?:www\.)?flagcdn\.com\/.+/i.test(icon);
}

function isUrlLike(icon) {
  return /^(?:https?:\/\/|\/\/|\/|\.\/|\.\.\/|data:image\/|blob:)/i.test(icon);
}

function isImageFilePath(icon) {
  if (/\s/.test(icon)) {
    return false;
  }
  return /\.(?:svg|png|jpe?g|gif|webp|avif|bmp|ico)(?:[?#].*)?$/i.test(icon);
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
    return {
      type: 'none',
      assetType: '',
      className: '',
      icon: '',
      src: '',
      alt: '',
    };
  }

  // Accept direct FlagCDN URLs.
  if (isFlagCdnUrl(icon)) {
    return {
      type: 'asset',
      assetType: 'flag',
      className: '',
      icon: '',
      src: ensureHttpsUrl(icon),
      alt: 'flag icon',
    };
  }

  // Accept shorthand format for flags:
  // - "flag:in" -> https://flagcdn.com/w20/in.png
  const flagMatch = icon.match(/^flag:([a-z]{2})$/i);
  if (flagMatch) {
    const shorthand = flagMatch[1].toLowerCase();
    return {
      type: 'asset',
      assetType: 'flag',
      className: '',
      icon: '',
      src: `https://flagcdn.com/w20/${shorthand}.png`,
      alt: `${shorthand.toUpperCase()} flag`,
    };
  }

  // Accept generic custom image URLs from backend.
  if (isUrlLike(icon)) {
    return {
      type: 'asset',
      assetType: 'image',
      className: '',
      icon: '',
      src: ensureHttpsUrl(icon),
      alt: 'icon',
    };
  }

  // Accept plain image file names/paths from backend (e.g. "icon.svg", "assets/icon.png").
  if (isImageFilePath(icon)) {
    return {
      type: 'asset',
      assetType: 'image',
      className: '',
      icon: '',
      src: ensureHttpsUrl(icon),
      alt: 'icon',
    };
  }

  // Fallback to MDI syntax.
  return {
    type: 'mdi',
    assetType: '',
    className: toMdiClass(icon),
    icon: toMdiIcon(icon),
    src: '',
    alt: '',
  };
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
