<template>
  <div class="progress-linear" :class="rootClasses">
    <div v-if="showLimit" class="progress-linear__labels">
      <span>{{ current }}</span>
      <span>{{ limit }}</span>
    </div>

    <div class="progress-linear__track" :class="trackClasses">
      <div class="progress-linear__background" />
      <div
        class="progress-linear__fill"
        :class="fillClasses"
        :style="{ width: `${fillPercent}%` }"
      />

      <div v-if="showLabel" class="progress-linear__label">
        {{ displayLabel }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  PROGRESS_LINEAR_SIZES,
  useProgressLinear,
} from '../composables/useProgressLinear';

export default {
  name: 'progress-linear',

  props: {
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return PROGRESS_LINEAR_SIZES.includes(value);
      },
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    // Single backend value (e.g. "50%", "2/4", "Full"): drives label + fill.
    value: {
      type: [Number, String],
      default: '1/5',
    },
    current: {
      type: String,
      default: '',
    },
    limit: {
      type: String,
      default: '',
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
  height: var(--base-10);
  position: relative;
  width: 100%;
}

.progress-linear__track--large {
  height: var(--base-20);
}

.progress-linear__track--rounded {
  border-radius: var(--rounded-md);
  overflow: hidden;
}

.progress-linear__background {
  background-color: var(--green-12);
  inset: 0;
  position: absolute;
}

.progress-linear__fill {
  background-color: var(--green-darken-1);
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
}

.progress-linear__fill--partial {
  border-radius: 0 var(--rounded-md) var(--rounded-md) 0;
}

.progress-linear__fill--rounded {
  border-radius: var(--rounded-md);
}

.progress-linear__label {
  color: var(--black-87);
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-semibold);
  left: 50%;
  line-height: var(--label-base-lh);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}
</style>
