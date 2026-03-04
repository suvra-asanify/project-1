<template>
  <v-chip
    class="chip"
    :class="rootClasses"
    :variant="variant"
    :closable="showClose"
    :close-icon="'mdi-close-circle'"
    :disabled="disabled"
    :ripple="false"
    v-bind="$attrs"
  >
    <template v-if="$slots.prepend || showPrependIcon" #prepend>
      <slot
        name="prepend"
        :icon="prependIconConfig"
        :disabled="disabled"
        :variant="variant"
        :color="normalizedColor"
        :size="size"
      >
        <v-icon v-if="prependIconConfig.type === 'mdi'" class="chip-icon">
          {{ prependIconConfig.icon }}
        </v-icon>
        <img
          v-else
          class="chip-image-icon"
          :src="prependIconConfig.src"
          :alt="prependIconConfig.alt"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          loading="lazy"
        />
      </slot>
    </template>

    <slot
      :label="normalizedLabel"
      :disabled="disabled"
      :variant="variant"
      :color="normalizedColor"
      :size="size"
      :icon-only="isIconOnly"
    >
      <span v-if="showLabel">{{ normalizedLabel }}</span>
    </slot>

    <template v-if="!showClose && ($slots.append || showAppendIcon)" #append>
      <slot
        name="append"
        :icon="appendIconConfig"
        :disabled="disabled"
        :variant="variant"
        :color="normalizedColor"
        :size="size"
      >
        <v-icon v-if="appendIconConfig.type === 'mdi'" class="chip-icon">
          {{ appendIconConfig.icon }}
        </v-icon>
        <img
          v-else
          class="chip-image-icon"
          :src="appendIconConfig.src"
          :alt="appendIconConfig.alt"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          loading="lazy"
        />
      </slot>
    </template>

    <template v-if="$slots.close" #close="slotProps">
      <slot name="close" v-bind="slotProps" />
    </template>

    <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </v-chip>
</template>

<script>
import { computed } from 'vue';
import {
  CHIP_COLORS,
  CHIP_DEFAULT_ICON,
  CHIP_DEFAULT_LABEL,
  CHIP_SIZE_KEYS,
  CHIP_VARIANTS,
  useChip,
} from '../composables/useChip';

export default {
  name: 'chip',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'flat',
      validator(value) {
        return CHIP_VARIANTS.includes(value);
      },
    },
    color: {
      type: String,
      default: 'default',
      validator(value) {
        return CHIP_COLORS.includes(String(value).toLowerCase());
      },
    },
    closable: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return CHIP_SIZE_KEYS.includes(value);
      },
    },
    label: {
      type: String,
      default: CHIP_DEFAULT_LABEL,
    },
    prependIcon: {
      type: String,
      default: CHIP_DEFAULT_ICON,
    },
    appendIcon: {
      type: String,
      default: CHIP_DEFAULT_ICON,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const chipState = useChip(props);
    const forwardedSlotNames = computed(() => (
      Object.keys(slots).filter((name) => !['default', 'prepend', 'append', 'close'].includes(name))
    ));

    return {
      ...chipState,
      forwardedSlotNames,
    };
  },
};
</script>

