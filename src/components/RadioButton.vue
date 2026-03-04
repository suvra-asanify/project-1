<template>
  <div
    class="radio-button"
    :class="rootClasses"
    role="radio"
    :aria-checked="isChecked ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
  >
    <div class="radio-state-layer">
      <v-selection-control
        class="radio-control"
        :class="controlClasses"
        type="radio"
        :model-value="isChecked"
        :true-value="true"
        :false-value="false"
        :label="undefined"
        :disabled="disabled"
        :ripple="false"
        v-bind="$attrs"
        @update:modelValue="onUpdate"
      />
    </div>

    <div v-if="showLabel" class="radio-label">
      <slot :label="displayLabel" :value="isChecked" :disabled="disabled">
        {{ displayLabel }}
      </slot>
    </div>
  </div>
</template>

<script>
import {
  RADIO_BUTTON_DEFAULT_LABEL,
  useRadioButton,
} from '../composables/useRadioButton';

export default {
  name: 'radio-button',
  inheritAttrs: false,
  emits: ['update:value', 'update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      default: null,
    },
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: RADIO_BUTTON_DEFAULT_LABEL,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return useRadioButton(props);
  },
  methods: {
    onUpdate(nextValue) {
      const normalizedValue = nextValue === true;
      this.$emit('update:value', normalizedValue);
      this.$emit('update:modelValue', normalizedValue);
    },
  },
};
</script>

<style scoped>
.radio-button {
  --radio-color-primary: rgba(0, 0, 0, 0.87);
  --radio-color-unchecked: rgba(0, 0, 0, 0.522);
  --radio-state-hover: rgba(0, 0, 0, 0.035);
  --radio-state-pressed: rgba(0, 0, 0, 0.157);
  --radio-color-disabled: rgba(0, 0, 0, 0.38);

  align-items: center;
  color: var(--radio-color-primary);
  display: inline-flex;
  min-height: var(--base-40);
  min-width: var(--base-40);
  user-select: none;
}

.radio-state-layer {
  align-items: center;
  border-radius: var(--rounded-xl);
  display: inline-flex;
  justify-content: center;
  height: var(--base-40);
  width: var(--base-40);
}

.radio-button:not(.disabled):hover .radio-state-layer {
  background: var(--radio-state-hover);
}

.radio-button:not(.disabled):active .radio-state-layer {
  background: var(--radio-state-pressed);
}

.radio-control :deep(.v-selection-control) {
  align-items: center;
  color: inherit;
  display: inline-flex;
  gap: 0;
}

.radio-control :deep(.v-selection-control__wrapper) {
  align-items: center;
  display: inline-flex;
  height: var(--base-40);
  justify-content: center;
  width: var(--base-40);
}

.radio-control :deep(.v-selection-control__input) {
  background: var(--white);
  border: var(--border-md) solid var(--radio-color-unchecked);
  border-radius: var(--rounded-pill);
  height: var(--base-24);
  position: relative;
  width: var(--base-24);
}

.radio-control :deep(.v-selection-control__input::before) {
  display: none;
}

.radio-control :deep(.v-selection-control__input > .v-icon) {
  display: none;
}

.radio-control.radio-control--checked :deep(.v-selection-control__input) {
  border-color: var(--radio-color-primary);
}

.radio-control.radio-control--checked :deep(.v-selection-control__input::after) {
  background: var(--radio-color-primary);
  border-radius: var(--rounded-pill);
  content: '';
  height: var(--base-12);
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--base-12);
}

.radio-control :deep(.v-label) {
  color: inherit;
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--label-base-lh);
  opacity: 1;
}

.radio-button.disabled .radio-control :deep(.v-selection-control__input) {
  border-color: var(--radio-color-disabled);
}

.radio-control.radio-control--checked.radio-control--disabled :deep(.v-selection-control__input::after) {
  background: var(--radio-color-disabled);
}

.radio-label {
  color: inherit;
  display: inline-flex;
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--label-base-lh);
  margin-left: var(--spacing-0);
  min-width: 26px;
}

.radio-button.disabled .radio-label {
  color: var(--radio-color-disabled);
}

.radio-button.disabled {
  cursor: not-allowed;
}
</style>
