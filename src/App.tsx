/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { TodoList } from './components/TodoList';

import { Todo } from './types/Todo';
import { FilterType } from './enums/SortType';
import { Notification } from './types/Notification';

import { TodoFilter } from './components/TodoFilter';
import { TodoContext } from './TodoContext';
import { TodoSearch } from './components/TodoSearch';
import { TodoNotification } from './components/TodoNotification';

import { UserWarning } from './UserWarning';

import {
  USER_ID,
  getTodos,
  setTodosToServer,
  deleteTodoFromServer,
  updateTodoByCompleted,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<FilterType>(FilterType.All);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const setErrorToList = (reason: string) => {
    const getId: (number[] | number) = (
      notificationList.length > 0
        ? Math.max(...notificationList.map((error) => error.id))
        : 0
    );

    const newError: Notification = {
      id: getId + 1,
      reason,
      hidden: false,
    };

    setNotificationList((prevState: Notification[]) => (
      [...prevState, newError]
    ));
  };

  const loadTodos = async () => {
    try {
      const foundTodos = await getTodos(USER_ID);

      setTodos(foundTodos);
    } catch {
      setErrorToList('Can`t load todos');
    }
  };

  const onSubmit = useCallback(async (title: string) => {
    setIsLoaded(false);
    try {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
      });

      setLoadingIds(prevState => [...prevState, newTodo.id]);

      const todo = await setTodosToServer(newTodo);

      setTodos(
        (prevState: Todo[]) => [...prevState, todo],
      );

      setIsLoaded(true);
    } catch {
      setIsLoaded(false);
      throw new Error();
    } finally {
      setTempTodo(null);
      setLoadingIds([]);
    }
  }, [todos]);

  const onDelete = useCallback(
    async (todoId: number) => {
      try {
        setLoadingIds((prevState: number[]) => (
          [...prevState, todoId]
        ));

        await deleteTodoFromServer(todoId);

        setTodos(prevState => prevState.filter((todo) => (
          todo.id !== todoId
        )));
      } catch {
        setErrorToList('Can`t delete todo');
      } finally {
        setLoadingIds([]);
      }
    }, [todos],
  );

  const onComplete = useCallback((
    id: number,
    completed: boolean,
  ) => {
    setTodos((prevState: Todo[]) => (
      prevState.map((todo: Todo) => {
        if (todo.id !== id) {
          return todo;
        }

        return { ...todo, completed };
      })
    ));
  }, []);

  const onEdit = useCallback((
    todoId: number,
    title: string,
  ) => {
    setTodos((prevState: Todo[]) => (
      prevState.map(
        (todo: Todo) => {
          if (todo.id !== todoId) {
            return todo;
          }

          return { ...todo, title };
        },
      )
    ));
  }, []);

  const clearAllCompleted = useCallback(async (
    todosList: Todo[],
  ) => {
    try {
      const todosCompleted = todosList.filter(
        (todo: Todo) => todo.completed,
      );

      const foundTodosId = todosCompleted.map(
        (todo: Todo) => todo.id,
      );

      setLoadingIds(foundTodosId);

      await Promise.all(todosCompleted.map(
        (todo: Todo) => deleteTodoFromServer(todo.id),
      ));

      setTodos(prevState => (prevState.filter(
        (todo: Todo) => !foundTodosId.includes(todo.id),
      )));
    } catch {
      setErrorToList('Can`t clear completed');
    } finally {
      setLoadingIds([]);
    }
  }, []);

  const changeAllTodos = useCallback(async (
    todoList: Todo[],
  ) => {
    const filteredTodos = todoList.filter((todo: Todo) => (
      todo.completed
    ));

    const isAllCompleted = (
      filteredTodos.length === todoList.length
    );

    try {
      setLoadingIds(
        isAllCompleted
          ? (
            filteredTodos.map((todo: Todo) => (
              todo.id
            ))
          ) : (
            todoList
              .filter((todo: Todo) => (
                !todo.completed
              ))
              .map((todo: Todo) => (
                todo.id
              ))
          ),
      );

      await Promise.all(
        isAllCompleted
          ? (
            filteredTodos.map((todo: Todo) => (
              updateTodoByCompleted(todo.id, false)
            ))
          ) : (
            todoList.map((todo: Todo) => {
              if (todo.completed) {
                return todo;
              }

              return updateTodoByCompleted(todo.id, true);
            })
          ),
      );

      setTodos((prevState: Todo[]) => (
        isAllCompleted
          ? (
            prevState.map((todo) => ({
              ...todo,
              completed: false,
            }))
          ) : (
            prevState.map((todo) => {
              if (todo.completed) {
                return todo;
              }

              return { ...todo, completed: true };
            })
          )
      ));
    } catch {
      setErrorToList(
        isAllCompleted
          ? 'Can`t remove all'
          : 'Can`t complete all',
      );
    } finally {
      setLoadingIds([]);
    }
  }, []);

  const getFilteredTodos = useCallback((
    todosList: Todo[],
    sortBy: FilterType,
  ) => {
    return [...todosList].filter((todo) => {
      switch (sortBy) {
        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, sortType]);

  const removeError = useCallback((
    errorId: number,
    firstTimeOut: number,
    secondTimeOut: number,
  ) => {
    setTimeout(() => {
      setNotificationList((prevState: Notification[]) => (
        prevState.map((error: Notification) => {
          if (error.id !== errorId) {
            return error;
          }

          return { ...error, hidden: true };
        })
      ));

      setTimeout(() => {
        setNotificationList((prevState: Notification[]) => (
          prevState.filter((error: Notification) => (
            error.id !== errorId
          ))
        ));
      }, secondTimeOut);
    }, firstTimeOut);
  }, []);

  const removeErrorByClick = useCallback((errorId: number) => {
    removeError(errorId, 0, 500);
  }, []);

  const removeErrorByDefault = useCallback((errorId: number) => {
    removeError(errorId, 2500, 500);
  }, []);

  const setActiveTodos = useCallback(() => {
    setSortType(FilterType.Active);
  }, []);

  const setCompletedTodos = useCallback(() => {
    setSortType(FilterType.Completed);
  }, []);

  const setAllTodos = useCallback(() => {
    setSortType(FilterType.All);
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, sortType);
  }, [todos, sortType]);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (notificationList.length > 0) {
    removeErrorByDefault(notificationList[0].id);
  }

  return (
    <TodoContext.Provider value={{
      todos,
      filteredTodos,
      tempTodo,
      sortType,
      isLoaded,
      loadingIds,
      onSubmit,
      onDelete,
      onComplete,
      onEdit,
      setAllTodos,
      setLoadingIds,
      setActiveTodos,
      setCompletedTodos,
      removeErrorByClick,
      clearAllCompleted,
      changeAllTodos,
      setErrorToList,
    }}
    >
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <TodoSearch />
          </header>

          <TodoList />

          {todos.length && <TodoFilter />}
        </div>

        {notificationList
          .slice(0, 3)
          .map((notification: Notification) => (
            <TodoNotification
              key={notification.id}
              notification={notification}
            />
          ))}
      </div>
    </TodoContext.Provider>
  );
};
