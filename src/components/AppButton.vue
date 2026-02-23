<template>
  <v-btn
    :class="[
      'app-btn',
      `app-btn--${variant}`,
      `app-btn--state-${computedState}`,
      {
        'app-btn--icon-only': iconOnly,
        'app-btn--loading': loading,
        'app-btn--disabled': disabled,
      },
    ]"
    :color="vuetifyColor"
    :variant="vuetifyVariant"
    :disabled="disabled || loading"
    :height="48"
    :rounded="4"
    :ripple="!loading && !disabled"
  >
    <template v-if="loading">
      <v-progress-circular
        indeterminate
        :size="28"
        :width="2"
        color="white"
      />
    </template>
    <template v-else>
      <span
        v-if="hasPrependIcon || iconOnly"
        class="app-btn__icon app-btn__icon--prepend"
      >
        <slot name="prepend-icon">
          <v-icon :size="iconSize">
            mdi-plus
          </v-icon>
        </slot>
      </span>
      <span v-if="!iconOnly" class="app-btn__label">
        <slot>
          Button
        </slot>
      </span>
      <span
        v-if="hasAppendIcon && !iconOnly"
        class="app-btn__icon app-btn__icon--append"
      >
        <slot name="append-icon">
          <v-icon :size="iconSize">
            mdi-plus
          </v-icon>
        </slot>
      </span>
    </template>
  </v-btn>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    variant: {
      type: String,
      default: 'primary', // primary | outlined | text | tonal
    },
    state: {
      type: String,
      default: 'default', // default | hover | pressed
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
    hasPrependIcon: {
      type: Boolean,
      default: true,
    },
    hasAppendIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedState() {
      if (this.disabled) return 'disabled';
      if (this.loading) return 'loading';
      return this.state;
    },
    vuetifyColor() {
      if (this.variant === 'primary' || this.variant === 'tonal') return 'primary';
      if (this.variant === 'outlined' || this.variant === 'text') return 'primary';
      return 'primary';
    },
    vuetifyVariant() {
      if (this.variant === 'primary') return 'flat';
      if (this.variant === 'outlined') return 'outlined';
      if (this.variant === 'text') return 'text';
      if (this.variant === 'tonal') return 'tonal';
      return 'flat';
    },
    iconSize() {
      return this.iconOnly ? 28 : 22;
    },
  },
};
</script>

<style scoped>
.app-btn {
  font-family: var(--font-family-base);
  font-size: var(--btn-font-size, 18px);
  line-height: var(--btn-font-line-height, 22px);
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
  padding-inline: var(--btn-px, 16px);
  padding-block: var(--btn-py, 14px);
  border-radius: var(--round, 4px);
}

.app-btn--icon-only {
  padding-inline: var(--icon-btn-padding, 10px);
  padding-block: var(--btn-py, 14px);
  width: var(--icon-btn-size, 48px);
  min-width: var(--icon-btn-size, 48px);
}

.app-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-btn__icon--prepend {
  margin-right: var(--space-1, 4px);
  margin-left: var(--space-n0_5, -2px);
  margin-top: var(--btn-icon-top, 2px);
}

.app-btn__icon--append {
  margin-left: var(--space-1, 4px);
  margin-right: var(--space-n0_5, -2px);
  margin-top: var(--btn-icon-top, 2px);
}

.app-btn__label {
  color: var(--color-text-inverse-primary, #ffffff);
}

/* Variant + state specific surface treatments rely on Vuetify for base,
   but we fine-tune hover/pressed backgrounds to better match Figma. */

.app-btn--primary.app-btn--state-hover {
  box-shadow: 0 0 0 1px var(--color-surface-primary, #ffffff) inset;
}

.app-btn--primary.app-btn--state-pressed {
  filter: brightness(0.9);
}

.app-btn--primary.app-btn--state-disabled {
  background-color: #e0e0e0 !important;
  color: #9e9e9e !important;
}

.app-btn--outlined .app-btn__label,
.app-btn--text .app-btn__label,
.app-btn--tonal .app-btn__label {
  color: var(--color-brand-primary, #005a9c);
}

.app-btn--outlined.app-btn--state-disabled,
.app-btn--text.app-btn--state-disabled,
.app-btn--tonal.app-btn--state-disabled {
  opacity: 0.5;
}
</style>

