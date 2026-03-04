<template>
  <v-icon v-if="config.type === 'mdi'" :class="iconClass">{{ config.icon }}</v-icon>
  <img
    v-else-if="config.type === 'asset'"
    :class="imageClass"
    :src="config.src"
    :alt="config.alt"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
    loading="lazy"
  />
</template>

<script>
export default {
  name: 'ds-icon',
  props: {
    config: {
      type: Object,
      required: true,
    },
    iconClass: {
      type: [String, Array, Object],
      default: '',
    },
    imageClass: {
      type: [String, Array, Object],
      default: '',
    },
  },
};
</script>
