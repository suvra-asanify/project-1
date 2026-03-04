import { computed, ref, watch } from 'vue';
import {
  normalizeText,
  toIconConfig,
} from '../shared/sharedHelpers';

export const COMBO_BOX_VARIANTS = Object.freeze(['default', 'underlined']);
export const COMBO_BOX_STATES = Object.freeze(['default', 'hover', 'active']);

export const COMBO_BOX_DEFAULT_PLACEHOLDER = 'Placeholder Select Something';
export const COMBO_BOX_DEFAULT_ICON = 'mdi-plus';
export const COMBO_BOX_DEFAULT_HINT = 'suffix';
export const COMBO_BOX_DEFAULT_ITEMS = Object.freeze([
  { title: 'Option Four', value: 'Option Four' },
  { title: 'Selected Value', value: 'Selected Value' },
  { title: 'Option Five', value: 'Option Five' },
  { title: 'Option Six', value: 'Option Six' },
  { title: 'Option Seven', value: 'Option Seven' },
  { title: 'Option Two', value: 'Option Two' },
  { title: 'Title', value: 'Title' },
]);

function normalizeVariant(value) {
  if (typeof value !== 'string') {
    return 'default';
  }
  return COMBO_BOX_VARIANTS.includes(value) ? value : 'default';
}

function normalizeState(value) {
  if (typeof value !== 'string') {
    return 'default';
  }
  return COMBO_BOX_STATES.includes(value) ? value : 'default';
}

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
  if (!Array.isArray(items) || items.length === 0) {
    return COMBO_BOX_DEFAULT_ITEMS.map((item) => ({ ...item }));
  }

  return items.map((item, index) => normalizeItem(item, index, itemTitle, itemValue));
}

function resolveSingleLabel(modelValue, items) {
  if (modelValue == null || modelValue === '') {
    return '';
  }

  const matched = items.find((item) => isSameValue(item.value, modelValue));
  if (matched) {
    return matched.title;
  }

  if (typeof modelValue === 'object' && modelValue !== null) {
    return normalizeText(modelValue.title ?? modelValue.label ?? modelValue.text, '').trim();
  }

  return String(modelValue);
}

export function useComboBox(props, emit) {
  const internalMenuValue = ref(false);

  const normalizedVariant = computed(() => normalizeVariant(props.variant));
  const normalizedState = computed(() => normalizeState(props.state));
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

  const showPrependIcon = computed(() =>
    props.hasIcon === true && iconConfig.value.type !== 'none'
  );
  const showHint = computed(() => props.hasHint === true && normalizedHint.value.length > 0);

  const isMultiple = computed(() => props.multiSelect === true);
  const forcedActiveMenu = computed(() =>
    normalizedState.value === 'active' && props.disabled !== true
  );

  const inputValue = computed({
    get() {
      if (isMultiple.value) {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
      }

      if (Array.isArray(props.modelValue)) {
        return props.modelValue[0] ?? null;
      }

      return props.modelValue ?? null;
    },
    set(nextValue) {
      if (isMultiple.value) {
        emit('update:modelValue', Array.isArray(nextValue) ? nextValue : []);
        return;
      }

      if (Array.isArray(nextValue)) {
        emit('update:modelValue', nextValue[0] ?? null);
        return;
      }

      emit('update:modelValue', nextValue ?? null);
    },
  });

  watch(
    forcedActiveMenu,
    (isForced) => {
      if (isForced) {
        internalMenuValue.value = true;
      }
    },
    { immediate: true }
  );

  watch(
    () => props.disabled,
    (isDisabled) => {
      if (isDisabled) {
        internalMenuValue.value = false;
      }
    }
  );

  const menuValue = computed({
    get() {
      if (forcedActiveMenu.value) {
        return true;
      }
      return internalMenuValue.value;
    },
    set(nextValue) {
      if (forcedActiveMenu.value) {
        internalMenuValue.value = true;
        emit('update:menu', true);
        return;
      }

      internalMenuValue.value = nextValue === true;
      emit('update:menu', internalMenuValue.value);
    },
  });

  const selectedCount = computed(() => {
    if (isMultiple.value) {
      return Array.isArray(inputValue.value) ? inputValue.value.length : 0;
    }
    return inputValue.value == null || inputValue.value === '' ? 0 : 1;
  });

  const selectedCountText = computed(() => `${selectedCount.value} selected`);
  const selectedSingleText = computed(() =>
    resolveSingleLabel(inputValue.value, normalizedItems.value)
  );

  const showClearButton = computed(() =>
    isMultiple.value && selectedCount.value > 0 && menuValue.value
  );
  const menuIcon = computed(() => (menuValue.value ? 'mdi-menu-up' : 'mdi-menu-down'));

  const rootClasses = computed(() => [
    normalizedVariant.value === 'underlined' ? 'underlined' : 'default',
    normalizedState.value !== 'default' && `state-${normalizedState.value}`,
    isMultiple.value && 'multi-select',
    props.disabled && 'disabled',
    showPrependIcon.value && 'has-icon',
    showHint.value && 'has-hint',
  ].filter(Boolean));

  const vuetifyVariant = computed(() => (
    normalizedVariant.value === 'underlined' ? 'underlined' : 'outlined'
  ));

  const menuProps = computed(() => ({
    closeOnContentClick: !isMultiple.value,
    contentClass: 'combo-box-menu-content',
    maxHeight: 304,
  }));

  function onToggleMenu() {
    menuValue.value = !menuValue.value;
  }

  function onClearSelection() {
    inputValue.value = isMultiple.value ? [] : null;
    emit('click:clear');
  }

  function triggerItemSelection(itemSlotProps, event) {
    if (!itemSlotProps || typeof itemSlotProps.onClick !== 'function') {
      return;
    }
    itemSlotProps.onClick(event);
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
    normalizedItems,
    normalizedVariant,
    normalizedPlaceholder,
    normalizedHint,
    normalizedItemTitle,
    normalizedItemValue,
    iconConfig,
    showPrependIcon,
    showHint,
    isMultiple,
    selectedCount,
    selectedCountText,
    selectedSingleText,
    showClearButton,
    menuIcon,
    rootClasses,
    vuetifyVariant,
    menuProps,
    onToggleMenu,
    onClearSelection,
    triggerItemSelection,
    isOptionSelected,
  };
}
