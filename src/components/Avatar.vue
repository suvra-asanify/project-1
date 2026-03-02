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
        :src="resolvedImageSrc"
        alt="avatar image"
      />

      <!-- Text modes: default and multiple -->
      <template v-else-if="showLabel">
        <!-- Slot keeps override flexibility while preserving default rendering -->
        <slot :label="displayLabel" :count="normalizedCount" :is-multiple="isMultiple">
          <span class="avatar-label">{{ displayLabel }}</span>
          <span v-if="showCount" class="avatar-count">+{{ normalizedCount }}</span>
        </slot>
      </template>
    </div>

    <!-- Secondary overlapped avatar used for the 'multiple' variant -->
    <div
      v-if="showGhost"
      class="avatar-ghost"
      :class="{ 'avatar-ghost-square': !rounded }"
    />
  </div>
</template>

<script>
import { AVATAR_SIZE_KEYS, AVATAR_VARIANTS, useAvatar } from '../composables/useAvatar';

// Accepts positive number or non-empty CSS size string (e.g. 72, '96px', '4rem', 'clamp(...)').
function isValidExplicitSize(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return false;
}

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
    // Presets: default/small/large. Explicit: 36, '36px', '4rem', etc.
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
    // Backend-friendly: null/undefined/string/number are accepted.
    label: {
      default: 'AA',
      validator(value) {
        return value === null || value === undefined || ['string', 'number'].includes(typeof value);
      },
    },
    count: {
      type: [Number, String],
      default: 1,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
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
  isolation: isolate;
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
  gap: var(--spacing-0);
  height: var(--avatar-size);
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  position: relative;
  text-align: center;
  transition: width 0.2s ease, height 0.2s ease;
  width: var(--avatar-size);
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
  line-height: 1;
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

.avatar-ghost {
  background: var(--grey-lighten-1);
  border-radius: var(--rounded-pill);
  height: var(--avatar-size);
  margin-left: calc(-1 * var(--avatar-overlap));
  width: var(--avatar-size);
  z-index: 1;
}

.avatar-ghost-square {
  border-radius: var(--rounded-sm);
}
</style>
