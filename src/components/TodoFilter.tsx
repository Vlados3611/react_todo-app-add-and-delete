import React, { useContext } from 'react';

import classNames from 'classnames';
import { FilterType } from '../enums/SortType';
import { TodoContext } from '../TodoContext';

import { Todo } from '../types/Todo';

export const TodoFilter: React.FC = () => {
  const {
    todos,
    filteredTodos,
    sortType,
    setAllTodos,
    setActiveTodos,
    setCompletedTodos,
    clearAllCompleted,
  } = useContext(TodoContext);

  const completedTodos = filteredTodos.filter((todo: Todo) => (
    todo.completed
  ));

  const activeTodos = todos.filter((todo: Todo) => (
    !todo.completed
  ));

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: sortType === FilterType.All,
            },
          )}
          onClick={setAllTodos}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: sortType === FilterType.Active,
            },
          )}
          onClick={setActiveTodos}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: sortType === FilterType.Completed,
            },
          )}
          onClick={setCompletedTodos}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {
        completedTodos.length && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => clearAllCompleted(filteredTodos)}
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
