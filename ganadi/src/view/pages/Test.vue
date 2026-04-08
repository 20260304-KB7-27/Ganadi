<!-- src/views/TodoView.vue -->
<template>
  <div>
    <h2>Todo List</h2>

    <!-- 입력 -->
    <input v-model="newTodoText" placeholder="할 일 입력" />
    <button @click="handleAddTodo">추가</button>

    <!-- 로딩 -->
    <p v-if="loading">로딩중...</p>

    <!-- 리스트 -->
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <span
          @click="handleToggleTodo(todo.id)"
          :style="{ textDecoration: todo.done ? 'line-through' : 'none' }"
        >
          {{ todo.text }}
        </span>
        <button @click="handleDeleteTodo(todo.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useTodoViewModel } from '@viewmodel/viewModel';

const {
  todos,
  newTodoText,
  loading,
  handleAddTodo,
  handleToggleTodo,
  handleDeleteTodo,
} = useTodoViewModel();
</script>
