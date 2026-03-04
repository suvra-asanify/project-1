export function normalizeText(value, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

export function normalizePositiveInteger(value, fallback = 1) {
  if (Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return fallback;
}

function toMdiClass(rawIcon) {
  const icon = toMdiIcon(rawIcon);
  if (!icon || icon.startsWith('$')) {
    return '';
  }
  return `mdi ${icon}`;
}

export function toMdiIcon(rawIcon) {
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

export function isFlagCdnUrl(icon) {
  return /^(?:https?:\/\/|\/\/)?(?:www\.)?flagcdn\.com\/.+/i.test(icon);
}

export function isUrlLike(icon) {
  return /^(?:https?:\/\/|\/\/|\/|\.\/|\.\.\/|data:image\/|blob:)/i.test(icon);
}

export function isImageFilePath(icon) {
  if (/\s/.test(icon)) {
    return false;
  }
  return /\.(?:svg|png|jpe?g|gif|webp|avif|bmp|ico)(?:[?#].*)?$/i.test(icon);
}

export function ensureHttpsUrl(icon) {
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

export function toIconConfig(rawIcon) {
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
      src: `https://flagcdn.com/${shorthand}.svg`,
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
