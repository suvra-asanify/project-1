<template>
  <v-app>
    <v-main class="home-main">
      <v-container class="home-container">
        <h1 class="home-title">Project Pages</h1>
        <p class="home-subtitle">Use this home screen to open each implemented page.</p>

        <v-card class="page-card" rounded="lg" elevation="2">
          <v-card-title class="page-card-title">Shift Policy Design</v-card-title>
          <v-card-text class="page-card-text">
            Figma implementation for attendance policy creation flow.
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="flat"
              :to="'/shift-policy'"
            >
              Open Page
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.home-main {
  background: var(--color-surface-background, #f2f3f8);
  min-height: 100vh;
}

.home-container {
  max-width: 960px;
  padding-top: 64px;
  padding-bottom: 64px;
}

.home-title {
  margin: 0;
  font-size: 34px;
  line-height: 40px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
}

.home-subtitle {
  margin: 12px 0 24px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.6);
}

.page-card {
  max-width: 560px;
}

.page-card-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
}

.page-card-text {
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.7);
}
</style>
