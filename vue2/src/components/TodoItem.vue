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
import { TodoEntity } from "@/store/modules/todos";
import { Component, Emit, Prop, Ref, Vue } from "vue-property-decorator";

@Component
export default class TodoComponent extends Vue {
  newTitle = "";
  editMode = false;
  // #SHARE 7: props
  @Prop({ required: true }) private todo!: TodoEntity;

  // #SHARE 8: refs
  @Ref() titleInput!: HTMLInputElement;

  @Emit()
  remove() {
    return this.todo;
  }

  @Emit()
  update(todo: TodoEntity) {
    return todo;
  }

  onToggle() {
    this.update({
      ...this.todo,
      completed: !this.todo.completed,
    });
  }

  onConfirm() {
    this.editMode = false;
    if (this.newTitle === "") {
      this.remove();
    } else if (this.newTitle !== this.todo.title) {
      this.update({
        ...this.todo,
        title: this.newTitle,
      });
    }
  }

  startEdit() {
    this.editMode = true;
    this.newTitle = this.todo.title;
    this.$nextTick(() => this.titleInput.focus());
  }

  onEnter() {
    this.editMode = false;
  }

  onEsc() {
    this.newTitle = this.todo.title;
    this.editMode = false;
  }
}
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
