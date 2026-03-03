<template>
  <div class="text-field" :class="rootClasses">
    <div
      class="text-field-control"
      :style="controlStyles"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <template v-if="showPrependInnerIcon">
        <i
          v-if="prependIconConfig.type === 'mdi'"
          class="text-field-icon text-field-icon-prepend"
          :class="prependIconConfig.className"
          aria-hidden="true"
        />
        <img
          v-else
          class="flagcdn-icon text-field-flag-icon text-field-icon-prepend"
          :src="prependIconConfig.src"
          :alt="prependIconConfig.alt"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          loading="lazy"
        />
      </template>

      <span v-if="showPrefix" class="text-field-affix text-field-prefix">
        {{ normalizedPrefix }}
      </span>

      <input
        class="text-field-input"
        :value="internalValue"
        :placeholder="normalizedPlaceholder"
        :disabled="disabled"
        @input="onInput"
      />

      <span v-if="showSuffix" class="text-field-affix text-field-suffix">
        {{ normalizedSuffix }}
      </span>

      <template v-if="showAppendInnerIcon">
        <i
          v-if="appendIconConfig.type === 'mdi'"
          class="text-field-icon text-field-icon-append"
          :class="appendIconConfig.className"
          aria-hidden="true"
        />
        <img
          v-else
          class="flagcdn-icon text-field-flag-icon text-field-icon-append"
          :src="appendIconConfig.src"
          :alt="appendIconConfig.alt"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          loading="lazy"
        />
      </template>
    </div>

    <div v-if="showHint || showCounter" class="text-field-meta">
      <span v-if="showHint" class="text-field-hint">{{ normalizedHint }}</span>
      <span v-if="showCounter" class="text-field-counter">{{ counterText }}</span>
    </div>
  </div>
</template>

<script>
import {
  TEXT_FIELD_DEFAULT_INPUT,
  TEXT_FIELD_DEFAULT_PLACEHOLDER,
  TEXT_FIELD_SIZE_KEYS,
  TEXT_FIELD_VARIANTS,
  useTextField,
} from '../composables/useTextField';

export default {
  name: 'TextField',
  emits: ['update:modelValue', 'input'],
  props: {
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return TEXT_FIELD_VARIANTS.includes(value);
      },
    },
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return TEXT_FIELD_SIZE_KEYS.includes(value);
      },
    },
    placeholder: {
      type: String,
      default: TEXT_FIELD_DEFAULT_PLACEHOLDER,
    },
    modelValue: {
      type: String,
      default: TEXT_FIELD_DEFAULT_INPUT,
    },
    prependInnerIcon: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: String,
      default: '',
    },
    appendInnerIcon: {
      type: String,
      default: '',
    },
    appendIcon: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    seeCharCount: {
      type: Boolean,
      default: false,
    },
    totalChar: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return useTextField(props, emit);
  },
};
</script>

<style scoped>
.text-field {
  --text-field-height: var(--base-40);

  display: inline-flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-width: 260px;
  width: 100%;
}

.text-field.small {
  --text-field-height: var(--base-36);
}

.text-field.large {
  --text-field-height: var(--base-44);
}

.text-field-control {
  align-items: center;
  background: var(--white, #ffffff);
  border: var(--border-sm) solid rgba(0, 0, 0, 0.26);
  border-radius: var(--rounded-md);
  display: inline-flex;
  gap: var(--spacing-2);
  min-height: var(--text-field-height);
  padding: 0 var(--spacing-3);
  transition: border-color 120ms ease, box-shadow 120ms ease;
  width: 100%;
}

.text-field.underlined .text-field-control {
  background: transparent;
  border-left: 0;
  border-radius: 0;
  border-right: 0;
  border-top: 0;
  padding-left: 0;
  padding-right: 0;
}

.text-field.underlined.disabled .text-field-control {
  background: transparent;
}

.text-field.disabled .text-field-control {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.18);
  color: rgba(0, 0, 0, 0.45);
  cursor: not-allowed;
}

.text-field-input {
  background: transparent;
  border: 0;
  color: inherit;
  flex: 1;
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-width: 0;
  outline: none;
  padding: var(--spacing-2) 0;
}

.text-field-input::placeholder {
  color: rgba(0, 0, 0, 0.48);
}

.text-field-input:disabled {
  cursor: not-allowed;
}

.text-field-affix,
.text-field-icon {
  color: rgba(0, 0, 0, 0.62);
  font-size: var(--body-sm-size);
  line-height: var(--body-sm-lh);
  white-space: nowrap;
}

.text-field-icon {
  font-size: var(--icon-dense);
}

.text-field-flag-icon {
  flex: 0 0 auto;
}

.text-field.disabled .text-field-affix,
.text-field.disabled .text-field-icon,
.text-field.disabled .text-field-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.text-field-meta {
  align-items: center;
  display: inline-flex;
  gap: var(--spacing-2);
  justify-content: space-between;
  min-height: var(--base-16);
}

.text-field-hint,
.text-field-counter {
  color: rgba(0, 0, 0, 0.6);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.text-field-counter {
  margin-left: auto;
}

.text-field.disabled {
  opacity: 0.85;
}
</style>
