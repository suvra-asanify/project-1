<template>
  <!-- Root wrapper carries public state classes for consumer hooks -->
  <div
    class="radio-button"
    :class="rootClasses"
    role="radio"
    :aria-checked="isChecked ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
  >
    <!-- State layer mirrors Figma default / hover / pressed visuals -->
    <div class="radio-state-layer">
      <div class="radio-control" :class="controlClasses">
        <span v-if="isChecked" class="radio-dot" />
      </div>
    </div>

    <template v-if="showLabel">
      <slot :label="displayLabel" :value="isChecked" :disabled="disabled">
        <span class="radio-label">{{ displayLabel }}</span>
      </slot>
    </template>
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
  // Keep all state/label class logic centralized in composable for scalability.
  setup(props) {
    return useRadioButton(props);
  },
};
</script>

<style scoped>
.radio-button {
  align-items: center;
  color: var(--black-87);
  display: inline-flex;
  gap: var(--spacing-2);
  min-height: var(--base-24);
  user-select: none;
}

.radio-state-layer {
  align-items: center;
  border-radius: var(--rounded-pill);
  display: inline-flex;
  height: var(--base-40);
  justify-content: center;
  width: var(--base-40);
}

.radio-button.state-hover .radio-state-layer {
  background: var(--black-04);
}

.radio-button.state-pressed .radio-state-layer {
  background: var(--black-12);
}

.radio-control {
  align-items: center;
  background: var(--white);
  border: var(--border-md) solid var(--black-54);
  border-radius: var(--rounded-pill);
  box-sizing: border-box;
  display: inline-flex;
  height: var(--base-24);
  justify-content: center;
  width: var(--base-24);
}

.radio-control--checked {
  border-color: var(--black-87);
}

.radio-dot {
  background: var(--black-87);
  border-radius: var(--rounded-pill);
  display: block;
  height: var(--base-12);
  width: var(--base-12);
}

.radio-button.disabled .radio-state-layer {
  background: var(--black-12);
}

.radio-control--disabled {
  border-color: var(--black-38);
}

.radio-control--disabled .radio-dot {
  background: var(--black-38);
}

.radio-label {
  color: inherit;
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--label-base-lh);
}

.radio-button.disabled .radio-label {
  color: var(--black-38);
}
</style>
