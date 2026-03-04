<template>
  <div class="progress-linear" :class="rootClasses">
    <div v-if="showLimit" class="progress-linear__labels">
      <span>{{ currentValue }}</span>
      <span>{{ limitValue }}</span>
    </div>

    <v-progress-linear
      class="progress-linear__track"
      :class="fillClasses"
      :height="trackHeight"
      :model-value="fillPercent"
      :rounded="applyRounded"
      v-bind="$attrs"
    >
      <slot
        :range="normalizedRange"
        :value="fillPercent"
        :count="countText"
        :percentage="showPercentage"
      >
        <div v-if="showLabel" class="progress-linear__label">
          <span>{{ countText }}</span>
          <span v-if="showPercentage">%</span>
        </div>
      </slot>
    </v-progress-linear>
  </div>
</template>

<script>
import {
  PROGRESS_LINEAR_RANGES,
  PROGRESS_LINEAR_SIZES,
  useProgressLinear,
} from '../composables/useProgressLinear';

export default {
  name: 'progress-linear',
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return PROGRESS_LINEAR_SIZES.includes(value);
      },
    },
    range: {
      type: String,
      default: '1/5',
      validator(value) {
        return PROGRESS_LINEAR_RANGES.includes(value);
      },
    },
    // Backward compatible alias for older usage.
    value: {
      type: [String, Number],
      default: null,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    count: {
      type: [String, Number],
      default: 25,
    },
    percentage: {
      type: Boolean,
      default: true,
    },
    currentLimit: {
      type: Boolean,
      default: true,
    },
    current: {
      type: String,
      default: '₹0.00',
    },
    limit: {
      type: String,
      default: '₹50,000.00',
    },
  },
  setup(props) {
    return useProgressLinear(props);
  },
};
</script>

<style scoped>
.progress-linear {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.progress-linear__labels {
  color: var(--black-60);
  display: flex;
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-semibold);
  justify-content: space-between;
  line-height: var(--label-base-lh);
  white-space: nowrap;
}

.progress-linear__track {
  width: 100%;
}

.progress-linear__track :deep(.v-progress-linear__background) {
  background-color: var(--green-darken-1) !important;
  opacity: 0.12 !important;
}

.progress-linear__track :deep(.v-progress-linear__determinate) {
  background-color: var(--green-darken-1) !important;
}

.progress-linear__track:not(.progress-linear__fill--partial):not(.progress-linear__fill--rounded) :deep(.v-progress-linear__determinate) {
  border-radius: 0;
}

.progress-linear__track.progress-linear__fill--partial :deep(.v-progress-linear__determinate) {
  border-radius: 0 var(--rounded-md) var(--rounded-md) 0;
}

.progress-linear__track.progress-linear__fill--rounded :deep(.v-progress-linear__determinate) {
  border-radius: var(--rounded-md);
}

.progress-linear__label {
  align-items: center;
  color: var(--black-87);
  display: inline-flex;
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-semibold);
  gap: 0;
  line-height: var(--label-base-lh);
  white-space: nowrap;
}
</style>
