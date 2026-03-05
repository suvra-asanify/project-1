import { computed } from 'vue';
import { normalizeText } from '../shared/sharedHelpers';
import { toIconConfig } from '../shared/iconHelpers';

export const CHIP_VARIANTS = Object.freeze(['default', 'tonal']);
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

function normalizeColor(value) {
  const normalized = normalizeText(value, 'default').trim().toLowerCase();
  if (CHIP_COLORS.includes(normalized)) {
    return normalized;
  }
  return 'default';
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
