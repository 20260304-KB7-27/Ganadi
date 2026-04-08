import axios from '@/utils/axios'; // 이미 axios.js 만들어둔거 활용

// 조회
export const fetchTodos = () => axios.get('/test');

// 추가
export const createTodo = (todo) => axios.post('/test', todo);

// 수정
export const updateTodo = (id, data) => axios.patch(`/test/${id}`, data);

// 삭제
export const deleteTodoApi = (id) => axios.delete(`/test/${id}`);
