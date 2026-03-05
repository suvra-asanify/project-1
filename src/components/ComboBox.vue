<template>
  <div class="combo-box-shell" :class="{ disabled }">
    <v-combobox
      v-model="inputValue"
      v-model:menu="menuValue"
      v-model:search="searchValue"
      class="combo-box"
      :class="rootClasses"
      :variant="vuetifyVariant"
      :items="normalizedItems"
      :item-title="normalizedItemTitle"
      :item-value="normalizedItemValue"
      :placeholder="normalizedPlaceholder"
      :multiple="isMultiple"
      :menu-icon="menuIcon"
      :menu-props="menuProps"
      :clearable="showClearButton"
      :disabled="disabled"
      :id="id"
      :name="name"
      :error="ariaInvalid"
      :aria-invalid="ariaInvalid ? 'true' : undefined"
      :aria-label="ariaLabel || undefined"
      :aria-required="ariaRequired ? 'true' : undefined"
      :aria-describedby="describedBy"
      :hide-details="$slots.details || showHint ? false : 'auto'"
      clear-icon="mdi-close-circle"
      flat
      single-line
      @focus="onFocus"
      @blur="onBlur"
      @click:clear="onClearSelection"
    >
      <template v-if="$slots['prepend-inner'] || showPrependIcon" #prepend-inner>
        <slot name="prepend-inner" :icon="iconConfig" :disabled="disabled">
          <ds-icon
            :config="iconConfig"
            icon-class="combo-box-icon"
            :image-class="[
              'combo-box-image-icon',
              iconConfig.assetType === 'flag' && 'combo-box-flag-icon flagcdn-icon',
              iconConfig.assetType === 'image' && 'combo-box-custom-icon',
            ]"
          />
        </slot>
      </template>

      <template #selection="{ index }">
        <slot
          name="selection"
          :index="index"
          :multiple="isMultiple"
          :count="selectedCount"
          :count-text="selectedCountText"
          :selected-text="selectedSingleText"
          :show-chip="showSelectionChip"
          :show-count="showSelectionCount"
        >
          <chip
            v-if="showSelectionChip && index === 0"
            class="combo-box-selection-chip"
            size="small"
            :label="selectedSingleText"
          />
          <span v-else-if="showSelectionCount && index === 0" class="combo-box-selection-text">
            {{ selectedCountText }}
          </span>
          <span v-else-if="!isMultiple && selectedSingleText.length > 0 && index === 0" class="combo-box-selection-text">
            {{ selectedSingleText }}
          </span>
        </slot>
      </template>

      <template #item="{ item, index, props: itemSlotProps }">
        <slot
          name="item"
          :item="item"
          :index="index + 1"
          :selected="isOptionSelected(item)"
          :multiple="isMultiple"
          :props="itemSlotProps"
          :select="(event) => triggerItemSelection(itemSlotProps, event)"
        >
          <list-item
            class="combo-box-item"
            v-bind="resolveListItemProps(item)"
            :selected="isOptionSelected(item)"
            :checkbox="isMultiple"
            @click="triggerItemSelection(itemSlotProps, $event)"
            @update:selected="triggerItemSelection(itemSlotProps)"
          >
            <template v-if="$slots['item-title']" #title>
              <slot
                name="item-title"
                :item="item"
                :index="index + 1"
                :selected="isOptionSelected(item)"
              />
            </template>

            <template v-if="$slots['item-prepend']" #prepend>
              <slot
                name="item-prepend"
                :item="item"
                :index="index + 1"
                :selected="isOptionSelected(item)"
              />
            </template>

            <template v-if="$slots['item-append']" #append>
              <slot
                name="item-append"
                :item="item"
                :index="index + 1"
                :selected="isOptionSelected(item)"
              />
            </template>
          </list-item>
        </slot>
      </template>

      <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template v-if="$slots.details || showHint" #details>
        <slot name="details" :hint="normalizedHint">
          <div class="combo-box-meta">
            <span v-if="showHint" :id="hintId" class="combo-box-hint">{{ normalizedHint }}</span>
          </div>
        </slot>
      </template>
    </v-combobox>

    <span v-if="disabled" class="combo-box-disabled-overlay" aria-hidden="true"></span>
  </div>
</template>

<script>
import { computed } from 'vue';
import {
  COMBO_BOX_DEFAULT_HINT,
  COMBO_BOX_DEFAULT_ICON,
  COMBO_BOX_DEFAULT_ITEMS,
  COMBO_BOX_DEFAULT_PLACEHOLDER,
  COMBO_BOX_VARIANTS,
  useComboBox,
} from '../composables/useComboBox';
import { normalizeText } from '../shared/sharedHelpers';
import DsIcon from '../shared/DsIcon.vue';
import { useForwardSlots } from '../shared/useForwardSlots';
import Chip from './Chip.vue';
import ListItem from './ListItem.vue';

