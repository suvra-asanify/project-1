<template>
  <div class="progress-linear" :class="rootClasses">
    <div v-if="showLimit" class="progress-linear__labels">
      <span v-if="currentValue">{{ currentValue }}</span>
      <span v-if="limitValue" class="progress-linear__limit">{{ limitValue }}</span>
    </div>

    <v-progress-linear
      class="progress-linear__track"
      :height="trackHeight"
      :model-value="fillPercent"
      v-bind="$attrs"
    >
      <slot
        :count="normalizedCount"
        :range="normalizedRange"
        :value="fillPercent"
        :label="labelText"
        :current="currentValue"
        :limit="limitValue"
      >
        <div v-if="showLabel" class="progress-linear__label">
          <span>{{ labelText }}</span>
        </div>
      </slot>
    </v-progress-linear>
  </div>
</template>

<script>
import {
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
    value: {
      type: [String, Number],
      default: null,
    },
    count: {
      type: [String, Number],
      default: '1/5',
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    current: {
      type: [String, Number],
      default: null,
    },
    limit: {
      type: [String, Number],
      default: null,
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
  line-height: var(--label-base-lh);
  white-space: nowrap;
}

.progress-linear__limit {
  margin-left: auto;
}

.progress-linear__track {
  width: 100%;
}

.progress-linear.rounded .progress-linear__track {
  border-radius: 4px !important;
  overflow: hidden;
}

.progress-linear:not(.rounded) .progress-linear__track {
  border-radius: 0 !important;
  overflow: hidden;
}

.progress-linear__track :deep(.v-progress-linear__background) {
  background-color: var(--green-darken-1) !important;
  opacity: 0.12 !important;
}

.progress-linear__track :deep(.v-progress-linear__determinate) {
  background-color: var(--green-darken-1) !important;
}

.progress-linear.rounded .progress-linear__track :deep(.v-progress-linear__background),
.progress-linear.rounded .progress-linear__track :deep(.v-progress-linear__determinate) {
  border-radius: 4px !important;
}

.progress-linear:not(.rounded) .progress-linear__track :deep(.v-progress-linear__background),
.progress-linear:not(.rounded) .progress-linear__track :deep(.v-progress-linear__determinate) {
  border-radius: 0 !important;
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
