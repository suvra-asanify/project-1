<template>
  <!--
    Root wrapper:
    - Carries public state classes (avatar, size-*, variant-*)
    - Accepts consumer utility classes
    - Receives inline CSS vars only when an explicit custom size is provided
  -->
  <div class="avatar" :class="rootClasses" :style="stackStyles">
    <!-- Inner visual shell keeps rendering classes isolated from root state classes -->
    <div class="avatar-core" :class="avatarClasses">
      <!-- Image-only mode (label/count hidden by composable rules) -->
      <img
        v-if="isImg"
        class="avatar-image"
        :src="currentImageSrc"
        alt="avatar image"
        @error="onImageError"
      />

      <!-- Text modes: default and multiple -->
      <template v-else-if="showLabel">
        <!--
            Slot scope for consumer overrides:
            - label      → normalised string from the `label` prop
            - count      → floored positive integer from the `count` prop (0 if invalid)
            - isMultiple → true when variant="multiple"
          -->
        <slot :label="displayLabel" :count="normalizedCount" :is-multiple="isMultiple">
          <span class="avatar-label">{{ displayLabel }}</span>
          <span v-if="showCount" class="avatar-count">+{{ normalizedCount }}</span>
        </slot>
      </template>
    </div>

    <!-- Secondary overlapped avatar used for the 'multiple' variant -->
    <div
      v-if="showCount"
      class="avatar-stacked"
      :class="stackedClasses"
    />
  </div>
</template>

<script>
import {
  AVATAR_DEFAULT_LABEL,
  AVATAR_SIZE_KEYS,
  AVATAR_VARIANTS,
  isValidExplicitSize,
  useAvatar,
} from '../composables/useAvatar';

export default {
  name: 'Avatar',
  props: {
    // Visual/content mode.
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return AVATAR_VARIANTS.includes(value);
      },
    },
    // Presets: default/small/large. Explicit: integer 20–100.
    size: {
      type: [String, Number],
      default: 'default',
      validator(value) {
        return (
          (typeof value === 'string' && AVATAR_SIZE_KEYS.includes(value)) ||
          isValidExplicitSize(value)
        );
      },
    },
    // Displayed initials or name. String or number accepted; always rendered uppercase.
    label: {
      type: [String, Number],
      default: AVATAR_DEFAULT_LABEL,
    },
    // Extra avatar count shown as "+N" in the `multiple` variant. Always a positive integer.
    count: {
      type: Number,
      default: 1,
    },
    // true → pill border-radius; false → small (square) border-radius.
    rounded: {
      type: Boolean,
      default: true,
    },
    // Image URL for the `img` variant. Provided by the backend.
    imageSrc: {
      type: String,
      default: '',
    },
  },
  // Keep all conditional rendering/sizing logic centralized in the composable.
  setup(props) {
    return useAvatar(props);
  },
};
</script>

<style scoped>
.avatar {
  --avatar-size: var(--base-60);
  --avatar-label-size: var(--base-22);
  --avatar-count-size: var(--base-18);
  --avatar-overlap: var(--base-50);

  align-items: center;
  display: inline-flex;
  /* Creates a stacking context so core/ghost z-index values don't bleed out. */
  isolation: isolate;
  /* Aligns the inline-flex avatar with surrounding text. */
  vertical-align: middle;
}

/* Preset token sizes (used only when explicit custom size is not provided). */
.avatar.size-sm {
  --avatar-size: var(--base-40);
  --avatar-label-size: var(--base-16);
  --avatar-count-size: var(--base-12);
  --avatar-overlap: var(--base-32);
}

.avatar.size-lg {
  --avatar-size: var(--base-80);
  --avatar-label-size: var(--base-28);
  --avatar-count-size: var(--base-20);
  --avatar-overlap: var(--base-64);
}

/* Core visual surface for the avatar content. */
.avatar-core {
  align-items: center;
  background: var(--primary);
  color: var(--white);
  display: inline-flex;
  height: var(--avatar-size);
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  width: var(--avatar-size);
  /* Sits above the ghost layer (z-index: 1). */
  z-index: 2;
}

/* Variant-specific treatment. */
.avatar--variant-img {
  background: transparent;
}

.avatar--rounded {
  border-radius: var(--rounded-pill);
}

.avatar--square {
  border-radius: var(--rounded-sm);
}

/* Typography scales from --avatar-* vars (preset or explicit size). */
.avatar-label {
  font-size: var(--avatar-label-size);
  font-weight: var(--font-weight-semibold);
}

.avatar-count {
  font-size: var(--avatar-count-size);
  font-weight: var(--font-weight-medium);
  line-height: 1;
}

.avatar-image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.avatar-stacked {
  background: var(--grey-lighten-1);
  border-radius: var(--rounded-pill);
  height: var(--avatar-size);
  /* Pulls the stacked element leftward so it tucks behind the core by --avatar-overlap. */
  margin-left: calc(-1 * var(--avatar-overlap));
  width: var(--avatar-size);
  /* Sits below the core layer (z-index: 2). */
  z-index: 1;
}

/* Overrides pill radius on the stacked element when rounded=false. */
.avatar-stacked-square {
  border-radius: var(--rounded-sm);
}
</style>
