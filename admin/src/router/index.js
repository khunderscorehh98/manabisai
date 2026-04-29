import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/spots' },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Login.vue'),
  },
  {
    path: '/spots',
    name: 'Spots',
    component: () => import(/* webpackChunkName: "admin" */ '../views/SpotList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/spots/new',
    name: 'SpotNew',
    component: () => import(/* webpackChunkName: "admin" */ '../views/SpotForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/spots/:id/edit',
    name: 'SpotEdit',
    component: () => import(/* webpackChunkName: "admin" */ '../views/SpotForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import(/* webpackChunkName: "admin" */ '../views/CategoryList.vue'),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((r) => r.meta.requiresAuth) && !store.getters.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
