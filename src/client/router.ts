import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ReceivingPage from './pages/ReceivingPage.vue';
import ReceivingDetailPage from './pages/ReceivingDetailPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/receiving', component: ReceivingPage },
  { path: '/receiving/:poNumber', component: ReceivingDetailPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
