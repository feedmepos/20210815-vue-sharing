import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.directive("todo-focus", function (el, binding) {
  if (binding.value) {
    el.focus();
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
