<template>
  <div>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          autofocus
          autocomplete="off"
          placeholder="What needs to be done?"
          v-model="newTodoTitle"
          @keyup.enter="addTodo"
        />
      </header>
      <section class="main" v-show="todos.length">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          v-model="allDone"
        />
        <label for="toggle-all"></label>
        <ul class="todo-list">
          <todo-item
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
            @remove="removeTodo"
            @update="updateTodo"
          />
        </ul>
      </section>
      <footer class="footer" v-show="todos.length" v-cloak>
        <span class="todo-count">
          <strong>{{ remaining }}</strong> item(s) left
        </span>
        <ul class="filters">
          <li v-for="filter in filters" :key="filter.key">
            <span
              @click="filter.onClick"
              :class="{ selected: filter.selected }"
            >
              {{ filter.label }}
            </span>
          </li>
        </ul>
        <button
          class="clear-completed"
          @click="removeCompleted"
          v-show="todos.length > remaining"
        >
          Clear completed
        </button>
      </footer>
    </section>
  </div>
</template>

<script lang="ts">
import TodoItem from "@/components/TodoItem.vue"; // @ is an alias to /src
import { useQuery } from "@/router";
import { TodoEntity, todoStoreKey, TODO_FILTER } from "@/store/todos";
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  watch,
} from "@vue/runtime-core";
import { useRouter } from "vue-router";

// #SHARE 1: construct
export default defineComponent({
  components: {
    TodoItem,
  },
  setup() {
    // #SHARE 2: data
    const newTodoTitle = ref("");
    // #SHARE 15: use vuex
    const todoStore = inject(todoStoreKey)!;
    const query = useQuery();
    const router = useRouter();

    // #SHARE 3: computed
    const allDone = computed(() => ({
      get() {
        return todoStore.pendingTodos.length === 0;
      },
      set(v: boolean) {
        todoStore.setAllTodos(v);
      },
    }));
    const filters = computed(() => {
      return Object.entries(TODO_FILTER).map((e) => ({
        key: e[0],
        label: e[1]
          .toLowerCase()
          .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()),
        onClick: () => {
          router.replace({ query: { filter: e[1] } });
        },
        selected: e[1] === todoStore.filter,
      }));
    });

    // #SHARE 4: lifecycle
    onMounted(async () => {
      await todoStore.loadSample();
    });

    // #SHARE 5: watch
    watch(
      query,
      (newQuery) => {
        if (newQuery.filter) {
          todoStore.setFilter(newQuery.filter);
        }
      },
      { immediate: true }
    );

    // #SHARE 6: methods
    const addTodo = () => {
      if (newTodoTitle.value !== "") {
        todoStore.createTodo(newTodoTitle.value);
        newTodoTitle.value = "";
      }
    };

    const removeTodo = (todo: TodoEntity) => {
      todoStore.deleteTodo(todo.id);
    };

    const updateTodo = (todo: TodoEntity) => {
      todoStore.updateTodo(todo);
    };

    const removeCompleted = () => {
      todoStore.removeCompletedTodos();
    };

    return {
      newTodoTitle,
      todos: computed(() => todoStore.todos),
      filteredTodos: computed(() => todoStore.filteredTodos),
      remaining: computed(() => todoStore.pendingTodos.length),
      filters,
      allDone,
      addTodo,
      removeTodo,
      updateTodo,
      removeCompleted,
    };
  },
});
</script>
