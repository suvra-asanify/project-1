import { computed, ref, watch } from 'vue';
import {
  normalizePositiveInteger,
  normalizeText,
} from '../shared/sharedHelpers';

export const LIST_DEFAULT_LABEL = 'Title';
export const LIST_DEFAULT_MAX_HEIGHT = 304;
export const LIST_DEFAULT_ITEM_COUNT = 6;
export const LIST_DEFAULT_SELECTED = 2;
export const LIST_SCROLLBAR_THUMB_PERCENT = 27.14;

function normalizeLabel(value, fallback = LIST_DEFAULT_LABEL) {
  const normalized = normalizeText(value, fallback).trim();
  if (normalized.length > 0) {
    return normalized;
  }
  return fallback;
}

function areValuesEqual(left, right) {
  return String(left) === String(right);
}

function normalizeItem(item, index, fallbackLabel) {
  const fallbackValue = index;

  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const value = item.value ?? fallbackValue;
    const key = item.key ?? value ?? fallbackValue;
    const label = normalizeLabel(
      item.label ?? item.title ?? item.text,
      fallbackLabel
    );

    const nestedProps = item.props && typeof item.props === 'object'
      ? item.props
      : {};

    return {
      key,
      value,
      raw: item,
      listItemProps: {
        label,
        size: nestedProps.size ?? item.size,
        checkbox: nestedProps.checkbox ?? item.checkbox,
        avatar: nestedProps.avatar ?? item.avatar,
        prependIcon: nestedProps.prependIcon ?? item.prependIcon,
        appendIcon: nestedProps.appendIcon ?? item.appendIcon,
        subtext: nestedProps.subtext ?? item.subtext,
        appendText: nestedProps.appendText ?? item.appendText,
        disabled: nestedProps.disabled ?? item.disabled,
      },
    };
  }

  return {
    key: fallbackValue,
    value: fallbackValue,
    raw: item,
    listItemProps: {
      label: normalizeLabel(item, fallbackLabel),
    },
  };
}

function buildFallbackItems(label) {
  return Array.from({ length: LIST_DEFAULT_ITEM_COUNT }, (_, index) =>
    normalizeItem({ value: index + 1, label }, index + 1, label)
  );
}

function resolveSelectedValue(modelValue, items) {
  if (items.length === 0) {
    return null;
  }

  if (modelValue != null && modelValue !== '') {
    const matched = items.find((item) => areValuesEqual(item.value, modelValue));
    if (matched) {
      return matched.value;
    }
  }

  const initiallySelected = items.find((item) => item.raw && item.raw.selected === true);
  if (initiallySelected) {
    return initiallySelected.value;
  }

  const defaultMatch = items.find((item) => areValuesEqual(item.value, LIST_DEFAULT_SELECTED));
  if (defaultMatch) {
    return defaultMatch.value;
  }

  return items[0].value;
}

export function useList(props, attrs) {
  const normalizedMaxHeight = computed(() =>
    normalizePositiveInteger(props.maxHeight, LIST_DEFAULT_MAX_HEIGHT)
  );

  const normalizedItems = computed(() => {
    if (!Array.isArray(attrs.items) || attrs.items.length === 0) {
      return buildFallbackItems(LIST_DEFAULT_LABEL);
    }

    return attrs.items.map((item, index) =>
      normalizeItem(item, index + 1, LIST_DEFAULT_LABEL)
    );
  });

  const selectedValue = ref(null);

  watch(
    [normalizedItems, () => attrs.modelValue],
    ([items, modelValue]) => {
      selectedValue.value = resolveSelectedValue(modelValue, items);
    },
    { immediate: true }
  );

  const showScrollbar = computed(() => normalizedItems.value.length > LIST_DEFAULT_ITEM_COUNT);

  const listStyles = computed(() => ({
    '--list-max-height': `${normalizedMaxHeight.value}px`,
  }));

  const scrollbarThumbStyles = computed(() => ({
    height: `${LIST_SCROLLBAR_THUMB_PERCENT}%`,
    top: '0%',
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
    scrollbarThumbStyles,
    rootClasses,
  };
}
