<template>
  <div class="text-area-shell" :class="{ disabled }">
    <v-textarea
      v-model="inputValue"
      class="text-area"
      :class="rootClasses"
      variant="outlined"
      :placeholder="normalizedPlaceholder"
      :disabled="disabled"
      :auto-grow="autoGrow"
      :maxlength="resolvedCharLimit || undefined"
      :error="ariaInvalid"
      :aria-invalid="ariaInvalid ? 'true' : undefined"
      :aria-label="ariaLabel || undefined"
      :aria-required="ariaRequired ? 'true' : undefined"
      :hide-details="$slots.details || showHint || showCounter ? false : 'auto'"
      rows="4"
      flat
    >
      <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template v-if="$slots.details || showHint || showCounter" #details>
        <slot name="details" :hint="normalizedHint" :counter="counterText">
          <div class="text-area-meta">
            <span v-if="showHint" class="text-area-hint">{{ normalizedHint }}</span>
            <span v-if="showCounter" class="text-area-counter">{{ counterText }}</span>
          </div>
        </slot>
      </template>
    </v-textarea>

    <span v-if="disabled" class="text-area-disabled-overlay" aria-hidden="true"></span>
  </div>
</template>

<script>
import {
  TEXT_AREA_DEFAULT_HINT,
  TEXT_AREA_DEFAULT_INPUT,
  TEXT_AREA_DEFAULT_PLACEHOLDER,
  useTextArea,
} from '../composables/useTextArea';
import { useForwardSlots } from '../shared/useForwardSlots';

export default {
  name: 'text-area',
  emits: ['update:input', 'update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: TEXT_AREA_DEFAULT_PLACEHOLDER,
    },
    input: {
      type: String,
      default: TEXT_AREA_DEFAULT_INPUT,
    },
    hint: {
      type: String,
      default: TEXT_AREA_DEFAULT_HINT,
    },
    charLimit: {
      type: Number,
      default: null,
    },
    autoGrow: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ariaInvalid: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: null,
    },
    ariaRequired: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const textAreaState = useTextArea(props, emit);
    const forwardedSlotNames = useForwardSlots(slots, ['details']);

    return {
      ...textAreaState,
      forwardedSlotNames,
    };
  },
};
</script>

<style scoped>
.text-area-shell {
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

.text-area-shell.disabled {
  cursor: not-allowed;
}

.text-area-disabled-overlay {
  background: transparent;
  cursor: not-allowed;
  inset: 0;
  position: absolute;
  z-index: 4;
}

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

.text-area:not(.disabled) :deep(.v-field:hover) {
  color: rgba(0, 0, 0, 0.5);
}

.text-area:not(.disabled) :deep(.v-field.v-field--focused) {
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

.text-area.auto-grow :deep(textarea) {
  resize: none;
}

.text-area :deep(textarea::placeholder) {
  color: rgba(0, 0, 0, 0.48);
  opacity: 1;
}

.text-area.disabled :deep(textarea) {
  cursor: not-allowed;
  resize: none;
}

.text-area.disabled,
.text-area.disabled :deep(.v-field),
.text-area.disabled :deep(.v-field__input),
.text-area.disabled :deep(textarea) {
  -webkit-user-select: none;
  user-select: none;
}

.text-area.disabled :deep(*) {
  -webkit-user-select: none !important;
  user-select: none !important;
}

.text-area :deep(.v-input__details) {
  align-items: center;
  min-height: var(--base-16);
  padding-top: 4px;
}

.text-area-meta {
  align-items: start;
  column-gap: var(--spacing-2);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100%;
}

.text-area-hint,
.text-area-counter {
  color: rgba(0, 0, 0, 0.6);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.text-area-hint {
  overflow-wrap: anywhere;
}

.text-area-counter {
  justify-self: end;
}
</style>
