import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('@/view/pages/Home.vue');
const About = () => import('@/view/pages/About.vue');
const Members = () => import('@/view/pages/Members.vue');
const Videos = () => import('@/view/pages/Videos.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/members', name: 'Members', component: Members },
    { path: '/videos', name: 'Videos', component: Videos },
  ],
});
export default router;
