import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('@/view/pages/Home.vue');
const Graph = () => import('@/view/pages/Graph.vue');
const Setting = () => import('@/view/pages/Setting.vue');


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/graph', name: 'About', component: Graph },
    { path: '/setting', name: 'Setting', component: Setting },

  ],
});
export default router;
