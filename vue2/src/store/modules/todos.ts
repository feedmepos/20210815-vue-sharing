import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "..";

export interface TodoEntity {
  id: number;
  title: string;
  completed: boolean;
}

export enum TODO_FILTER {
  ALL = "ALL",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

// #SHARE 9: vuex
@Module({
  namespaced: true,
  name: "todo",
  store,
})
export class TodoModule extends VuexModule {
  // #SHARE 13: vuex state
  currentId = 0;
  todos: TodoEntity[] = [];
  filter = TODO_FILTER.ALL;

  // #SHARE 14: vuex getters
  get pendingTodos() {
    return this.todos.filter((t) => !t.completed);
  }

  get filteredTodos() {
    return this.todos.filter((t) => {
      switch (this.filter) {
        case TODO_FILTER.ALL:
          return true;
        case TODO_FILTER.COMPLETED:
          return t.completed;
        case TODO_FILTER.PENDING:
          return !t.completed;
      }
    });
  }

  // #SHARE 15: vuex mutation
  @Mutation
  setFilter(filter: TODO_FILTER) {
    this.filter = filter;
  }

  @Mutation
  deleteTodo(id: number) {
    const index = this.todos.findIndex((t) => t.id === id);
    this.todos.splice(index, 1);
  }

  @Mutation
  updateTodo(todo: TodoEntity) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    this.todos.splice(index, 1, todo);
  }

  @Mutation
  createTodo(title: string) {
    this.todos.push({
      id: ++this.currentId,
      title,
      completed: false,
    });
  }

  @Mutation
  setAllTodos(completed = true) {
    this.todos.forEach((t) => {
      t.completed = completed;
    });
  }

  @Mutation
  removeCompletedTodos() {
    this.todos = this.todos.filter((t) => !t.completed);
  }

  // #SHARE 16: vuex action
  @Action({ rawError: true })
  async loadSample() {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        this.createTodo("Learn Vue2");
        this.createTodo("Learn Vue3");
        resolve();
      }, 1000);
    });
  }
}