function resolveRawItem(item) {
  if (!item || typeof item !== 'object') {
    return {};
  }

  const raw = item.raw ?? item;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  return raw;
}

export default {
  name: 'combo-box',
  components: {
    Chip,
    DsIcon,
    ListItem,
  },
  emits: ['update:value', 'update:menu', 'update:search', 'click:clear'],
  props: {
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return COMBO_BOX_VARIANTS.includes(value);
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: COMBO_BOX_DEFAULT_PLACEHOLDER,
    },
    icon: {
      type: String,
      default: COMBO_BOX_DEFAULT_ICON,
    },
    hint: {
      type: String,
      default: COMBO_BOX_DEFAULT_HINT,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: null,
    },
    items: {
      type: Array,
      default: () => COMBO_BOX_DEFAULT_ITEMS.map((item) => ({ ...item })),
    },
    itemTitle: {
      type: String,
      default: 'title',
    },
    itemValue: {
      type: String,
      default: 'value',
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    ariaInvalid: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: null,
    },
    ariaRequired: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const comboBoxState = useComboBox(props, emit);
    const forwardedSlotNames = useForwardSlots(slots, [
      'prepend-inner',
      'selection',
      'item',
      'details',
      'item-title',
      'item-prepend',
      'item-append',
    ]);

    const hintId = computed(() => (
      props.id && comboBoxState.showHint.value ? `${props.id}-hint` : null
    ));
    const describedBy = computed(() => (
      hintId.value || null
    ));

    const resolveListItemProps = (item) => {
      const rawItem = resolveRawItem(item);
      const nestedProps = rawItem.props && typeof rawItem.props === 'object'
        ? rawItem.props
        : {};

      const label = normalizeText(
        nestedProps.label
          ?? rawItem.label
          ?? rawItem.title
          ?? rawItem.text
          ?? item.title,
        ''
      ).trim();

      const disabled = nestedProps.disabled !== undefined
        ? nestedProps.disabled
        : rawItem.disabled;

      return {
        label,
        size: nestedProps.size ?? rawItem.size ?? 'default',
        avatar: nestedProps.avatar ?? rawItem.avatar,
        prependIcon: nestedProps.prependIcon ?? rawItem.prependIcon,
        appendIcon: nestedProps.appendIcon ?? rawItem.appendIcon,
        subtext: nestedProps.subtext ?? rawItem.subtext,
        appendText: nestedProps.appendText ?? rawItem.appendText,
        disabled: disabled === true,
      };
    };

    return {
      ...comboBoxState,
      forwardedSlotNames,
      hintId,
      describedBy,
      resolveListItemProps,
    };
  },
};
</script>

<style scoped>
.combo-box-shell {
  display: inline-flex;
  flex-direction: column;
  min-width: 260px;
  position: relative;
  width: 100%;
}

.combo-box-shell.disabled {
  cursor: not-allowed;
}

.combo-box-disabled-overlay {
  background: transparent;
  cursor: not-allowed;
  inset: 0;
  position: absolute;
  z-index: 4;
}

.combo-box {
  --combo-box-height: var(--base-40);

  width: 100%;
}

.combo-box :deep(.v-input__control) {
  min-height: var(--combo-box-height);
}

.combo-box :deep(.v-field) {
  --v-field-padding-start: var(--spacing-4);
  --v-field-padding-end: var(--spacing-2);

  min-height: var(--combo-box-height);
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

.combo-box :deep(.v-field__overlay) {
  display: none;
}

.combo-box.default :deep(.v-field) {
  background: rgba(0, 0, 0, 0.04);
  border-radius: var(--rounded-md) var(--rounded-md) 0 0;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.38);
}

.combo-box.default :deep(.v-field__outline) {
  display: none;
}

.combo-box.underlined :deep(.v-field) {
  background: transparent;
  border-radius: 0;
}

.combo-box.underlined :deep(.v-field--variant-underlined .v-field__outline::before) {
  border-bottom-width: var(--border-sm);
  border-top-width: 0;
}

.combo-box.underlined :deep(.v-field--variant-underlined .v-field__outline::after) {
  border-bottom-width: var(--base-2);
  border-top-width: 0;
}

.combo-box.underlined :deep(.v-field__input) {
  padding-inline-start: 0 !important;
}

.combo-box.underlined :deep(.v-field__prepend-inner) {
  padding-inline-start: 0;
}

.combo-box.underlined :deep(.v-field__append-inner) {
  padding-inline-end: 0;
}

.combo-box :deep(.v-field__input) {
  align-items: center;
  color: var(--black-87);
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-height: var(--combo-box-height);
  overflow: hidden;
  padding-bottom: 0;
  padding-top: 0;
}

.combo-box :deep(.v-field__input input) {
  caret-color: rgba(0, 0, 0, 0.87);
  color: inherit;
  font: inherit;
}

