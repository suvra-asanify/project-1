<template>
  <v-app>
    <ComponentTester />
  </v-app>
</template>

<script>
import ComponentTester from './pages/ComponentTester.vue';

export default {
  name: 'App',
  components: {
    ComponentTester,
  },
};
</script>
