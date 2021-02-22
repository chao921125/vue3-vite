import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: '/home',
  },
  {
    path: "/index",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Index.vue")
  },
  {
    path: "/home",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
