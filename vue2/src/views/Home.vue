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
            v-for="(todo, index) in filteredTodos"
            :key="index"
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
          <li v-for="filter in filterOptions" :key="filter.key">
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
import { Component, Vue, Watch } from "vue-property-decorator";
import TodoItem from "@/components/TodoItem.vue";
// #SHARE 12: use vuex
import { todoModule } from "@/store";
import { TodoEntity, TODO_FILTER } from "@/store/modules/todos";

// #SHARE 1: construct
@Component({
  components: {
    TodoItem,
  },
})
export default class Home extends Vue {
  // #SHARE 2: data()
  /**
   * data() {
   *   return {
   *     newTodoTitle = "",
   *   }
   * }
   */
  newTodoTitle = "";

  // #SHARE 3: computed
  get allDone() {
    return todoModule.pendingTodos.length === 0;
  }

  set allDone(e) {
    todoModule.setAllTodos(todoModule.pendingTodos.length > 0);
  }

  // #SHARE 4: lifecycle
  mounted() {
    todoModule.loadSample();
  }

  // #SHARE 5: watch
  @Watch("$route.query.filter", { immediate: true })
  onQueryChange(newFilter: TODO_FILTER) {
    todoModule.setFilter(newFilter);
  }

  get filterOptions() {
    return Object.entries(TODO_FILTER).map((e) => ({
      key: e[0],
      label: e[1]
        .toLowerCase()
        .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()),
      onClick: () => {
        this.$router.replace({ query: { filter: e[1] } });
      },
      selected: e[1] === todoModule.filter,
    }));
  }

  get todos() {
    return todoModule.todos;
  }

  get filteredTodos() {
    return todoModule.filteredTodos;
  }

  get remaining() {
    return todoModule.pendingTodos.length;
  }

  // #SHARE 6: methods
  addTodo() {
    todoModule.createTodo(this.newTodoTitle);
    this.newTodoTitle = "";
  }

  removeTodo(todo: TodoEntity) {
    todoModule.deleteTodo(todo.id);
  }

  updateTodo(todo: TodoEntity) {
    todoModule.updateTodo(todo);
  }

  removeCompleted() {
    todoModule.removeCompletedTodos();
  }
}
</script>
