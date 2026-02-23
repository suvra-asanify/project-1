<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>Button Playground</h1>

        <h2>Primary buttons</h2>
        <div class="row">
          <AppButton>+ Button</AppButton>
          <AppButton icon-only />
          <AppButton loading />
          <AppButton disabled />
        </div>

        <h2>Outlined buttons</h2>
        <div class="row">
          <AppButton variant="outlined">+ Button</AppButton>
          <AppButton variant="outlined" icon-only />
          <AppButton variant="outlined" loading />
          <AppButton variant="outlined" disabled />
        </div>

        <h2>Tonal buttons</h2>
        <div class="row">
          <AppButton variant="tonal">+ Button</AppButton>
          <AppButton variant="tonal" icon-only />
          <AppButton variant="tonal" loading />
          <AppButton variant="tonal" disabled />
        </div>

        <h2>Text buttons</h2>
        <div class="row">
          <AppButton variant="text">+ Button</AppButton>
          <AppButton variant="text" icon-only />
          <AppButton variant="text" loading />
          <AppButton variant="text" disabled />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppButton from './components/AppButton.vue';

export default {
  name: 'App',
  components: {
    AppButton,
  },
};
</script>

<style scoped>
.row {
  display: flex;
  gap: var(--space-4, 16px);
  margin-bottom: var(--space-4, 16px);
  flex-wrap: wrap;
}
</style>
