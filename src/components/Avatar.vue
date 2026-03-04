<template>
  <div class="avatar" :class="rootClasses" :style="stackStyles">
    <v-avatar-group v-if="showCount" class="avatar-group">
      <v-avatar
        class="avatar-core"
        :class="avatarClasses"
        :size="avatarSize"
        :image="isImg ? currentImageSrc : undefined"
        v-bind="$attrs"
      >
        <template v-if="showLabel">
          <slot :label="displayLabel" :count="normalizedCount" :is-multiple="isMultiple">
            <span class="avatar-label">{{ displayLabel }}</span>
            <span v-if="showCount" class="avatar-count">+{{ normalizedCount }}</span>
          </slot>
        </template>
      </v-avatar>

      <v-avatar
        class="avatar-stacked"
        :class="{ 'avatar-stacked-square': !rounded }"
        :size="avatarSize"
        color="grey-lighten-1"
      />
    </v-avatar-group>

    <v-avatar
      v-else
      class="avatar-core"
      :class="avatarClasses"
      :size="avatarSize"
      :image="isImg ? currentImageSrc : undefined"
      v-bind="$attrs"
    >
      <template v-if="showLabel">
        <slot :label="displayLabel" :count="normalizedCount" :is-multiple="isMultiple">
          <span class="avatar-label">{{ displayLabel }}</span>
          <span v-if="showCount" class="avatar-count">+{{ normalizedCount }}</span>
        </slot>
      </template>
    </v-avatar>
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
  name: 'avatar',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return AVATAR_VARIANTS.includes(value);
      },
    },
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
    label: {
      type: [String, Number],
      default: AVATAR_DEFAULT_LABEL,
    },
    count: {
      type: Number,
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

.avatar-core {
  align-items: center;
  background: var(--primary);
  color: var(--white);
  display: inline-flex;
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  z-index: 2;
}

.avatar-group {
  align-items: center;
  display: inline-flex;
  isolation: isolate;
}

.avatar-group :deep(.v-avatar + .v-avatar) {
  margin-left: calc(-1 * var(--avatar-overlap));
}

.avatar--variant-img {
  background: transparent;
}

.avatar--rounded {
  border-radius: var(--rounded-pill);
}

.avatar--square {
  border-radius: var(--rounded-sm);
}

.avatar-label {
  font-size: var(--avatar-label-size);
  font-weight: var(--font-weight-semibold);
}

.avatar-count {
  font-size: var(--avatar-count-size);
  font-weight: var(--font-weight-medium);
  line-height: 1;
}

.avatar-stacked {
  background: var(--grey-lighten-1);
  border-radius: var(--rounded-pill);
  z-index: 1;
}

.avatar-stacked-square {
  border-radius: var(--rounded-sm);
}
</style>
