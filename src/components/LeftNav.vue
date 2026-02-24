<template>
  <v-navigation-drawer
    permanent
    width="256"
    class="left-nav"
  >
    <v-list density="comfortable">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.id"
        :active="item.active"
        link
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'LeftNav',
  data() {
    return {
      navigationItems: [
        { id: 1, title: 'Home', icon: 'mdi-home', active: true },
        { id: 2, title: 'Hiring', icon: 'mdi-briefcase' },
        { id: 3, title: 'People', icon: 'mdi-account-multiple' },
        { id: 4, title: 'Payroll', icon: 'mdi-calculator' },
        { id: 5, title: 'Leave', icon: 'mdi-calendar-check' },
        { id: 6, title: 'Attendance', icon: 'mdi-clock-check' },
        { id: 7, title: 'Documents', icon: 'mdi-file-document' },
        { id: 8, title: 'Performance & OKRs', icon: 'mdi-target' },
        { id: 9, title: 'Requests', icon: 'mdi-email-multiple' },
        { id: 10, title: 'Analytics', icon: 'mdi-chart-line' },
        { id: 11, title: 'Company', icon: 'mdi-office-building' },
        { id: 12, title: 'Plan and Billing', icon: 'mdi-credit-card' },
        { id: 13, title: 'Integrations', icon: 'mdi-puzzle' },
        { id: 14, title: 'Agentic AI Status', icon: 'mdi-robot' },
        { id: 15, title: 'All Apps', icon: 'mdi-apps' },
      ],
    };
  },
};
</script>

<style scoped>
.left-nav {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
