import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入 flexible 用于设置 rem 基准值
import "lib-flexible/flexible.js";

import VCconsole from "vconsole";
if (window.config.showVConsole) {
  new VCconsole();
}

import * as filters from "./filters";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

// 路由拦截
router.beforeEach((to, from, next) => {
  let userName = localStorage.getItem("userName");
  if (userName) {
    if (to.path === "/login") {
      next("/home");
    } else {
      next();
    }
  } else {
    if (to.path !== "/login") {
      next("/login");
    } else {
      next();
    }
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
