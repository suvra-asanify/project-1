<template>
  <div class="avatar-stack" :class="stackClass">
    <div class="avatar" :class="avatarClass">
      <img
        v-if="isImg"
        class="avatar-image"
        :src="resolvedImageSrc"
        :alt="label"
      />

      <template v-else>
        <span class="avatar-label">{{ label }}</span>
        <span v-if="hasCount" class="avatar-count">+{{ normalizedCount }}</span>
      </template>
    </div>

    <div
      v-if="hasCount && !isImg"
      class="avatar-ghost"
      :class="{ 'avatar-ghost-square': !rounded }"
    />
  </div>
</template>

<script>
const FALLBACK_IMAGE =
  'https://www.figma.com/api/mcp/asset/0ad7dc93-7eda-4247-b729-7786b3e7cbb9';

export default {
  name: 'Avatar',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'img'].includes(value);
      },
    },
    size: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'small', 'large'].includes(value);
      },
    },
    label: {
      type: String,
      default: 'AA',
    },
    count: {
      type: [Number, String],
      default: 0,
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
  computed: {
    isImg() {
      return this.variant === 'img';
    },
    normalizedCount() {
      const parsed = Number(this.count);
      return Number.isFinite(parsed) ? parsed : 0;
    },
    hasCount() {
      return this.normalizedCount > 0;
    },
    resolvedImageSrc() {
      return this.imageSrc || FALLBACK_IMAGE;
    },
    stackClass() {
      return `avatar-stack--${this.size}`;
    },
    avatarClass() {
      return [
        `avatar--${this.size}`,
        this.rounded ? 'avatar--rounded' : 'avatar--square',
      ];
    },
  },
};
</script>

<style scoped>
.avatar-stack {
  --avatar-size: var(--base-60);
  --avatar-label-size: var(--base-22);
  --avatar-count-size: var(--base-18);
  --avatar-overlap: var(--base-50);

  align-items: center;
  display: inline-flex;
  isolation: isolate;
}

.avatar-stack--small {
  --avatar-size: var(--base-40);
  --avatar-label-size: var(--base-16);
  --avatar-count-size: var(--base-12);
  --avatar-overlap: var(--base-32);
}

.avatar-stack--large {
  --avatar-size: var(--base-80);
  --avatar-label-size: var(--base-28);
  --avatar-count-size: var(--base-20);
  --avatar-overlap: var(--base-64);
}

.avatar {
  align-items: center;
  background: var(--primary);
  color: var(--white);
  display: inline-flex;
  gap: var(--spacing-0);
  height: var(--avatar-size);
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: var(--avatar-size);
  z-index: 2;
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

