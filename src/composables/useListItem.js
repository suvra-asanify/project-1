import { computed } from 'vue';
import {
  normalizeText,
  toIconConfig,
} from './sharedHelpers';

export const LIST_ITEM_SIZE_KEYS = Object.freeze(['default', 'small', 'large']);

export const LIST_ITEM_DEFAULT_LABEL = 'Title';
export const LIST_ITEM_DEFAULT_SUBTEXT = '';
export const LIST_ITEM_DEFAULT_APPEND_TEXT = '';
export const LIST_ITEM_DEFAULT_ICON = '';
export const LIST_ITEM_DEFAULT_AVATAR_LABEL = 'AA';

function normalizeSize(value) {
  if (typeof value !== 'string') {
    return 'default';
  }
  return LIST_ITEM_SIZE_KEYS.includes(value) ? value : 'default';
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
