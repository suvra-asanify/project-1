import { computed } from 'vue';

// Public enums shared with Avatar prop validators.
export const AVATAR_VARIANTS = Object.freeze(['default', 'img', 'multiple']);
export const AVATAR_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

// Preset prop value -> public class token.
const SIZE_TOKEN_BY_PRESET = Object.freeze({ default: 'default', small: 'sm', large: 'lg' });

export const AVATAR_FALLBACK_IMAGE =
  'https://www.figma.com/api/mcp/asset/0ad7dc93-7eda-4247-b729-7786b3e7cbb9';

function isPresetSize(value) {
  return typeof value === 'string' && AVATAR_SIZE_KEYS.includes(value);
}

// Converts size input to CSS length:
// - 36 -> 36px
// - "36" -> 36px
// - "4rem" / "clamp(...)" -> unchanged
function toCssSize(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? `${value}px` : null;
  }

  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

// For explicit numeric sizes, emit predictable class hooks:
// 36 or "36px" -> size-36, 36.5 -> size-36-5.
function toSizeClassToken(value) {
  const raw = typeof value === 'number'
    ? String(value)
    : typeof value === 'string'
      ? value.trim()
      : '';

  const numericLike = /^(\d+(?:\.\d+)?)(?:px)?$/i.exec(raw);
  return numericLike ? numericLike[1].replace(/\./g, '-') : 'custom';
}

export function useAvatar(props) {
  // Mode helpers for template branching.
  const isImg = computed(() => props.variant === 'img');
  const isMultiple = computed(() => props.variant === 'multiple');

  // Backend-safe label normalization.
  const displayLabel = computed(() => (props.label == null ? '' : String(props.label).trim()));

  // Preset sizes use CSS classes. Any non-preset value is treated as explicit size.
  const presetSizeKey = computed(() => (isPresetSize(props.size) ? props.size : 'default'));
  const explicitSize = computed(() => (isPresetSize(props.size) ? null : toCssSize(props.size)));

  const normalizedCount = computed(() => {
    const parsed = Number(props.count);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  });

  const showCount = computed(() => isMultiple.value && normalizedCount.value > 0);
  const showGhost = showCount;
  const showLabel = computed(() => !isImg.value && displayLabel.value.length > 0);
  const resolvedImageSrc = computed(() => props.imageSrc || AVATAR_FALLBACK_IMAGE);

  // Inline CSS variables are required only for explicit size values.
  const stackStyles = computed(() => {
    if (!explicitSize.value) return null;

    return {
      '--avatar-size': explicitSize.value,
      '--avatar-label-size': 'calc(var(--avatar-size) * 0.3666667)',
      '--avatar-count-size': 'calc(var(--avatar-size) * 0.3)',
      '--avatar-overlap': 'calc(var(--avatar-size) * 0.8)',
    };
  });

  const sizeToken = computed(() => (
    explicitSize.value
      ? toSizeClassToken(props.size)
      : SIZE_TOKEN_BY_PRESET[presetSizeKey.value]
  ));

  // Public classes: default state is implicit (no variant-default / size-default).
  const rootClasses = computed(() => [
    props.variant !== 'default' && `variant-${props.variant}`,
    sizeToken.value !== 'default' && `size-${sizeToken.value}`,
  ].filter(Boolean));

  const avatarClasses = computed(() => [
    `avatar--variant-${props.variant}`,
    props.rounded ? 'avatar--rounded' : 'avatar--square',
  ]);

  return {
    isImg,
    isMultiple,
    displayLabel,
    showLabel,
    showCount,
    showGhost,
    normalizedCount,
    resolvedImageSrc,
    rootClasses,
    stackStyles,
    avatarClasses,
  };
}
