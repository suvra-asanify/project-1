<template>
  <div
    class="color-picker-shell"
    :class="rootClasses"
    @mouseenter="setHoverState(true)"
    @mouseleave="setHoverState(false)"
  >
    <v-menu
      v-model="menuValue"
      class="color-picker-menu"
      :disabled="disabled"
      location="bottom"
      :offset="0"
      :close-on-content-click="false"
      :scrim="false"
      transition="fade-transition"
    >
      <template #activator="{ props: activatorProps }">
        <v-text-field
          v-bind="activatorProps"
          v-model="inputValue"
          class="color-picker"
          :class="rootClasses"
          variant="filled"
          :placeholder="normalizedPlaceholder"
          :disabled="disabled"
          :error="ariaInvalid"
          :aria-invalid="ariaInvalid ? 'true' : undefined"
          :aria-label="ariaLabel || undefined"
          :aria-required="ariaRequired ? 'true' : undefined"
          :hide-details="$slots.details || showHint ? false : 'auto'"
          single-line
          flat
          @click:append-inner.stop="toggleMenu"
        >
          <template v-if="$slots['prepend-inner'] || showLeadingIcon" #prepend-inner>
            <slot name="prepend-inner" :icon="iconConfig">
              <ds-icon
                :config="iconConfig"
                icon-class="color-picker-icon color-picker-leading-icon"
                :image-class="[
                  'color-picker-image-icon',
                  iconConfig.assetType === 'flag' && 'color-picker-flag-icon flagcdn-icon',
                  iconConfig.assetType === 'image' && 'color-picker-custom-icon',
                ]"
              />
            </slot>
          </template>

          <template #append-inner>
            <slot
              name="append-inner"
              :toggle-menu="toggleMenu"
              :color="previewColor"
              :value="effectiveValue"
            >
              <button
                class="color-picker-append-action"
                type="button"
                :disabled="disabled"
                tabindex="-1"
                aria-label="Toggle color picker"
                @click.stop.prevent="toggleMenu"
              >
                <v-icon size="24">mdi-format-color-fill</v-icon>
              </button>
            </slot>
          </template>

          <template v-if="$slots.details || showHint" #details>
            <slot name="details" :hint="normalizedHint" :value="effectiveValue">
              <div class="color-picker-meta">
                <span v-if="showHint" class="color-picker-hint">{{ normalizedHint }}</span>
              </div>
            </slot>
          </template>
        </v-text-field>
      </template>

      <slot
        name="picker"
        :value="effectiveValue"
        :preview-color="previewColor"
        :close="closeMenu"
      >
        <div class="color-picker-dropdown" @mousedown.stop>
          <div ref="canvasRef" class="color-picker-canvas" :style="canvasStyle" @pointerdown.prevent="onCanvasPointerDown">
            <div class="color-picker-dot" :style="dotStyle"></div>
          </div>

          <div class="color-picker-controls">
            <div class="color-picker-preview-row">
              <v-icon class="color-picker-dropper" size="24">mdi-eyedropper-variant</v-icon>
              <div class="color-picker-preview" :style="{ backgroundColor: previewColor }"></div>

              <div class="color-picker-sliders">
                <div class="color-picker-slider color-picker-slider--hue">
                  <div class="color-picker-slider-track" :style="hueTrackStyle"></div>
                  <v-slider
                    :model-value="hue"
                    :min="0"
                    :max="360"
                    :step="1"
                    thumb-size="14"
                    hide-details
                    @update:model-value="onHueChange"
                  />
                </div>

                <div class="color-picker-slider color-picker-slider--alpha">
                  <div class="color-picker-slider-track color-picker-slider-track--checker"></div>
                  <div class="color-picker-slider-track color-picker-slider-track--alpha" :style="alphaTrackOverlayStyle"></div>
                  <v-slider
                    :model-value="alpha"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    thumb-size="14"
                    hide-details
                    @update:model-value="onAlphaChange"
                  />
                </div>
              </div>
            </div>

            <div class="color-picker-fields-row">
              <div class="color-picker-fields">
                <div v-for="field in hslFields" :key="field.key" class="color-picker-field-wrap">
                  <v-text-field
                    :model-value="field.value"
                    class="color-picker-field"
                    variant="filled"
                    type="number"
                    min="0"
                    :max="field.key === 'h' ? 360 : 100"
                    hide-details
                    density="comfortable"
                    single-line
                    flat
                    @update:model-value="onFieldChannelInput(field.key, $event)"
                  />
                  <span class="color-picker-field-label">{{ field.label }}</span>
                </div>
              </div>

              <button
                class="color-picker-mode-action"
                type="button"
                :disabled="disabled"
                aria-label="Switch color format"
              >
                <v-icon size="20">mdi-unfold-more-horizontal</v-icon>
              </button>
            </div>
          </div>
        </div>
      </slot>
    </v-menu>

    <span v-if="disabled" class="color-picker-disabled-overlay" aria-hidden="true"></span>
  </div>
