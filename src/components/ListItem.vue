<template>
  <v-list-item
    class="list-item"
    :class="rootClasses"
    :density="vuetifyDensity"
    :disabled="disabled"
    :lines="vuetifyLines"
    :ripple="false"
    :tabindex="disabled ? -1 : 0"
    role="listitem"
    :aria-selected="selected ? 'true' : 'false'"
    @click="onClick"
  >
    <template
      v-if="$slots.prepend || $slots.checkbox || $slots.avatar || $slots['prepend-icon'] || showCheckbox || showAvatar || showPrependIcon"
      #prepend
    >
      <slot
        name="prepend"
        :selected="selected"
        :disabled="disabled"
        :checkbox="showCheckbox"
        :avatar="showAvatar"
        :show-prepend-icon="showPrependIcon"
        :prepend-icon="prependIconConfig"
        :avatar-label="avatarLabel"
      >
        <div class="list-item-prepend-group">
          <slot name="checkbox" :selected="selected" :disabled="disabled">
            <v-checkbox-btn
              v-if="showCheckbox"
              class="list-item-checkbox"
              :model-value="selected"
              :disabled="disabled"
              :ripple="false"
              density="compact"
              tabindex="-1"
              @click.stop
              @update:modelValue="onCheckboxUpdate"
            />
          </slot>

          <slot name="avatar" :label="avatarLabel" :selected="selected" :disabled="disabled">
            <v-avatar v-if="showAvatar" class="list-item-avatar" :size="avatarSize">
              <span class="list-item-avatar-label">{{ avatarLabel }}</span>
            </v-avatar>
          </slot>

          <slot name="prepend-icon" :icon="prependIconConfig" :disabled="disabled">
            <v-icon
              v-if="showPrependIcon && prependIconConfig.type === 'mdi'"
              class="list-item-prepend-icon"
            >
              {{ prependIconConfig.icon }}
            </v-icon>
            <img
              v-else-if="showPrependIcon"
              class="list-item-image-icon list-item-prepend-image"
              :class="prependIconConfig.assetType === 'flag' ? 'flagcdn-icon' : null"
              :src="prependIconConfig.src"
              :alt="prependIconConfig.alt"
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
              loading="lazy"
            />
          </slot>
        </div>
      </slot>
    </template>

    <template #title>
      <slot
        name="title"
        :label="normalizedLabel"
        :disabled="disabled"
        :selected="selected"
        :size="normalizedSize"
      >
        <span class="list-item-title">{{ normalizedLabel }}</span>
      </slot>
    </template>

    <template v-if="showSubtext" #subtitle>
      <slot
        name="subtitle"
        :subtext="normalizedSubtext"
        :disabled="disabled"
        :selected="selected"
        :size="normalizedSize"
      >
        <span class="list-item-subtext">{{ normalizedSubtext }}</span>
      </slot>
    </template>

    <template
      v-if="$slots.append || $slots['append-text'] || $slots['append-icon'] || showAppendText || showAppendIcon"
      #append
    >
      <slot
        name="append"
        :append-text="normalizedAppendText"
        :show-append-text="showAppendText"
        :append-icon="appendIconConfig"
        :show-append-icon="showAppendIcon"
        :disabled="disabled"
        :selected="selected"
      >
        <div class="list-item-append-group">
          <slot name="append-text" :text="normalizedAppendText" :disabled="disabled">
            <span v-if="showAppendText" class="list-item-append-text">{{ normalizedAppendText }}</span>
          </slot>

          <slot name="append-icon" :icon="appendIconConfig" :disabled="disabled">
            <v-icon
              v-if="showAppendIcon && appendIconConfig.type === 'mdi'"
              class="list-item-append-icon"
            >
              {{ appendIconConfig.icon }}
            </v-icon>
            <img
              v-else-if="showAppendIcon"
              class="list-item-image-icon list-item-append-image"
              :class="appendIconConfig.assetType === 'flag' ? 'flagcdn-icon' : null"
              :src="appendIconConfig.src"
              :alt="appendIconConfig.alt"
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
              loading="lazy"
            />
          </slot>
        </div>
      </slot>
    </template>

    <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </v-list-item>
