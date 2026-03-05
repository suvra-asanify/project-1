<template>
  <v-list
    class="list"
    :class="rootClasses"
    :style="listStyles"
    :lines="false"
    density="comfortable"
    nav
    role="listbox"
    v-bind="forwardedAttrs"
  >
    <div class="list-body">
      <slot
        name="items"
        :items="normalizedItems"
        :selected="selectedValue"
        :select="selectItem"
      >
        <slot
          v-for="(item, index) in normalizedItems"
          :key="item.key"
          name="item"
          :item="item.raw"
          :index="index + 1"
          :value="item.value"
          :selected="isItemSelected(item)"
          :select="selectItem"
        >
          <list-item
            class="list-row"
            v-bind="item.listItemProps"
            :selected="isItemSelected(item)"
            @click="onItemClick($event, item, index)"
            @update:selected="onItemSelectedUpdate(item, $event)"
          >
            <template v-if="$slots.prepend" #prepend>
              <slot
                name="prepend"
                :item="item.raw"
                :index="index + 1"
                :value="item.value"
                :selected="isItemSelected(item)"
              />
            </template>

            <template #title>
              <slot
                name="title"
                :item="item.raw"
                :index="index + 1"
                :value="item.value"
                :label="item.listItemProps.label"
                :selected="isItemSelected(item)"
              >
                <span class="list-row-title">{{ item.listItemProps.label }}</span>
              </slot>
            </template>

            <template v-if="$slots.append" #append>
              <slot
                name="append"
                :item="item.raw"
                :index="index + 1"
                :value="item.value"
                :selected="isItemSelected(item)"
              />
            </template>
          </list-item>
        </slot>
      </slot>
    </div>

    <div v-if="showScrollbar" class="list-scrollbar" aria-hidden="true">
      <div class="list-scrollbar-thumb" :style="scrollbarThumbStyles" />
    </div>

    <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </v-list>
</template>

<script>
import { computed, useAttrs } from 'vue';
import {
  LIST_DEFAULT_MAX_HEIGHT,
  useList,
} from '../composables/useList';
import ListItem from './ListItem.vue';
import { useForwardSlots } from '../shared/useForwardSlots';

function areValuesEqual(left, right) {
  return String(left) === String(right);
}

export default {
  name: 'list',
  components: { ListItem },
  inheritAttrs: false,
  emits: ['update:selected', 'update:value', 'click:item'],
  props: {
    maxHeight: {
      type: Number,
      default: LIST_DEFAULT_MAX_HEIGHT,
    },
  },
  setup(props, { slots, emit }) {
    const attrs = useAttrs();
    const listState = useList(props, attrs);
    const forwardedSlotNames = useForwardSlots(slots, [
      'default',
      'items',
      'item',
      'title',
      'prepend',
      'append',
    ]);

    const forwardedAttrs = computed(() => {
      const rest = {};
      Object.keys(attrs).forEach((key) => {
        if (!['items', 'value'].includes(key)) {
          rest[key] = attrs[key];
        }
      });
      return rest;
    });

    const resolveItemValue = (candidate) => (
      candidate && typeof candidate === 'object' && 'value' in candidate
        ? candidate.value
        : candidate
    );

    const isItemSelected = (item) => (
      listState.selectedValue.value != null
      && areValuesEqual(item.value, listState.selectedValue.value)
    );

    const selectItem = (candidate) => {
      const value = resolveItemValue(candidate);
      if (value == null || value === '') {
        return;
      }

      const matched = listState.normalizedItems.value.find((item) =>
        areValuesEqual(item.value, value)
      );

      if (!matched) {
        return;
      }

      listState.selectedValue.value = matched.value;
      emit('update:selected', matched.value);
      emit('update:value', matched.value);
    };

    const onItemClick = (event, item, index) => {
      selectItem(item.value);
      emit('click:item', {
        event,
        index: index + 1,
        key: item.key,
        value: item.value,
        item: item.raw,
      });
    };

    const onItemSelectedUpdate = (item, nextValue) => {
      if (nextValue === true) {
        selectItem(item.value);
      }
    };

    return {
      ...listState,
      forwardedSlotNames,
      forwardedAttrs,
      selectItem,
      isItemSelected,
      onItemClick,
      onItemSelectedUpdate,
    };
  },
};
</script>

<style scoped>
.list {
  --list-width: 302px;
  --list-row-height: var(--base-48);
  --list-scrollbar-size: var(--base-10);
  --list-scrollbar-bg: #ffe0b2;
  --list-scrollbar-thumb-bg: #ffc977;

  background: var(--white, #ffffff);
  border-radius: var(--rounded-md) !important;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.12);
  color: var(--black-87);
  display: flex;
  gap: var(--spacing-0);
  isolation: isolate;
  overflow: hidden;
  padding: var(--spacing-0) !important;
  width: var(--list-width);
}

.list :deep(.v-list__overlay),
.list :deep(.v-list__underlay) {
  display: none;
}

.list-body {
  -ms-overflow-style: none;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--spacing-0);
  max-height: var(--list-max-height);
  min-height: var(--base-0);
  min-width: var(--base-0);
  overflow-y: auto;
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-0);
  position: relative;
  scrollbar-width: none;
  z-index: 2;
}

.list.no-scrollbar .list-body {
  overflow-y: hidden;
}

.list-body::-webkit-scrollbar {
  display: none;
}

.list-row-title {
  color: var(--black-87);
  display: block;
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list :deep(.list-row.list-item) {
  border-radius: var(--rounded-0);
  max-width: none;
  min-height: var(--list-row-height);
}

.list.empty .list-body {
  min-height: var(--base-120);
}

.list-scrollbar {
  align-self: stretch;
  background: var(--list-scrollbar-bg);
  border-radius: var(--rounded-pill);
  flex: 0 0 var(--list-scrollbar-size);
  overflow: hidden;
  position: relative;
  width: var(--list-scrollbar-size);
  z-index: 1;
}

.list-scrollbar-thumb {
  background: var(--list-scrollbar-thumb-bg);
  border-radius: var(--rounded-pill);
  left: var(--spacing-0);
  position: absolute;
  right: var(--spacing-0);
}
</style>