</template>

<script>
import {
  COLOR_PICKER_DEFAULT_HINT,
  COLOR_PICKER_DEFAULT_PLACEHOLDER,
  COLOR_PICKER_DEFAULT_VALUE,
  COLOR_PICKER_STATES,
  useColorPicker,
} from '../composables/useColorPicker';
import DsIcon from '../shared/DsIcon.vue';

export default {
  name: 'color-picker',
  components: {
    DsIcon,
  },
  emits: ['update:value', 'update:menu'],
  props: {
    state: {
      type: String,
      default: 'default',
      validator(value) {
        return COLOR_PICKER_STATES.includes(value);
      },
    },
    placeholder: {
      type: String,
      default: COLOR_PICKER_DEFAULT_PLACEHOLDER,
    },
    value: {
      type: String,
      default: COLOR_PICKER_DEFAULT_VALUE,
    },
    hasIcon: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'mdi-plus',
    },
    hasHint: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: COLOR_PICKER_DEFAULT_HINT,
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
  setup(props, { emit }) {
    return useColorPicker(props, emit);
  },
};
</script>

<style scoped>
.color-picker-shell {
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 288px;
}

.color-picker-shell.disabled {
  cursor: not-allowed;
}

.color-picker-disabled-overlay {
  background: transparent;
  cursor: not-allowed;
  inset: 0;
  position: absolute;
  z-index: 10;
}

.color-picker {
  width: 100%;
}

.color-picker :deep(.v-input__control) {
  min-height: var(--base-40);
}

.color-picker :deep(.v-field) {
  --v-field-border-opacity: 1;

  background: var(--black-04, rgba(0, 0, 0, 0.04));
  border-radius: var(--rounded-md) var(--rounded-md) 0 0;
  color: var(--black-38, rgba(0, 0, 0, 0.38));
  min-height: var(--base-40);
}

.color-picker :deep(.v-field__overlay) {
  display: none;
}

.color-picker :deep(.v-field__outline) {
  color: inherit;
}

.color-picker :deep(.v-field__input) {
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-height: var(--base-40);
  padding-bottom: 0;
  padding-top: 0;
}

.color-picker :deep(input::placeholder) {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  opacity: 1;
}

.color-picker.state-hover :deep(.v-field),
.color-picker-shell.state-hover .color-picker :deep(.v-field) {
  background: rgba(0, 0, 0, 0.08);
}

.color-picker.state-pressed :deep(.v-field),
.color-picker-shell.state-pressed .color-picker :deep(.v-field) {
  background: rgba(0, 0, 0, 0.16);
}

.color-picker-shell.disabled .color-picker :deep(.v-field) {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.18);
}

.color-picker-icon,
.color-picker :deep(.v-field__append-inner .v-icon) {
  color: var(--black-87, rgba(0, 0, 0, 0.87));
}

.color-picker-leading-icon {
  font-size: var(--icon-dense);
}

.color-picker-image-icon {
  height: var(--base-16);
  width: var(--base-16);
}

.color-picker-custom-icon {
  border-radius: var(--base-2);
}

