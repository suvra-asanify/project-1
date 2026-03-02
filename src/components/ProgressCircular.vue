<template>
  <div class="progress-circular" :class="rootClasses" :style="rootStyles">
    <span class="progress-circular__label">{{ displayLabel }}</span>
  </div>
</template>

<script>
import {
  PROGRESS_CIRCULAR_SIZES,
  useProgressCircular,
} from '../composables/useProgressCircular';

export default {
  name: 'progress-circular',

  props: {
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return PROGRESS_CIRCULAR_SIZES.includes(value);
      },
    },
    // Backend determinate value (0-100).
    progress: {
      type: [Number, String],
      default: 25,
    },
    // Backend label for values like "1/4", "80%", etc.
    label: {
      type: String,
      default: 'label',
    },
  },

  setup(props) {
    return useProgressCircular(props);
  },
};
</script>

<style scoped>
.progress-circular {
  --progress-circular-fill: 0;
  --progress-circular-size: var(--base-54);
  --progress-circular-stroke: var(--base-4);
  --progress-circular-label-size: var(--base-22);

  align-items: center;
  background: conic-gradient(
    var(--green-darken-1) calc(var(--progress-circular-fill) * 1%),
    var(--color-border-primary, rgba(0, 0, 0, 0.12)) 0
  );
  border-radius: var(--rounded-pill);
  display: inline-flex;
  height: var(--progress-circular-size);
  justify-content: center;
  position: relative;
  width: var(--progress-circular-size);
}

.progress-circular::before {
  background: var(--color-surface-primary, #fff);
  border-radius: var(--rounded-pill);
  content: '';
  inset: var(--progress-circular-stroke);
  position: absolute;
}

.progress-circular.size-small {
  --progress-circular-size: var(--base-36);
  --progress-circular-label-size: var(--base-16);
}

.progress-circular.size-large {
  --progress-circular-size: var(--base-80);
  --progress-circular-label-size: var(--base-28);
}

.progress-circular__label {
  color: var(--black-87);
  font-size: var(--progress-circular-label-size);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  position: relative;
  z-index: 1;
}
</style>
