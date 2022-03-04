import Vue from "vue";
import Vuex, { Store } from "vuex";
import { initializeModules, modules } from "./modules";
export * from "./modules";

Vue.use(Vuex);
const initializer = (store: Store<any>) => initializeModules(store);
const store = new Vuex.Store({
  plugins: [initializer],
  modules,
});
export default store;
