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
        :label="showLabel ? displayLabel : undefined"
        :disabled="disabled"
        :ripple="false"
        v-bind="$attrs"
        @update:modelValue="onUpdate"
      >
        <template v-if="showLabel && $slots.default" #label>
          <slot :label="displayLabel" :value="isChecked" :disabled="disabled" />
        </template>
      </v-selection-control>
    </div>
  </div>
</template>

<script>
import {
  RADIO_BUTTON_DEFAULT_LABEL,
  RADIO_BUTTON_STATES,
  useRadioButton,
} from '../composables/useRadioButton';

export default {
  name: 'radio-button',
  inheritAttrs: false,
  emits: ['update:value', 'update:modelValue'],
  props: {
    state: {
      type: String,
      default: 'default',
      validator(value) {
        return RADIO_BUTTON_STATES.includes(value);
      },
    },
    value: {
      type: Boolean,
      default: false,
    },
    hasLabel: {
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
  align-items: center;
  color: var(--black-87);
  display: inline-flex;
  min-height: var(--base-24);
  user-select: none;
}

.radio-state-layer {
  align-items: center;
  border-radius: var(--rounded-pill);
  display: inline-flex;
  justify-content: center;
  min-height: var(--base-40);
}

.radio-button.state-hover .radio-state-layer {
  background: var(--black-04);
}

.radio-button.state-pressed .radio-state-layer {
  background: var(--black-12);
}

.radio-control :deep(.v-selection-control) {
  align-items: center;
  color: inherit;
  display: inline-flex;
  gap: var(--spacing-2);
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
  border: var(--border-md) solid var(--black-54);
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

.radio-control :deep(.v-selection-control--dirty .v-selection-control__input) {
  border-color: var(--black-87);
}

.radio-control :deep(.v-selection-control--dirty .v-selection-control__input::after) {
  background: var(--black-87);
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

.radio-button.disabled .radio-state-layer {
  background: var(--black-12);
}

.radio-control.radio-control--disabled :deep(.v-selection-control__input) {
  border-color: var(--black-38);
}

.radio-control.radio-control--disabled :deep(.v-selection-control--dirty .v-selection-control__input::after) {
  background: var(--black-38);
}

.radio-button.disabled :deep(.v-label) {
  color: var(--black-38);
}
</style>