</template>

<script>
import { computed } from 'vue';
import {
  LIST_ITEM_DEFAULT_APPEND_TEXT,
  LIST_ITEM_DEFAULT_ICON,
  LIST_ITEM_DEFAULT_LABEL,
  LIST_ITEM_DEFAULT_SUBTEXT,
  LIST_ITEM_SIZE_KEYS,
  useListItem,
} from '../composables/useListItem';

export default {
  name: 'list-item',
  emits: ['click', 'update:selected', 'click:checkbox'],
  props: {
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return LIST_ITEM_SIZE_KEYS.includes(value);
      },
    },
    selected: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: LIST_ITEM_DEFAULT_LABEL,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: Boolean,
      default: false,
    },
    prependIcon: {
      type: String,
      default: LIST_ITEM_DEFAULT_ICON,
    },
    appendIcon: {
      type: String,
      default: LIST_ITEM_DEFAULT_ICON,
    },
    subtext: {
      type: String,
      default: LIST_ITEM_DEFAULT_SUBTEXT,
    },
    appendText: {
      type: String,
      default: LIST_ITEM_DEFAULT_APPEND_TEXT,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const listItemState = useListItem(props);
    const avatarSize = computed(() => {
      if (listItemState.normalizedSize.value === 'small') {
        return 32;
      }
      if (listItemState.normalizedSize.value === 'large') {
        return 40;
      }
      return 36;
    });

    const forwardedSlotNames = computed(() => (
      Object.keys(slots).filter((name) => ![
        'default',
        'prepend',
        'append',
        'title',
        'subtitle',
        'checkbox',
        'avatar',
        'prepend-icon',
        'append-text',
        'append-icon',
      ].includes(name))
    ));

    return {
      ...listItemState,
      avatarSize,
      forwardedSlotNames,
    };
  },
  methods: {
    onClick(event) {
      if (this.disabled) {
        return;
      }
      this.$emit('click', event);
    },
    onCheckboxUpdate(nextValue) {
      const normalizedValue = nextValue === true;
      this.$emit('update:selected', normalizedValue);
      this.$emit('click:checkbox', normalizedValue);
    },
  },
};
</script>

