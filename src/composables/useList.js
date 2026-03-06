import { computed, ref, watch } from 'vue';
import {
  areValuesEqual,
  extractListItemProps,
  normalizePositiveInteger,
} from '../shared/sharedHelpers';

const LIST_DEFAULT_LABEL = 'Title';
const LIST_DEFAULT_ITEM_COUNT = 6;
export const LIST_DEFAULT_MAX_HEIGHT = 304;

function normalizeItem(item, index) {
  const fallbackValue = index;

  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const value = item.value ?? fallbackValue;
    const key = item.key ?? value ?? fallbackValue;
    return {
      key,
      value,
      raw: item,
      listItemProps: extractListItemProps(item, LIST_DEFAULT_LABEL),
    };
  }

  const primitiveLabel = String(item ?? '') || LIST_DEFAULT_LABEL;
  return {
    key: fallbackValue,
    value: fallbackValue,
    raw: item,
    listItemProps: { label: primitiveLabel },
  };
}

function resolveSelectedValue(value, items) {
  if (items.length === 0) return null;

  if (value != null && value !== '') {
    const matched = items.find((item) => areValuesEqual(item.value, value));
    if (matched) return matched.value;
  }

  const initiallySelected = items.find((item) => item.raw?.selected === true);
  return initiallySelected ? initiallySelected.value : null;
}

export function useList(props) {
  const normalizedMaxHeight = computed(() =>
    normalizePositiveInteger(props.maxHeight, LIST_DEFAULT_MAX_HEIGHT)
  );

  const normalizedItems = computed(() => {
    if (!Array.isArray(props.items) || props.items.length === 0) return [];
    return props.items.map((item, index) => normalizeItem(item, index + 1));
  });

  const selectedValue = ref(null);

  watch(
    [normalizedItems, () => props.value],
    ([items, value]) => {
      selectedValue.value = resolveSelectedValue(value, items);
    },
    { immediate: true }
  );

  const showScrollbar = computed(() => normalizedItems.value.length > LIST_DEFAULT_ITEM_COUNT);

  const listStyles = computed(() => ({
    '--list-max-height': `${normalizedMaxHeight.value}px`,
  }));

  const rootClasses = computed(() => [
    showScrollbar.value ? 'has-scrollbar' : 'no-scrollbar',
    normalizedItems.value.length === 0 && 'empty',
  ].filter(Boolean));

  return {
    normalizedItems,
    selectedValue,
    showScrollbar,
    listStyles,
    rootClasses,
  };
}
