<template>
  <v-app-bar
    color="surface"
    elevation="4"
    class="app-bar"
  >
    <!-- Left Section -->
    <div class="app-bar-left">
      <!-- Menu Icon -->
      <v-icon icon="mdi-menu" />

      <!-- Logo -->
      <div class="logo-container">
        <span class="logo-text">asanify</span>
      </div>

      <!-- Apps Dropdown -->
      <v-btn
        variant="text"
        size="small"
        class="apps-btn"
      >
        <v-icon icon="mdi-apps" />
        <span class="apps-label">Apps</span>
      </v-btn>

      <!-- Search Bar -->
      <v-text-field
        variant="underlined"
        placeholder="Search in Apps and People"
        density="compact"
        hide-details
        class="search-field"
        prepend-inner-icon="mdi-magnify"
      />

      <!-- AI Insights Button -->
      <v-btn
        icon
        variant="outlined"
        size="small"
        class="ai-btn"
      >
        <v-icon icon="mdi-lightbulb" />
      </v-btn>
    </div>

    <!-- Spacer -->
    <v-spacer />

    <!-- Right Section -->
    <div class="app-bar-right">
      <!-- Action Buttons -->
      <v-btn icon variant="text" size="small">
        <v-icon icon="mdi-plus" />
      </v-btn>
      <v-btn icon variant="text" size="small">
        <v-icon icon="mdi-help-circle-outline" />
      </v-btn>
      <v-btn icon variant="text" size="small">
        <v-icon icon="mdi-bell-outline" />
      </v-btn>
      <v-btn icon variant="text" size="small">
        <v-icon icon="mdi-calendar" />
      </v-btn>

      <!-- Divider -->
      <v-divider vertical class="mx-2" />

      <!-- Profile Menu -->
      <v-menu>
        <template #activator="{ props }">
          <div v-bind="props" class="profile-menu">
            <v-avatar
              size="36"
              color="primary"
              class="profile-avatar"
            >
              AA
            </v-avatar>
            <div class="profile-info">
              <div class="profile-name">Acme Corporation</div>
              <div class="profile-role">Admin</div>
            </div>
            <v-avatar size="36" class="company-avatar">
              <v-img src="https://via.placeholder.com/36" />
            </v-avatar>
            <v-icon icon="mdi-chevron-down" />
          </div>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
};
</script>

<style scoped>
.app-bar {
  display: flex;
  align-items: center;
  padding: 8px 20px !important;
}

.app-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--vt-c-primary);
}

.apps-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.apps-label {
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
}

.search-field {
  width: 240px;
}

.ai-btn {
  border-color: rgba(0, 90, 156, 0.87);
}

.app-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.profile-avatar {
  font-weight: 600;
}

.profile-info {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
}

.company-avatar {
  border-radius: 50%;
}
</style>