.combo-box :deep(input::placeholder) {
  color: var(--black-60);
  opacity: 1;
}

.combo-box :deep(.v-field__prepend-inner),
.combo-box :deep(.v-field__append-inner),
.combo-box :deep(.v-field__clearable) {
  align-items: center;
  padding-bottom: 0;
  padding-top: 0;
}

.combo-box.has-icon :deep(.v-field__prepend-inner) {
  margin-inline-end: var(--spacing-2);
}

.combo-box :deep(.v-field__append-inner) {
  gap: var(--spacing-1);
}

.combo-box :deep(.v-field__append-inner .v-icon),
.combo-box :deep(.v-field__clearable .v-icon) {
  color: var(--black-60);
  font-size: var(--icon-dense);
}

.combo-box :deep(.v-field__clearable) {
  margin-inline-end: var(--spacing-1);
}

.combo-box:not(.disabled).default :deep(.v-field:hover) {
  background-color: rgba(0, 0, 0, 0.08);
}

.combo-box.default.is-active :deep(.v-field),
.combo-box.default:not(.disabled) :deep(.v-field.v-field--focused) {
  background-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 0 var(--base-1) rgba(0, 90, 156, 0.24), inset 0 -2px 0 var(--primary, #005a9c);
  color: var(--primary, #005a9c);
}

.combo-box.underlined.is-active :deep(.v-field),
.combo-box.underlined:not(.disabled) :deep(.v-field--focused) {
  box-shadow: none;
  color: var(--primary, #005a9c);
}

.combo-box.disabled :deep(.v-field) {
  background: rgba(0, 0, 0, 0.05);
}

.combo-box.disabled.underlined :deep(.v-field) {
  background: transparent;
}

.combo-box.disabled :deep(.v-field),
.combo-box.disabled :deep(.v-field__input),
.combo-box.disabled :deep(input),
.combo-box.disabled :deep(.v-icon) {
  color: var(--black-38);
}

.combo-box.disabled,
.combo-box.disabled :deep(*) {
  -webkit-user-select: none;
  user-select: none;
}

.combo-box-selection-text {
  color: var(--black-87);
  display: inline-block;
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.combo-box-selection-chip {
  pointer-events: none;
}

.combo-box-selection-chip :deep(.chip) {
  max-width: 100%;
}

.combo-box :deep(.v-combobox__selection),
.combo-box :deep(.v-select__selection) {
  margin: 0;
  max-width: 100%;
}

.combo-box.multi-select :deep(.v-combobox__selection:not(:first-child)),
.combo-box.multi-select :deep(.v-select__selection:not(:first-child)) {
  display: none;
}

.combo-box-meta {
  align-items: center;
  display: flex;
  min-height: var(--base-16);
  width: 100%;
}

.combo-box :deep(.v-input__details) {
  min-height: var(--base-16);
  padding-top: 4px;
}

.combo-box-hint {
  color: rgba(0, 0, 0, 0.6);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
  overflow-wrap: anywhere;
}

.combo-box-icon {
  color: var(--black-60);
  font-size: var(--icon-dense);
}

.combo-box-image-icon {
  border-radius: var(--rounded-sm);
  display: block;
  height: var(--base-16);
  object-fit: cover;
  width: var(--base-16);
}

.combo-box-custom-icon {
  border-radius: var(--rounded-sm);
  height: var(--base-16);
  object-fit: cover;
  width: var(--base-16);
}

.combo-box-flag-icon.flagcdn-icon {
  border-radius: var(--rounded-sm);
  display: block;
  height: var(--base-16);
  min-width: calc(var(--base-16) * 1.3333333);
  object-fit: contain;
  width: auto;
}

:deep(.combo-box-menu-content) {
  border-radius: var(--rounded-md);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.12);
  margin-top: 0 !important;
  overflow: hidden;
}

:deep(.combo-box-menu-content .v-list) {
  background: var(--white, #ffffff);
  padding-block: var(--spacing-2);
  scrollbar-color: #ffc977 #ffe0b2;
  scrollbar-width: thin;
}

:deep(.combo-box-menu-content .v-list::-webkit-scrollbar) {
  width: var(--base-10);
}

:deep(.combo-box-menu-content .v-list::-webkit-scrollbar-track) {
  background: #ffe0b2;
}

:deep(.combo-box-menu-content .v-list::-webkit-scrollbar-thumb) {
  background: #ffc977;
  border-radius: var(--rounded-pill);
}

:deep(.combo-box-menu-content .combo-box-item.list-item) {
  border-radius: var(--rounded-0);
  max-width: 100%;
  min-height: var(--base-48);
  width: 100%;
}

:deep(.combo-box-menu-content .v-list-item.combo-box-item) {
  max-width: 100%;
  width: 100%;
}
</style>
