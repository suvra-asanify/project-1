<template>
  <div class="text-area" :class="rootClasses">
    <div class="text-area-control">
      <textarea
        v-model="inputValue"
        class="text-area-input"
        :placeholder="normalizedPlaceholder"
        :disabled="disabled"
      />
    </div>

    <div v-if="showHint || seeCharCount" class="text-area-meta">
      <span v-if="showHint" class="text-area-hint">{{ normalizedHint }}</span>
      <span v-if="seeCharCount" class="text-area-counter">{{ counterText }}</span>
    </div>
  </div>
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
  gap: var(--spacing-2);
  width: 100%;
}

.text-area-control {
  background: var(--white, #ffffff);
  border: var(--border-sm) solid rgba(0, 0, 0, 0.26);
  border-radius: var(--rounded-md);
  padding: var(--spacing-2) var(--spacing-3);
  transition: border-color 120ms ease, box-shadow 120ms ease;
  width: 100%;
}

.text-area.state-hover:not(.disabled) .text-area-control {
  border-color: rgba(0, 0, 0, 0.5);
}

.text-area.state-active:not(.disabled) .text-area-control {
  border-color: var(--primary, #005a9c);
  box-shadow: 0 0 0 var(--base-1) rgba(0, 90, 156, 0.24);
}

.text-area.disabled .text-area-control {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.18);
  color: rgba(0, 0, 0, 0.45);
}

.text-area-input {
  background: transparent;
  border: 0;
  color: inherit;
  display: block;
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-height: var(--base-120);
  outline: none;
  resize: vertical;
  width: 100%;
}

.text-area-input::placeholder {
  color: rgba(0, 0, 0, 0.48);
}

.text-area-input:disabled {
  cursor: not-allowed;
  resize: none;
}

.text-area-meta {
  align-items: center;
  display: inline-flex;
  gap: var(--spacing-2);
  justify-content: space-between;
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