<style scoped>
.list-item {
  --list-item-height: var(--base-48);
  --list-item-title-size: var(--body-base-size);
  --list-item-title-lh: var(--body-base-lh);
  --list-item-subtext-size: var(--body-sm-size);
  --list-item-subtext-lh: var(--body-sm-lh);
  --list-item-icon-size: var(--base-20);
  --list-item-overlay-color: var(--black-87);
  --list-item-selected-overlay-opacity: 0;
  --list-item-state-overlay-opacity: 0;

  background: var(--white, #ffffff);
  color: var(--black-87);
  cursor: pointer;
  isolation: isolate;
  max-width: 360px;
  min-height: var(--list-item-height);
  overflow: hidden;
  padding-inline: var(--spacing-4) !important;
  position: relative;
  user-select: none;
  width: 100%;
}

.list-item::before,
.list-item::after {
  background: var(--list-item-overlay-color);
  content: '';
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.list-item::before {
  opacity: var(--list-item-selected-overlay-opacity);
  z-index: 0;
}

.list-item::after {
  opacity: var(--list-item-state-overlay-opacity);
  z-index: 0;
}

.list-item.selected {
  --list-item-selected-overlay-opacity: 0.12;
}

.list-item:not(.disabled):hover {
  --list-item-state-overlay-opacity: 0.04;
}

.list-item:not(.disabled):active {
  --list-item-state-overlay-opacity: 0.18;
}

.list-item.disabled {
  --list-item-selected-overlay-opacity: 0;
  --list-item-state-overlay-opacity: 0;

  color: var(--black-38);
  cursor: not-allowed;
  opacity: 0.72;
}

.list-item.size-small {
  --list-item-height: var(--base-40);
  --list-item-title-size: var(--body-sm-size);
  --list-item-title-lh: var(--body-sm-lh);
  --list-item-subtext-size: var(--body-xs-size);
  --list-item-subtext-lh: var(--body-xs-lh);
  --list-item-icon-size: var(--base-16);
}

.list-item.size-large {
  --list-item-height: var(--base-56);
  --list-item-title-size: var(--body-lg-size);
  --list-item-title-lh: var(--body-lg-lh);
  --list-item-subtext-size: var(--body-base-size);
  --list-item-subtext-lh: var(--body-base-lh);
  --list-item-icon-size: var(--base-24);
}

.list-item :deep(.v-list-item__overlay) {
  display: none;
}

.list-item :deep(.v-list-item__prepend),
.list-item :deep(.v-list-item__content),
.list-item :deep(.v-list-item__append) {
  position: relative;
  z-index: 1;
}

.list-item :deep(.v-list-item__prepend) {
  align-items: center;
  margin: 0;
  margin-inline-end: var(--spacing-3);
}

.list-item :deep(.v-list-item__append) {
  align-items: center;
  margin: 0;
  margin-inline-start: var(--spacing-3);
}

.list-item :deep(.v-list-item__content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 0;
}

.list-item :deep(.v-list-item-title),
.list-item-title {
  color: inherit;
  display: -webkit-box;
  font-size: var(--list-item-title-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--list-item-title-lh);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
}

.list-item :deep(.v-list-item-subtitle),
.list-item-subtext {
  color: var(--black-60);
  display: block;
  font-size: var(--list-item-subtext-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--list-item-subtext-lh);
  margin-top: 0;
  opacity: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item.disabled :deep(.v-list-item-subtitle),
.list-item.disabled .list-item-subtext,
.list-item.disabled .list-item-append-text {
  color: var(--black-38);
}

.list-item-prepend-group,
.list-item-append-group {
  align-items: center;
  display: inline-flex;
  gap: var(--spacing-3);
}

.list-item-append-text {
  color: var(--black-60);
  font-size: var(--list-item-subtext-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--list-item-subtext-lh);
  max-width: 96px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-checkbox {
  margin: 0;
}

.list-item-checkbox :deep(.v-selection-control) {
  align-items: center;
  margin: 0;
  min-height: auto;
}

.list-item-checkbox :deep(.v-selection-control__wrapper) {
  height: var(--base-24);
  width: var(--base-24);
}

.list-item-checkbox :deep(.v-selection-control__input) {
  height: var(--base-24);
  width: var(--base-24);
}

.list-item-avatar {
  background: var(--primary);
  color: var(--white);
}

.list-item-avatar-label {
  font-size: var(--body-sm-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--body-sm-lh);
}

.list-item-prepend-icon,
.list-item-append-icon {
  color: inherit;
}

.list-item-prepend-icon {
  font-size: var(--list-item-icon-size);
  height: var(--list-item-icon-size);
  width: var(--list-item-icon-size);
}

.list-item-append-icon {
  font-size: var(--list-item-icon-size);
  height: var(--list-item-icon-size);
  width: var(--list-item-icon-size);
}

.list-item-image-icon {
  border-radius: var(--rounded-sm);
  display: block;
  object-fit: cover;
}

.list-item-prepend-image {
  height: var(--list-item-icon-size);
  width: var(--list-item-icon-size);
}

.list-item-append-image {
  height: var(--list-item-icon-size);
  width: var(--list-item-icon-size);
}

.list-item-prepend-image.flagcdn-icon {
  min-width: var(--list-item-icon-size);
  width: auto;
}

.list-item-append-image.flagcdn-icon {
  min-width: var(--list-item-icon-size);
  width: auto;
}
</style>
