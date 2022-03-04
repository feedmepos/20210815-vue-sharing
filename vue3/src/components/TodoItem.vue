<template>
  <li
    class="todo"
    :class="{
      completed: todo.completed,
      editing: editMode,
    }"
  >
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        :value="todo.completed"
        @input="onToggle"
      />
      <label @dblclick="startEdit()">{{ todo.title }}</label>
      <button class="destroy" @click="remove"></button>
    </div>
    <input
      class="edit"
      type="text"
      ref="titleInput"
      v-model="newTitle"
      @blur="onConfirm"
      @keydown.enter="onEnter"
      @keydown.esc="onEsc"
    />
  </li>
</template>

<script lang="ts">
import { TodoEntity } from "@/store/todos";
import { defineComponent, nextTick, PropType, ref } from "@vue/runtime-core";

export default defineComponent({
  props: {
    // #SHARE 7: props
    todo: {
      type: Object as PropType<TodoEntity>,
      required: true,
    },
  },
  emits: ["update", "remove"],
  setup(props, { emit }) {
    const newTitle = ref("");
    const editMode = ref(false);
    // #SHARE 8: refs
    const titleInput = ref<HTMLInputElement>();

    const onToggle = () => {
      emit("update", {
        ...props.todo,
        completed: !props.todo.completed,
      });
    };

    const onConfirm = () => {
      editMode.value = false;
      if (newTitle.value === "") {
        emit("remove", props.todo);
      } else if (newTitle.value !== props.todo.title) {
        emit("update", {
          ...props.todo,
          title: newTitle.value,
        });
      }
    };

    const startEdit = () => {
      editMode.value = true;
      newTitle.value = props.todo.title;
      nextTick(() => titleInput.value?.focus());
    };

    const onEnter = () => {
      editMode.value = false;
    };

    const onEsc = () => {
      newTitle.value = props.todo.title;
      editMode.value = false;
    };

    return {
      newTitle,
      editMode,
      titleInput,
      onToggle,
      onConfirm,
      startEdit,
      onEnter,
      onEsc,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
