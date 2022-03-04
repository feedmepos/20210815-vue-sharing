<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from "vue";
import { todoStore, todoStoreKey } from "./store/todos";

export default defineComponent({
  setup() {
    // #SHARE 14: import vuex
    provide(todoStoreKey, todoStore);
  },
});
</script>

<style>
@import "./assets/index.css";
</style>
