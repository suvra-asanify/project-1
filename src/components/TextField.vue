<template>
  <div class="text-field-shell" :class="{ disabled }">
    <v-text-field
      v-model="inputValue"
      class="text-field"
      :class="rootClasses"
      :variant="vuetifyVariant"
      :density="vuetifyDensity"
      :placeholder="normalizedPlaceholder"
      :prefix="showPrefix ? normalizedPrefix : undefined"
      :suffix="showSuffix ? normalizedSuffix : undefined"
      :maxlength="resolvedCharLimit || undefined"
      :disabled="disabled"
      :id="id"
      :name="name"
      :autocomplete="autocomplete"
      :error="ariaInvalid"
      :aria-invalid="ariaInvalid ? 'true' : undefined"
      :aria-label="ariaLabel || undefined"
      :aria-required="ariaRequired ? 'true' : undefined"
      :aria-describedby="describedBy"
      :hide-details="$slots.details || showHint || showCounter ? false : 'auto'"
      single-line
      flat
    >
      <template v-if="$slots['prepend-inner'] || showPrependInnerIcon" #prepend-inner>
        <slot name="prepend-inner">
          <ds-icon
            :config="prependIconConfig"
            icon-class="text-field-icon"
            :image-class="['flagcdn-icon text-field-flag-icon', prependIconConfig.assetType === 'image' && 'text-field-custom-icon']"
          />
        </slot>
      </template>

      <template v-if="$slots['append-inner'] || showAppendInnerIcon" #append-inner>
        <slot name="append-inner">
          <ds-icon
            :config="appendIconConfig"
            icon-class="text-field-icon"
            :image-class="['flagcdn-icon text-field-flag-icon', appendIconConfig.assetType === 'image' && 'text-field-custom-icon']"
          />
        </slot>
      </template>

      <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template v-if="$slots.details || showHint || showCounter" #details>
        <slot name="details" :hint="normalizedHint" :counter="counterText">
          <div class="text-field-meta">
            <span v-if="showHint" :id="hintId" class="text-field-hint">{{ normalizedHint }}</span>
            <span v-if="showCounter" :id="counterId" class="text-field-counter">{{ counterText }}</span>
          </div>
        </slot>
      </template>
    </v-text-field>

    <span v-if="disabled" class="text-field-disabled-overlay" aria-hidden="true"></span>
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
import DsIcon from '../shared/DsIcon.vue';
import { useForwardSlots } from '../shared/useForwardSlots';

export default {
  name: 'text-field',
  components: { DsIcon },
  emits: ['update:modelValue'],
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
    charLimit: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    autocomplete: {
      type: String,
      default: 'off',
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
    const textFieldState = useTextField(props, emit);
    const forwardedSlotNames = useForwardSlots(slots, ['prepend-inner', 'append-inner', 'details']);

    return {
      ...textFieldState,
      forwardedSlotNames,
    };
  },
};
</script>

<style scoped>
.text-field-shell {
  display: inline-flex;
  flex-direction: column;
  min-width: 260px;
  position: relative;
  width: 100%;
}

.text-field-shell.disabled {
  cursor: not-allowed;
}

.text-field-disabled-overlay {
  background: transparent;
  cursor: not-allowed;
  inset: 0;
  position: absolute;
  z-index: 4;
}

.text-field {
  --text-field-height: var(--base-40);

  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.text-field.small {
  --text-field-height: var(--base-36);
}

.text-field.large {
  --text-field-height: var(--base-44);
}

.text-field :deep(.v-input__control) {
  min-height: var(--text-field-height);
}

.text-field :deep(.v-field) {
  --v-field-border-opacity: 1;

  background: var(--white, #ffffff);
  border-radius: var(--rounded-md);
  color: rgba(0, 0, 0, 0.26);
  min-height: var(--text-field-height);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.text-field :deep(.v-field__overlay) {
  display: none;
}

.text-field :deep(.v-field__outline) {
  color: inherit;
}

.text-field :deep(.v-field__input) {
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-height: var(--text-field-height);
  padding-bottom: 0;
  padding-top: 0;
}

.text-field :deep(.v-field__prepend-inner),
.text-field :deep(.v-field__append-inner) {
  align-items: center;
  padding-bottom: 0;
  padding-top: 0;
}

.text-field:not(.disabled) :deep(.v-field:hover) {
  color: rgba(0, 0, 0, 0.5);
}

.text-field:not(.disabled):not(.underlined) :deep(.v-field.v-field--focused) {
  box-shadow: 0 0 0 var(--base-1) rgba(0, 90, 156, 0.24);
  color: var(--primary, #005a9c);
}

.text-field.underlined :deep(.v-field) {
  background: transparent;
  border-radius: 0;
}

.text-field.underlined :deep(.v-field--variant-underlined .v-field__outline::before) {
  border-bottom-width: var(--border-sm);
  border-top-width: 0;
}

.text-field.underlined :deep(.v-field--variant-underlined .v-field__outline::after) {
  border-bottom-width: var(--base-2);
  border-top-width: 0;
}

.text-field:not(.disabled).underlined :deep(.v-field--focused) {
  box-shadow: none;
  color: var(--primary, #005a9c);
}

.text-field.disabled :deep(.v-field) {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.18);
}

.text-field.underlined.disabled :deep(.v-field) {
  background: transparent;
}

.text-field :deep(input::placeholder) {
  color: rgba(0, 0, 0, 0.48);
  opacity: 1;
}

.text-field-icon,
.text-field :deep(.v-text-field__prefix),
.text-field :deep(.v-text-field__suffix) {
  color: rgba(0, 0, 0, 0.62);
  font-size: var(--body-base-size);
  line-height: var(--body-base-lh);
}

.text-field :deep(.v-text-field__prefix),
.text-field :deep(.v-text-field__suffix) {
  align-self: center;
  min-height: auto;
  padding-bottom: 0;
  padding-top: 0;
}

.text-field-icon {
  font-size: var(--icon-dense);
}

.text-field-flag-icon {
  flex: 0 0 auto;
}

.text-field-custom-icon {
  border-radius: 2px;
  height: var(--base-16);
  object-fit: cover;
  width: var(--base-16);
}

.text-field.disabled .text-field-icon,
.text-field.disabled :deep(input::placeholder),
.text-field.disabled :deep(.v-text-field__prefix),
.text-field.disabled :deep(.v-text-field__suffix) {
  color: rgba(0, 0, 0, 0.4);
}

.text-field.disabled,
.text-field.disabled :deep(.v-field),
.text-field.disabled :deep(.v-field__input),
.text-field.disabled :deep(input),
.text-field.disabled :deep(.v-text-field__prefix),
.text-field.disabled :deep(.v-text-field__suffix),
.text-field.disabled :deep(.text-field-icon),
.text-field.disabled :deep(.text-field-flag-icon) {
  -webkit-user-select: none;
  user-select: none;
}

.text-field.disabled :deep(*) {
  -webkit-user-select: none !important;
  user-select: none !important;
}

.text-field :deep(.v-input__details) {
  align-items: center;
  min-height: var(--base-16);
  padding-top: 4px;
}

.text-field-meta {
  align-items: start;
  column-gap: var(--spacing-2);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100%;
}

.text-field-hint,
.text-field-counter {
  color: rgba(0, 0, 0, 0.6);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.text-field-hint {
  overflow-wrap: anywhere;
}

.text-field-counter {
  justify-self: end;
}

.text-field.disabled {
  opacity: 0.85;
}
</style>
