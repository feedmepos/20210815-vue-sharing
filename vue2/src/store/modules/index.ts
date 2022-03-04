import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import { TodoModule } from "@/store/modules/todos";

export let todoModule: TodoModule;

// #SHARE 10: export vuex
export function initializeModules(store: Store<any>): void {
  todoModule = getModule(TodoModule, store);
}

export const modules = {
  todo: TodoModule,
};
