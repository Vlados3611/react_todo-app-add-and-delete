import React, { useContext } from 'react';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { TodoInfo } from './TodoInfo';

import { TodoContext } from '../TodoContext';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={tempTodo.id}
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
