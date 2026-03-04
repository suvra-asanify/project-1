import { computed } from 'vue';

export const LIST_ITEM_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

export const LIST_ITEM_DEFAULT_LABEL = 'Title';
export const LIST_ITEM_DEFAULT_SUBTEXT = '';
export const LIST_ITEM_DEFAULT_APPEND_TEXT = '';
export const LIST_ITEM_DEFAULT_ICON = '';
export const LIST_ITEM_DEFAULT_AVATAR_LABEL = 'AA';

function normalizeText(value, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

function normalizeSize(value) {
  if (typeof value !== 'string') {
    return 'default';
  }
  return LIST_ITEM_SIZE_KEYS.includes(value) ? value : 'default';
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

export function useListItem(props) {
  const normalizedSize = computed(() => normalizeSize(props.size));
  const normalizedLabel = computed(() =>
    normalizeText(props.label, LIST_ITEM_DEFAULT_LABEL).trim()
  );
  const normalizedSubtext = computed(() =>
    normalizeText(props.subtext, LIST_ITEM_DEFAULT_SUBTEXT).trim()
  );
  const normalizedAppendText = computed(() =>
    normalizeText(props.appendText, LIST_ITEM_DEFAULT_APPEND_TEXT).trim()
  );

  const prependIconConfig = computed(() =>
    toIconConfig(normalizeText(props.prependIcon, LIST_ITEM_DEFAULT_ICON).trim())
  );
  const appendIconConfig = computed(() =>
    toIconConfig(normalizeText(props.appendIcon, LIST_ITEM_DEFAULT_ICON).trim())
  );

  const showCheckbox = computed(() => props.showCheckbox === true);
  const showAvatar = computed(() => props.prependAvatar === true);
  const showPrependIcon = computed(() => prependIconConfig.value.type !== 'none');
  const showAppendIcon = computed(() => appendIconConfig.value.type !== 'none');
  const showSubtext = computed(() => normalizedSubtext.value.length > 0);
  const showAppendText = computed(() => normalizedAppendText.value.length > 0);

  const avatarLabel = computed(() => {
    const fromLabel = normalizedLabel.value
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return fromLabel || LIST_ITEM_DEFAULT_AVATAR_LABEL;
  });

  const rootClasses = computed(() => [
    normalizedSize.value !== 'default' && `size-${normalizedSize.value}`,
    props.selected && 'selected',
    props.disabled && 'disabled',
    showCheckbox.value && 'has-checkbox',
    showAvatar.value && 'has-avatar',
    showPrependIcon.value && 'has-prepend-icon',
    showAppendIcon.value && 'has-append-icon',
    showSubtext.value && 'has-subtext',
    showAppendText.value && 'has-append-text',
  ].filter(Boolean));

  const vuetifyDensity = computed(() => {
    if (normalizedSize.value === 'small') return 'compact';
    if (normalizedSize.value === 'large') return 'comfortable';
    return 'default';
  });
  const vuetifyLines = computed(() => (
    showSubtext.value ? 'three' : 'two'
  ));

  return {
    normalizedSize,
    normalizedLabel,
    normalizedSubtext,
    normalizedAppendText,
    prependIconConfig,
    appendIconConfig,
    showCheckbox,
    showAvatar,
    showPrependIcon,
    showAppendIcon,
    showSubtext,
    showAppendText,
    avatarLabel,
    rootClasses,
    vuetifyDensity,
    vuetifyLines,
  };
}
