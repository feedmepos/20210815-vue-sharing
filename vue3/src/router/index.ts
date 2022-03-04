import { TODO_FILTER } from "@/store/todos";
import { computed, reactive } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
const routeData = reactive<{
  query: { filter?: TODO_FILTER } & Record<string, any>;
}>({ query: {} });

router.afterEach((route) => {
  routeData.query = route.query;
});

export function useQuery() {
  return computed(() => routeData.query);
}

export default router;
