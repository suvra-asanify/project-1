<template>
  <v-progress-circular
    class="progress-circular"
    :class="rootClasses"
    :size="vuetifySize"
    :width="4"
    :model-value="fillPercent"
    color="green-darken-1"
    v-bind="$attrs"
  >
    <slot :label="displayLabel" :value="fillPercent">
      <span class="progress-circular__label">{{ displayLabel }}</span>
    </slot>
  </v-progress-circular>
</template>

<script>
import {
  PROGRESS_CIRCULAR_SIZES,
  useProgressCircular,
} from '../composables/useProgressCircular';

export default {
  name: 'progress-circular',
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return PROGRESS_CIRCULAR_SIZES.includes(value);
      },
    },
    value: {
      type: [Number, String],
      default: '1/4',
    },
    progress: {
      type: [Number, String],
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return useProgressCircular(props);
  },
};
</script>

<style scoped>
.progress-circular {
  color: var(--green-darken-1);
}

.progress-circular :deep(.v-progress-circular__underlay) {
  color: var(--color-border-primary, rgba(0, 0, 0, 0.12));
  opacity: 1;
}

.progress-circular__label {
  color: var(--black-87);
  font-size: var(--base-22);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}

.progress-circular.size-small .progress-circular__label {
  font-size: var(--base-16);
}

.progress-circular.size-large .progress-circular__label {
  font-size: var(--base-28);
}
</style>