<style scoped>
.chip {
  --chip-height: var(--base-24);
  --chip-icon-size: var(--base-16);
  --chip-padding-inline: 6px;
  --chip-close-size: var(--base-28);
  --chip-font-size: var(--label-sm-size);
  --chip-font-lh: var(--label-sm-lh);
  --chip-bg-flat: #e3e3e3;
  --chip-bg-flat-closable: var(--black-12);
  --chip-bg-tonal: #e0f4fd;
  --chip-fg-flat: var(--black-87);
  --chip-fg-tonal: var(--primary, #005a9c);

  border-radius: var(--rounded-md) !important;
  color: var(--chip-fg-flat);
  cursor: default;
  font-size: var(--chip-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--chip-font-lh);
  min-height: var(--chip-height);
  opacity: 1;
  padding-inline: var(--chip-padding-inline) !important;
}

.chip :deep(.v-chip__overlay) {
  display: none;
}

.chip :deep(.v-chip__underlay) {
  opacity: 0;
}

.chip :deep(.v-chip__content) {
  align-items: center;
  display: inline-flex;
  gap: var(--spacing-1);
  line-height: inherit;
  padding: 0;
}

.chip :deep(.v-chip__content > span) {
  color: inherit;
  display: inline-flex;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  white-space: nowrap;
}

.chip :deep(.v-chip__prepend),
.chip :deep(.v-chip__append) {
  align-items: center;
  display: inline-flex;
  margin: 0;
}

.chip-icon,
.chip :deep(.v-chip__prepend .v-icon),
.chip :deep(.v-chip__append .v-icon) {
  color: inherit;
  font-size: var(--chip-icon-size);
  height: var(--chip-icon-size);
  width: var(--chip-icon-size);
}

.chip-image-icon {
  border-radius: 2px;
  display: block;
  height: var(--chip-icon-size);
  object-fit: cover;
  width: var(--chip-icon-size);
}

.chip.variant-flat {
  background: var(--chip-bg-flat) !important;
  color: var(--chip-fg-flat);
}

.chip.variant-flat.closable {
  background: var(--chip-bg-flat-closable) !important;
}

.chip.variant-tonal {
  background: var(--chip-bg-tonal) !important;
  color: var(--chip-fg-tonal);
}

.chip.color-success {
  --chip-bg-flat: var(--green-lighten-4);
  --chip-bg-flat-closable: var(--green-lighten-3);
  --chip-bg-tonal: var(--green-lighten-5);
  --chip-fg-flat: var(--green-darken-4);
  --chip-fg-tonal: var(--green-darken-4);
}

.chip.color-warning {
  --chip-bg-flat: var(--amber-lighten-4);
  --chip-bg-flat-closable: var(--amber-lighten-3);
  --chip-bg-tonal: var(--amber-lighten-5);
  --chip-fg-flat: var(--amber-darken-4);
  --chip-fg-tonal: var(--amber-darken-4);
}

.chip.color-error {
  --chip-bg-flat: var(--red-lighten-4);
  --chip-bg-flat-closable: var(--red-lighten-3);
  --chip-bg-tonal: var(--red-lighten-5);
  --chip-fg-flat: var(--red-darken-4);
  --chip-fg-tonal: var(--red-darken-4);
}

.chip.color-neutral {
  --chip-bg-flat: var(--bluegrey-lighten-4);
  --chip-bg-flat-closable: var(--bluegrey-lighten-3);
  --chip-bg-tonal: var(--bluegrey-lighten-5);
  --chip-fg-flat: var(--bluegrey-darken-4);
  --chip-fg-tonal: var(--bluegrey-darken-4);
}

.chip.color-pink {
  --chip-bg-flat: var(--pink-lighten-4);
  --chip-bg-flat-closable: var(--pink-lighten-3);
  --chip-bg-tonal: var(--pink-lighten-5);
  --chip-fg-flat: var(--pink-accent-4);
  --chip-fg-tonal: var(--pink-accent-4);
}

.chip.color-purple {
  --chip-bg-flat: var(--purple-lighten-4);
  --chip-bg-flat-closable: var(--purple-lighten-3);
  --chip-bg-tonal: var(--purple-lighten-5);
  --chip-fg-flat: var(--purple-accent-4);
  --chip-fg-tonal: var(--purple-accent-4);
}

.chip.color-deeppurple {
  --chip-bg-flat: var(--deeppurple-lighten-4);
  --chip-bg-flat-closable: var(--deeppurple-lighten-3);
  --chip-bg-tonal: var(--deeppurple-lighten-5);
  --chip-fg-flat: var(--deeppurple-accent-4);
  --chip-fg-tonal: var(--deeppurple-accent-4);
}

.chip.color-indigo {
  --chip-bg-flat: var(--indigo-lighten-4);
  --chip-bg-flat-closable: var(--indigo-lighten-3);
  --chip-bg-tonal: var(--indigo-lighten-5);
  --chip-fg-flat: var(--indigo-accent-4);
  --chip-fg-tonal: var(--indigo-accent-4);
}

.chip.color-lightblue {
  --chip-bg-flat: var(--lightblue-lighten-4);
  --chip-bg-flat-closable: var(--lightblue-lighten-3);
  --chip-bg-tonal: var(--lightblue-lighten-5);
  --chip-fg-flat: var(--lightblue-accent-4);
  --chip-fg-tonal: var(--lightblue-accent-4);
}

.chip.color-cyan {
  --chip-bg-flat: var(--cyan-lighten-4);
  --chip-bg-flat-closable: var(--cyan-lighten-3);
  --chip-bg-tonal: var(--cyan-lighten-5);
  --chip-fg-flat: var(--cyan-accent-4);
  --chip-fg-tonal: var(--cyan-accent-4);
}

.chip.color-teal {
  --chip-bg-flat: var(--teal-lighten-4);
  --chip-bg-flat-closable: var(--teal-lighten-3);
  --chip-bg-tonal: var(--teal-lighten-5);
  --chip-fg-flat: var(--teal-accent-4);
  --chip-fg-tonal: var(--teal-accent-4);
}

.chip.color-lightgreen {
  --chip-bg-flat: var(--lightgreen-lighten-4);
  --chip-bg-flat-closable: var(--lightgreen-lighten-3);
  --chip-bg-tonal: var(--lightgreen-lighten-5);
  --chip-fg-flat: var(--lightgreen-accent-4);
  --chip-fg-tonal: var(--lightgreen-accent-4);
}

.chip.color-lime {
  --chip-bg-flat: var(--lime-lighten-4);
  --chip-bg-flat-closable: var(--lime-lighten-3);
  --chip-bg-tonal: var(--lime-lighten-5);
  --chip-fg-flat: var(--lime-accent-4);
  --chip-fg-tonal: var(--lime-accent-4);
}

.chip.color-yellow {
  --chip-bg-flat: var(--yellow-lighten-4);
  --chip-bg-flat-closable: var(--yellow-lighten-3);
  --chip-bg-tonal: var(--yellow-lighten-5);
  --chip-fg-flat: var(--yellow-accent-4);
  --chip-fg-tonal: var(--yellow-accent-4);
}

.chip.color-amber {
  --chip-bg-flat: var(--amber-lighten-4);
  --chip-bg-flat-closable: var(--amber-lighten-3);
  --chip-bg-tonal: var(--amber-lighten-5);
  --chip-fg-flat: var(--amber-accent-4);
  --chip-fg-tonal: var(--amber-accent-4);
}

.chip.color-deeporange {
  --chip-bg-flat: var(--deeporange-lighten-4);
  --chip-bg-flat-closable: var(--deeporange-lighten-3);
  --chip-bg-tonal: var(--deeporange-lighten-50);
  --chip-fg-flat: var(--deeporange-accent-4);
  --chip-fg-tonal: var(--deeporange-accent-4);
}

.chip.closable {
  min-height: var(--chip-close-size);
  padding-inline-end: var(--spacing-1) !important;
}

.chip :deep(.v-chip__close) {
  align-items: center;
  border-radius: var(--rounded-md);
  color: inherit;
  display: inline-flex;
  flex: 0 0 var(--chip-close-size);
  height: var(--chip-close-size);
  justify-content: center;
  margin-inline-start: 0 !important;
  margin-inline-end: 0 !important;
  opacity: 1;
  overflow: visible;
  width: var(--chip-close-size);
}

.chip :deep(.v-chip__close .v-icon) {
  font-size: var(--base-20);
  height: var(--base-20);
  overflow: visible;
  width: var(--base-20);
}

.chip.rounded {
  border-radius: var(--rounded-pill) !important;
}

.chip.rounded :deep(.v-chip__close) {
  border-radius: var(--rounded-pill);
}

.chip.icon-only {
  --chip-height: var(--base-36);
  --chip-padding-inline: var(--spacing-2);

  justify-content: center;
  min-width: var(--chip-height);
  width: var(--chip-height);
}

.chip.icon-only :deep(.v-chip__content) {
  justify-content: center;
}

.chip.size-small {
  --chip-height: var(--base-20);
  --chip-icon-size: var(--base-14);
  --chip-padding-inline: var(--spacing-1);
  --chip-close-size: var(--base-24);
  --chip-font-size: var(--label-xs-size);
  --chip-font-lh: var(--label-xs-lh);
}

.chip.size-large {
  --chip-height: var(--base-28);
  --chip-icon-size: var(--base-18);
  --chip-padding-inline: var(--spacing-2);
  --chip-close-size: var(--base-32);
  --chip-font-size: var(--label-base-size);
  --chip-font-lh: var(--label-base-lh);
}

.chip.size-small.icon-only {
  --chip-height: var(--base-32);
}

.chip.size-large.icon-only {
  --chip-height: var(--base-40);
}

.chip.disabled {
  cursor: not-allowed !important;
  opacity: 0.56 !important;
}

.chip.disabled :deep(.v-chip__close),
.chip.disabled .chip-icon,
.chip.disabled :deep(.v-chip__prepend .v-icon),
.chip.disabled :deep(.v-chip__append .v-icon) {
  color: inherit !important;
}
</style>

