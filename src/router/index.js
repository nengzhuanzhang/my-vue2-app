import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/home/index.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/search/index.vue"),
  },
  {
    path: "/product",
    name: "product",
    component: () => import("../views/product/index.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/cart/index.vue"),
  },
  {
    path: "/order",
    name: "order",
    component: () => import("../views/order/index.vue"),
  },
  {
    path: "/my",
    name: "my",
    component: () => import("../views/my/index.vue"),
  },
];

const router = new VueRouter({
  routes,
});

// 重复路由报错 修复
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
