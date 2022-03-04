import { reactive, computed, readonly, InjectionKey, provide, ref } from "vue";

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

let currentId = 0;

// #SHARE 9: vuex state
const todos = ref<TodoEntity[]>([]);
const filter = ref(TODO_FILTER.ALL);

// #SHARE 10: vuex getters
const pendingTodos = computed(() => todos.value.filter((t) => !t.completed));
const filteredTodos = computed(() =>
  todos.value.filter((t) => {
    switch (filter.value) {
      case TODO_FILTER.ALL:
        return true;
      case TODO_FILTER.COMPLETED:
        return t.completed;
      case TODO_FILTER.PENDING:
        return !t.completed;
    }
  })
);

// #SHARE 11: vuex mutation
function createTodo(title: string) {
  todos.value.push({
    id: ++currentId,
    title,
    completed: false,
  });
}

function setAllTodos(completed = true) {
  todos.value.forEach((t) => {
    t.completed = completed;
  });
}

function removeCompletedTodos() {
  todos.value = todos.value.filter((t) => !t.completed);
}

function updateTodo(todo: TodoEntity) {
  const index = todos.value.findIndex((t) => t.id === todo.id);
  todos.value.splice(index, 1, todo);
}

function deleteTodo(id: number) {
  const index = todos.value.findIndex((t) => t.id === id);
  todos.value.splice(index, 1);
}

function setFilter(newFilter: TODO_FILTER) {
  filter.value = newFilter;
}

// #SHARE 12: vuex action
async function loadSample() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      createTodo("Learn Vue2");
      createTodo("Learn Vue3");
      resolve();
    }, 1000);
  });
}

// #SHARE 13: export vuex
export const todoStore = readonly({
  todos,
  filter,
  pendingTodos,
  filteredTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  setAllTodos,
  setFilter,
  loadSample,
  removeCompletedTodos,
});
export const todoStoreKey: InjectionKey<typeof todoStore> = Symbol("todo");
