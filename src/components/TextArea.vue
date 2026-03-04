<template>
  <v-textarea
    v-model="inputValue"
    class="text-area"
    :class="rootClasses"
    variant="outlined"
    :placeholder="normalizedPlaceholder"
    :disabled="disabled"
    :maxlength="resolvedTotalChar || undefined"
    :hide-details="$slots.details || showHint || seeCharCount ? false : 'auto'"
    rows="4"
    flat
    v-bind="$attrs"
  >
    <template v-if="$slots.details || showHint || seeCharCount" #details>
      <slot name="details" :hint="normalizedHint" :counter="counterText">
        <div class="text-area-meta">
          <span v-if="showHint" class="text-area-hint">{{ normalizedHint }}</span>
          <span v-if="seeCharCount" class="text-area-counter">{{ counterText }}</span>
        </div>
      </slot>
    </template>
  </v-textarea>
</template>

<script>
import {
  TEXT_AREA_DEFAULT_HINT,
  TEXT_AREA_DEFAULT_INPUT,
  TEXT_AREA_DEFAULT_PLACEHOLDER,
  TEXT_AREA_STATES,
  useTextArea,
} from '../composables/useTextArea';

export default {
  name: 'TextArea',
  inheritAttrs: false,
  emits: ['update:input'],
  props: {
    state: {
      type: String,
      default: 'default',
      validator(value) {
        return TEXT_AREA_STATES.includes(value);
      },
    },
    placeholder: {
      type: String,
      default: TEXT_AREA_DEFAULT_PLACEHOLDER,
    },
    input: {
      type: String,
      default: TEXT_AREA_DEFAULT_INPUT,
    },
    hasHint: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: TEXT_AREA_DEFAULT_HINT,
    },
    seeCharCount: {
      type: Boolean,
      default: false,
    },
    charCount: {
      type: Number,
      default: 0,
    },
    totalChar: {
      type: Number,
      default: 600,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return useTextArea(props, emit);
  },
};
</script>

<style scoped>
.text-area {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.text-area :deep(.v-input__control) {
  width: 100%;
}

.text-area :deep(.v-field) {
  --v-field-border-opacity: 1;

  background: var(--white, #ffffff);
  border-radius: var(--rounded-md);
  color: rgba(0, 0, 0, 0.26);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.text-area :deep(.v-field__overlay) {
  display: none;
}

.text-area :deep(.v-field__outline) {
  color: inherit;
}

.text-area.state-hover:not(.disabled) :deep(.v-field) {
  color: rgba(0, 0, 0, 0.5);
}

.text-area.state-active:not(.disabled) :deep(.v-field) {
  box-shadow: 0 0 0 var(--base-1) rgba(0, 90, 156, 0.24);
  color: var(--primary, #005a9c);
}

.text-area.disabled :deep(.v-field) {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.18);
}

.text-area :deep(textarea) {
  color: rgba(0, 0, 0, 0.87);
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-height: var(--base-120);
  resize: vertical;
}

.text-area :deep(textarea::placeholder) {
  color: rgba(0, 0, 0, 0.48);
  opacity: 1;
}

.text-area.disabled :deep(textarea) {
  cursor: not-allowed;
  resize: none;
}

.text-area :deep(.v-input__details) {
  align-items: center;
  min-height: var(--base-16);
  padding-top: 0;
}

.text-area-meta {
  align-items: center;
  display: inline-flex;
  gap: var(--spacing-2);
  justify-content: space-between;
  width: 100%;
}

.text-area-hint,
.text-area-counter {
  color: rgba(0, 0, 0, 0.6);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.text-area-counter {
  margin-left: auto;
}
</style>
