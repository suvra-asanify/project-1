import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ShiftPolicyPage from '../pages/ShiftPolicyPage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/shift-policy',
      name: 'shift-policy',
      component: ShiftPolicyPage,
    },
  ],
});

export default router;
