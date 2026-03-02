import { computed, ref, watch } from 'vue';

// Neutral person-silhouette placeholder shown when imageSrc is empty or fails to load.
export const AVATAR_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e0e0e0'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%23bdbdbd'/%3E%3Cpath d='M5 35c0-8.3 6.7-15 15-15s15 6.7 15 15' fill='%23bdbdbd'/%3E%3C/svg%3E";

export const AVATAR_DEFAULT_LABEL = 'AA';

// Public enums shared with Avatar prop validators.
export const AVATAR_VARIANTS = Object.freeze(['default', 'img', 'multiple']);
export const AVATAR_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

// Preset prop value -> public class token.
const SIZE_TOKEN_BY_PRESET = Object.freeze({ default: 'default', small: 'sm', large: 'lg' });

// Explicit size must be an integer between 20 and 100 (inclusive).
export function isValidExplicitSize(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 20 && value <= 100;
}

function isPresetSize(value) {
  return typeof value === 'string' && AVATAR_SIZE_KEYS.includes(value);
}

export function useAvatar(props) {
  // Mode helpers for template branching.
  const isImg = computed(() => props.variant === 'img');
  const isMultiple = computed(() => props.variant === 'multiple');

  // Backend-safe label normalization - always uppercase.
  const displayLabel = computed(() => (props.label == null ? '' : String(props.label).trim().toUpperCase()));

  // Preset sizes use CSS classes; explicit integer sizes inject inline CSS vars.
  const isPreset = computed(() => isPresetSize(props.size));
  const explicitSize = computed(() => (isPreset.value || !Number.isFinite(props.size) ? null : `${props.size}px`));

  // count is always a positive integer; clamp to 0 if invalid.
  const normalizedCount = computed(() => (props.count > 0 ? props.count : 0));

  const showCount = computed(() => isMultiple.value && normalizedCount.value > 0);
  const showLabel = computed(() => !isImg.value && displayLabel.value.length > 0);

  // Image src: falls back to placeholder when imageSrc is empty.
  // Resets to the real src whenever the prop changes (e.g. new backend value).
  const currentImageSrc = ref(props.imageSrc || AVATAR_FALLBACK_IMAGE);
  watch(() => props.imageSrc, (val) => {
    currentImageSrc.value = val || AVATAR_FALLBACK_IMAGE;
  });
  // Called by @error on the <img> when the backend URL fails to load.
  function onImageError() {
    currentImageSrc.value = AVATAR_FALLBACK_IMAGE;
  }

  // Inline CSS variables injected only for explicit (non-preset) size values.
  // Ratios derived from the default preset: base-60 container, base-22 label
  // (22/60 ~= 0.3667), base-18 count (18/60 = 0.3), base-48 overlap (48/60 = 0.8).
  const stackStyles = computed(() => {
    if (!explicitSize.value) return null;

    return {
      '--avatar-size': explicitSize.value,
      '--avatar-label-size': 'calc(var(--avatar-size) * 0.3666667)',
      '--avatar-count-size': 'calc(var(--avatar-size) * 0.3)',
      '--avatar-overlap': 'calc(var(--avatar-size) * 0.8)',
    };
  });

  const sizeToken = computed(() =>
    isPreset.value ? SIZE_TOKEN_BY_PRESET[props.size] : String(props.size)
  );

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
    normalizedCount,
    currentImageSrc,
    onImageError,
    rootClasses,
    stackStyles,
    avatarClasses,
  };
}
