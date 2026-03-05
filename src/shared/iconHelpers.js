import { normalizeText } from './sharedHelpers';

// --- private helpers ---

function toMdiIcon(rawIcon) {
  const icon = normalizeText(rawIcon).trim();
  if (!icon) return '';
  if (icon.startsWith('$')) return icon;

  // handle class strings like "mdi mdi-home"
  const token = icon.split(/\s+/).find((p) => /^mdi-[a-z0-9-]+$/i.test(p));
  if (token) return token;

  const normalized = icon.replace(/^mdi[:-]/i, '').trim();
  return normalized && normalized.toLowerCase() !== 'mdi' ? `mdi-${normalized}` : '';
}

function isFlagCdnUrl(icon) {
  return /^(?:https?:\/\/|\/\/)?(?:www\.)?flagcdn\.com\/.+/i.test(icon);
}

function isUrlLike(icon) {
  return /^(?:https?:\/\/|\/\/|\/|\.\/|\.\.\/|data:image\/|blob:)/i.test(icon);
}

function isImageFilePath(icon) {
  return !/\s/.test(icon) && /\.(?:svg|png|jpe?g|gif|webp|avif|bmp|ico)(?:[?#].*)?$/i.test(icon);
}

function ensureHttpsUrl(icon) {
  if (/^\/\//.test(icon)) return `https:${icon}`;
  if (/^http:\/\/(?:www\.)?flagcdn\.com\//i.test(icon)) return icon.replace(/^http:/i, 'https:');
  if (/^https?:\/\//i.test(icon)) return icon;
  if (/^(?:www\.)?flagcdn\.com\//i.test(icon)) return `https://${icon}`;
  return icon;
}

// Shared frozen sentinel for the "no icon" case — avoids a new object on every call.
const NONE_CONFIG = Object.freeze({
  type: 'none',
  assetType: '',
  className: '',
  icon: '',
  src: '',
  alt: '',
});

// --- public API ---

export function toIconConfig(rawIcon) {
  const icon = normalizeText(rawIcon).trim();
  if (!icon) return NONE_CONFIG;

  if (isFlagCdnUrl(icon)) {
    return { type: 'asset', assetType: 'flag', className: '', icon: '', src: ensureHttpsUrl(icon), alt: 'flag icon' };
  }

  const flagMatch = icon.match(/^flag:([a-z]{2})$/i);
  if (flagMatch) {
    const cc = flagMatch[1].toLowerCase();
    return { type: 'asset', assetType: 'flag', className: '', icon: '', src: `https://flagcdn.com/${cc}.svg`, alt: `${cc.toUpperCase()} flag` };
  }

  if (isUrlLike(icon) || isImageFilePath(icon)) {
    return { type: 'asset', assetType: 'image', className: '', icon: '', src: ensureHttpsUrl(icon), alt: 'icon' };
  }

  const mdiIcon = toMdiIcon(icon);
  return {
    type: 'mdi',
    assetType: '',
    className: mdiIcon && !mdiIcon.startsWith('$') ? `mdi ${mdiIcon}` : '',
    icon: mdiIcon,
    src: '',
    alt: '',
  };
}
