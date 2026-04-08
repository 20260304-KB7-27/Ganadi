<!-- src/view/pages/Test.vue -->
<template>
  <div>
    <h2>Todo List</h2>

    <input v-model="newTodoText" placeholder="할 일 입력" />
    <button @click="handleAddTodo">추가</button>

    <p v-if="store.loading">로딩중...</p>

    <ul>
      <li v-for="todo in store.todos" :key="todo.id">
        <span
          @click="store.toggleTodo(todo)"
          :style="{ textDecoration: todo.done ? 'line-through' : 'none' }"
        >
          {{ todo.text }}
        </span>
        <button @click="store.deleteTodo(todo.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/test';

const store = useTodoStore();
const newTodoText = ref('');

onMounted(() => {
  store.getTodos();
});

const handleAddTodo = () => {
  if (!newTodoText.value.trim()) return;

  store.addTodo(newTodoText.value);
  newTodoText.value = '';
};
</script>