.color-picker-append-action {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.color-picker-append-action:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.color-picker :deep(.v-input__details) {
  min-height: var(--base-16);
  padding-top: var(--base-4);
}

.color-picker-meta {
  align-items: center;
  display: inline-flex;
  min-height: var(--base-16);
  width: 100%;
}

.color-picker-hint {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.color-picker-dropdown {
  background: #fff;
  border-radius: 0 0 var(--rounded-md) var(--rounded-md);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
  width: 288px;
}

.color-picker-canvas {
  cursor: crosshair;
  height: 180px;
  position: relative;
  width: 100%;
}

.color-picker-dot {
  background: rgba(0, 0, 0, 0.01);
  border-radius: var(--base-9999);
  box-shadow: 0 0 0 1.5px #fff;
  height: var(--base-24);
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--base-24);
}

.color-picker-dot::after {
  border-radius: inherit;
  box-shadow: inset 0 0 1px 1.5px rgba(0, 0, 0, 0.3);
  content: '';
  inset: 0;
  position: absolute;
}

.color-picker-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6, 24px);
  padding: var(--spacing-4, 16px);
}

.color-picker-preview-row {
  align-items: center;
  display: flex;
  gap: var(--spacing-6, 24px);
}

.color-picker-dropper {
  color: var(--black-87, rgba(0, 0, 0, 0.87));
}

.color-picker-preview {
  border-radius: var(--base-9999);
  height: var(--base-30);
  width: var(--base-30);
}

.color-picker-sliders {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.color-picker-slider {
  align-items: center;
  display: flex;
  min-height: var(--base-32);
  position: relative;
}

.color-picker-slider-track {
  border-radius: 6px;
  height: var(--base-8);
  left: 0;
  position: absolute;
  right: 0;
}

.color-picker-slider-track--checker {
  background-color: #ececec;
  background-image:
    linear-gradient(45deg, #b7b7b7 25%, transparent 25%),
    linear-gradient(-45deg, #b7b7b7 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #b7b7b7 75%),
    linear-gradient(-45deg, transparent 75%, #b7b7b7 75%);
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  background-size: 8px 8px;
}

.color-picker-slider-track--alpha {
  z-index: 1;
}

.color-picker-slider :deep(.v-slider) {
  margin: 0;
  position: relative;
  width: 100%;
  z-index: 2;
}

.color-picker-slider :deep(.v-slider-track__background),
.color-picker-slider :deep(.v-slider-track__fill) {
  opacity: 0;
}

.color-picker-slider :deep(.v-slider-thumb__surface) {
  background: #424242 !important;
  border-radius: var(--base-9999);
}

.color-picker-fields-row {
  align-items: flex-start;
  display: flex;
  gap: var(--spacing-2, 8px);
  min-width: 256px;
}

.color-picker-fields {
  display: flex;
  gap: var(--spacing-2, 8px);
}

.color-picker-field-wrap {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2, 8px);
}

.color-picker-field {
  width: 44px;
}

.color-picker-field :deep(.v-field) {
  background: rgba(66, 66, 66, 0.42);
  border-radius: var(--rounded-md);
  min-height: var(--base-32);
}

.color-picker-field :deep(.v-field__outline),
.color-picker-field :deep(.v-field__overlay),
.color-picker-field :deep(.v-number-input__control) {
  display: none;
}

.color-picker-field :deep(.v-field__input) {
  justify-content: center;
  min-height: var(--base-24);
  padding: 4px 8px;
}

.color-picker-field :deep(input) {
  appearance: textfield;
  -moz-appearance: textfield;
  color: rgba(0, 0, 0, 0.87);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
  text-align: center;
}

.color-picker-field :deep(input::-webkit-outer-spin-button),
.color-picker-field :deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.color-picker-field-label {
  color: rgba(0, 0, 0, 0.87);
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.color-picker-mode-action {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--brand-87, rgba(0, 90, 156, 0.87));
  cursor: pointer;
  display: inline-flex;
  height: 48px;
  justify-content: center;
  width: 48px;
}

.color-picker-mode-action:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
