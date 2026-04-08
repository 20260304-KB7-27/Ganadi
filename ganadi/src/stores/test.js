// src/stores/todoStore.js
import { defineStore } from 'pinia';
import { fetchTodos, createTodo, updateTodo, deleteTodoApi } from '@/api/test';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false,
  }),

  actions: {
    async getTodos() {
      this.loading = true;
      try {
        const res = await fetchTodos();
        this.todos = res.data;
      } finally {
        this.loading = false;
      }
    },

    async addTodo(text) {
      const newTodo = {
        text,
        done: false,
      };

      const res = await createTodo(newTodo);
      this.todos.push(res.data);
    },

    async toggleTodo(todo) {
      const res = await updateTodo(todo.id, {
        done: !todo.done,
      });

      const index = this.todos.findIndex((t) => t.id === todo.id);
      this.todos[index] = res.data;
    },

    async deleteTodo(id) {
      await deleteTodoApi(id);
      this.todos = this.todos.filter((t) => t.id !== id);
    },
  },
});
