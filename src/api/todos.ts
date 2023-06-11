import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10562;

const ENDS_URL = '/todos';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const setTodosToServer = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>(`${ENDS_URL}?userId=${USER_ID}`, data);
};

export const deleteTodoFromServer = (todoId: number): Promise<unknown> => {
  return client.delete(`${ENDS_URL}/${todoId}`);
};

export const updateTodoOnServer = (
  todoId: number,
  title: string,
): Promise<Todo> => {
  return client.patch<Todo>(`${ENDS_URL}/${todoId}`, { title });
};

export const updateTodoByCompleted = (
  todoId: number,
  completed: boolean,
): Promise<Todo> => {
  return client.patch<Todo>(`${ENDS_URL}/${todoId}`, { completed });
};
