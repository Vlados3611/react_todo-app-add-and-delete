import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const ENDS_URL = '/todos';
const USER_ID = '?userId=10562';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const setTodosToServer = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo[]>(`${ENDS_URL}${USER_ID}`, data);
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`${ENDS_URL}/${todoId}`);
};

export const updateTodoOnServer = (todoId: number, title: string) => {
  return client.patch(`${ENDS_URL}/${todoId}`, { title });
};

export const updateTodoByCompleted = (todoId: number, completed: boolean) => {
  return client.patch(`${ENDS_URL}/${todoId}`, { completed });
};
