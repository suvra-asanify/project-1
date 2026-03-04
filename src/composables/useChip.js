import { computed } from 'vue';

export const CHIP_VARIANTS = Object.freeze(['flat', 'tonal']);
export const CHIP_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);
export const CHIP_COLORS = Object.freeze([
  'default',
  'success',
  'warning',
  'error',
  'neutral',
  'pink',
  'purple',
  'deeppurple',
  'indigo',
  'lightblue',
  'cyan',
  'teal',
  'lightgreen',
  'lime',
  'yellow',
  'amber',
  'deeporange',
]);

export const CHIP_DEFAULT_LABEL = 'Button';
export const CHIP_DEFAULT_ICON = '';

function normalizeText(value, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

function normalizeColor(value) {
  const normalized = normalizeText(value, 'default').trim().toLowerCase();
  if (CHIP_COLORS.includes(normalized)) {
    return normalized;
  }
  return 'default';
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

  if (isUrlLike(icon) || isImageFilePath(icon)) {
    return {
      type: 'asset',
      assetType: 'image',
      className: '',
      icon: '',
      src: ensureHttpsUrl(icon),
      alt: 'icon',
    };
  }

  return {
    type: 'mdi',
    assetType: '',
    className: toMdiClass(icon),
    icon: toMdiIcon(icon),
    src: '',
    alt: '',
  };
}

export function useChip(props) {
  const normalizedLabel = computed(() => normalizeText(props.label, CHIP_DEFAULT_LABEL).trim());
  const normalizedColor = computed(() => normalizeColor(props.color));

  const prependIconConfig = computed(() => {
    const source = normalizeText(props.prependIcon).trim() || CHIP_DEFAULT_ICON;
    return toIconConfig(source);
  });
  const appendIconConfig = computed(() => {
    const source = normalizeText(props.appendIcon).trim() || CHIP_DEFAULT_ICON;
    return toIconConfig(source);
  });

  const showLabel = computed(() => normalizedLabel.value.length > 0);
  const showPrependIcon = computed(() => prependIconConfig.value.type !== 'none');
  const showAppendIcon = computed(() => (
    props.closable !== true && appendIconConfig.value.type !== 'none'
  ));
  const isIconOnly = computed(() => (
    showLabel.value === false && (showPrependIcon.value || showAppendIcon.value)
  ));
  const showClose = computed(() => props.closable === true && isIconOnly.value === false);

  const rootClasses = computed(() => [
    `variant-${props.variant}`,
    props.size !== 'default' && `size-${props.size}`,
    normalizedColor.value !== 'default' && `color-${normalizedColor.value}`,
    props.rounded && 'rounded',
    props.disabled && 'disabled',
    showPrependIcon.value && 'has-prepend-icon',
    showAppendIcon.value && 'has-append-icon',
    showClose.value && 'closable',
    isIconOnly.value && 'icon-only',
  ].filter(Boolean));

  return {
    normalizedLabel,
    normalizedColor,
    prependIconConfig,
    appendIconConfig,
    showLabel,
    showPrependIcon,
    showAppendIcon,
    showClose,
    isIconOnly,
    rootClasses,
  };
}
