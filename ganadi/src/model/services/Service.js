// services/todoService.js
import todosData from '@model/data/test.json';

// 깊은 복사 (원본 보호)
let todos = [...todosData];

export function getTodos() {
  return [...todos];
}

export function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text,
    done: false,
  };
  todos.push(newTodo);
  return newTodo;
}

export function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
  }
  return todo;
}

export function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
}
