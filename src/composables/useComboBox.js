import { computed, ref, watch } from 'vue';
import { normalizeText } from '../shared/sharedHelpers';
import { toIconConfig } from '../shared/iconHelpers';

export const COMBO_BOX_VARIANTS = Object.freeze(['default', 'underlined']);

export const COMBO_BOX_DEFAULT_PLACEHOLDER = 'Placeholder Select Something';
export const COMBO_BOX_DEFAULT_ICON = '';
export const COMBO_BOX_DEFAULT_HINT = '';

function normalizeKey(value, fallback) {
  const normalized = normalizeText(value, fallback).trim();
  if (normalized.length > 0) {
    return normalized;
  }
  return fallback;
}

function isSameValue(left, right) {
  if (left === right) {
    return true;
  }
  if (left == null || right == null) {
    return false;
  }
  return String(left) === String(right);
}

function normalizeItem(item, index, titleKey, valueKey) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const title = normalizeText(
      item[titleKey] ?? item.title ?? item.label ?? item.text,
      `Option ${index + 1}`
    ).trim();
    const value = item[valueKey] ?? item.value ?? title;

    return {
      ...item,
      title,
      value,
    };
  }

  const title = normalizeText(item, `Option ${index + 1}`).trim();
  return {
    title,
    value: title,
  };
}

function normalizeItems(items, itemTitle, itemValue) {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((item, index) => normalizeItem(item, index, itemTitle, itemValue));
}

function resolveSingleLabel(value, items) {
  if (value == null || value === '') {
    return '';
  }

  const matched = items.find((item) => isSameValue(item.value, value));
  if (matched) {
    return matched.title;
  }

  if (typeof value === 'object' && value !== null) {
    return normalizeText(value.title ?? value.label ?? value.text, '').trim();
  }

  return String(value);
}

export function useComboBox(props, emit) {
  const internalMenuValue = ref(false);
  const internalSearchValue = ref('');
  const isFocused = ref(false);

  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, COMBO_BOX_DEFAULT_PLACEHOLDER)
  );
  const normalizedHint = computed(() =>
    normalizeText(props.hint, COMBO_BOX_DEFAULT_HINT).trim()
  );
  const normalizedItemTitle = computed(() => normalizeKey(props.itemTitle, 'title'));
  const normalizedItemValue = computed(() => normalizeKey(props.itemValue, 'value'));

  const normalizedItems = computed(() =>
    normalizeItems(props.items, normalizedItemTitle.value, normalizedItemValue.value)
  );

  const iconConfig = computed(() =>
    toIconConfig(normalizeText(props.icon, COMBO_BOX_DEFAULT_ICON).trim())
  );

  const showPrependIcon = computed(() => iconConfig.value.type !== 'none');
  const showHint = computed(() => normalizedHint.value.length > 0);
  const hintId = computed(() => (
    props.id && showHint.value ? `${props.id}-hint` : null
  ));
  const describedBy = computed(() => hintId.value || null);
  const isMultiple = computed(() => props.multiple === true);

  const inputValue = computed({
    get() {
      if (isMultiple.value) {
        return Array.isArray(props.value) ? props.value : [];
      }

      if (Array.isArray(props.value)) {
        return props.value[0] ?? null;
      }

      return props.value ?? null;
    },
    set(nextValue) {
      if (isMultiple.value) {
        emit('update:value',Array.isArray(nextValue) ? nextValue : []);
        return;
      }

      if (Array.isArray(nextValue)) {
        emit('update:value',nextValue[0] ?? null);
        return;
      }

      emit('update:value',nextValue ?? null);
    },
  });

  watch(
    () => props.disabled,
    (isDisabled) => {
      if (isDisabled) {
        internalMenuValue.value = false;
        isFocused.value = false;
      }
    }
  );

  const menuValue = computed({
    get() {
      return internalMenuValue.value;
    },
    set(nextValue) {
      internalMenuValue.value = nextValue === true;
      emit('update:menu', internalMenuValue.value);
    },
  });

  const searchValue = computed({
    get() {
      return internalSearchValue.value;
    },
    set(nextValue) {
      internalSearchValue.value = normalizeText(nextValue, '');
      emit('update:search', internalSearchValue.value);
    },
  });

  const selectedCount = computed(() => {
    if (isMultiple.value) {
      return Array.isArray(inputValue.value) ? inputValue.value.length : 0;
    }
    return inputValue.value == null || inputValue.value === '' ? 0 : 1;
  });

  const selectedCountText = computed(() => `${selectedCount.value} selected`);
  const selectedSingleText = computed(() => {
    if (isMultiple.value) {
      const firstValue = Array.isArray(inputValue.value) ? inputValue.value[0] : null;
      return resolveSingleLabel(firstValue, normalizedItems.value);
    }

    return resolveSingleLabel(inputValue.value, normalizedItems.value);
  });

  const showSelectionChip = computed(() =>
    isMultiple.value
    && selectedCount.value === 1
    && selectedSingleText.value.length > 0
  );
  const showSelectionCount = computed(() =>
    isMultiple.value && selectedCount.value > 1
  );

  const isActive = computed(() =>
    props.disabled !== true && (menuValue.value || isFocused.value)
  );
  const showClearButton = computed(() =>
    isMultiple.value && selectedCount.value > 0 && isActive.value
  );
  const menuIcon = computed(() => (menuValue.value ? 'mdi-menu-up' : 'mdi-menu-down'));

  const rootClasses = computed(() => [
    props.variant === 'underlined' ? 'underlined' : 'default',
    isMultiple.value && 'multi-select',
    props.disabled && 'disabled',
    showPrependIcon.value && 'has-icon',
    showHint.value && 'has-hint',
    isActive.value && 'is-active',
  ].filter(Boolean));

  const vuetifyVariant = computed(() => (
    props.variant === 'underlined' ? 'underlined' : 'filled'
  ));

  const menuProps = computed(() => ({
    closeOnContentClick: !isMultiple.value,
    contentClass: 'combo-box-menu-content',
    maxHeight: 304,
  }));

  function onClearSelection() {
    inputValue.value = isMultiple.value ? [] : null;
    emit('click:clear');
  }

  function onFocus() {
    if (props.disabled) {
      return;
    }
    isFocused.value = true;
  }

  function onBlur() {
    isFocused.value = false;
  }

  function triggerItemSelection(itemSlotProps, event) {
    if (typeof itemSlotProps?.onClick === 'function') {
      itemSlotProps.onClick(event instanceof Event ? event : undefined);
    }
  }

  function isOptionSelected(option) {
    if (!option || typeof option !== 'object') {
      return false;
    }

    const optionValue = option.value;
    if (isMultiple.value) {
      return Array.isArray(inputValue.value)
        && inputValue.value.some((value) => isSameValue(value, optionValue));
    }

    return isSameValue(inputValue.value, optionValue);
  }

  return {
    inputValue,
    menuValue,
    searchValue,
    normalizedItems,
    normalizedPlaceholder,
    normalizedHint,
    normalizedItemTitle,
    normalizedItemValue,
    iconConfig,
    showPrependIcon,
    showHint,
    hintId,
    describedBy,
    isMultiple,
    selectedCount,
    selectedCountText,
    selectedSingleText,
    showSelectionChip,
    showSelectionCount,
    showClearButton,
    menuIcon,
    rootClasses,
    vuetifyVariant,
    menuProps,
    onClearSelection,
    onFocus,
    onBlur,
    triggerItemSelection,
    isOptionSelected,
  };
}
