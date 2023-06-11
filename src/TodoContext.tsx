import { SetStateAction, createContext } from 'react';
import { FilterType } from './enums/SortType';
import { Todo } from './types/Todo';

type State = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  sortType: FilterType;
  isLoaded: boolean;
  loadingIds: number[];
  onSubmit: (title: string) => void;
  onDelete: (todoId: number) => void;
  onEdit: (todoId: number, title: string) => void;
  onComplete: (id: number, completed: boolean) => void;
  setAllTodos: () => void;
  setLoadingIds: (value: SetStateAction<number[]>) => void;
  setActiveTodos: () => void;
  setCompletedTodos: () => void;
  removeErrorByClick: (id: number) => void;
  clearAllCompleted: (todoList: Todo[]) => void;
  changeAllTodos: (todoList: Todo[]) => void;
  setErrorToList: (reason: string) => void;
};

export const TodoContext = createContext<State>({
  todos: [],
  filteredTodos: [],
  tempTodo: null,
  sortType: FilterType.All,
  isLoaded: false,
  loadingIds: [],
  onSubmit: async () => {},
  onDelete: async () => {},
  onComplete: () => {},
  onEdit: () => {},
  setAllTodos: () => {},
  setLoadingIds: () => {},
  setActiveTodos: () => {},
  setCompletedTodos: () => {},
  removeErrorByClick: () => {},
  clearAllCompleted: () => {},
  changeAllTodos: () => {},
  setErrorToList: () => {},
});
