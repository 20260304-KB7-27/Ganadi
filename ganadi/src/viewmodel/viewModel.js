// viewmodel/useTodoViewModel.js
import { ref, onMounted } from 'vue';
import {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from '@/services/todoService';

export function useTodoViewModel() {
  const todos = ref([]);
  const newTodoText = ref('');
  const loading = ref(false);

  // 초기 데이터 로딩
  const fetchTodos = () => {
    loading.value = true;
    todos.value = getTodos();
    loading.value = false;
  };

  // 추가
  const handleAddTodo = () => {
    if (!newTodoText.value.trim()) return;

    const newTodo = addTodo(newTodoText.value);
    todos.value.push(newTodo);

    newTodoText.value = '';
  };

  // 토글
  const handleToggleTodo = (id) => {
    toggleTodo(id);
    todos.value = getTodos(); // 동기화
  };

  // 삭제
  const handleDeleteTodo = (id) => {
    deleteTodo(id);
    todos.value = getTodos();
  };

  onMounted(fetchTodos);

  return {
    // state
    todos,
    newTodoText,
    loading,

    // actions
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
  };
}
