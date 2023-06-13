/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useContext } from 'react';

import { TodoContext } from '../TodoContext';

export const TodoSearch: React.FC = () => {
  const {
    filteredTodos,
    isLoaded,
    onSubmit,
    changeAllTodos,
    setErrorToList,
  } = useContext(TodoContext);

  const [inputTitle, setInputTitle] = useState<string>('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (inputTitle.length > 0) {
          onSubmit(inputTitle);
          setInputTitle('');
        } else {
          setErrorToList('Title can`t be empty');
        }
      }}
    >
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        onClick={() => changeAllTodos(filteredTodos)}
      />

      {/* Add a todo on form submit */}
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputTitle}
        onChange={(event) => {
          setInputTitle(event.target.value);
        }}
        disabled={isLoaded}
      />
    </form>
  );
};
