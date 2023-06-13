import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

import { TodoContext } from '../TodoContext';

import {
  updateTodoByCompleted,
  updateTodoOnServer,
} from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({ todo }) => {
    const {
      id,
      title,
      completed,
    } = todo;

    const [isChecked, setChecked] = useState<boolean>(completed);
    const [isEdited, setEdited] = useState<boolean>(false);
    const [inputTitle, setInputTitle] = useState<string>(title);

    const inputField = useRef<HTMLInputElement>(null);

    const isDone = inputTitle.trim().length < 1;
    const isChanged = title === inputTitle;

    const {
      filteredTodos,
      loadingIds,
      onDelete,
      onComplete,
      onEdit,
      setLoadingIds,
      setErrorToList,
    } = useContext(TodoContext);

    const setCurrentValue = (event: ChangeEvent<HTMLInputElement>) => {
      setInputTitle(event.target.value);
    };

    const handleComplete = async () => {
      if (!isEdited) {
        try {
          setLoadingIds((prevState: number[]) => (
            [...prevState, id]
          ));

          await updateTodoByCompleted(id, !isChecked);

          setChecked(prevState => !prevState);
          onComplete(id, !isChecked);
        } catch {
          setErrorToList('Can`t complete current todo');
        } finally {
          setLoadingIds([]);
        }
      }
    };

    const handleCancel = () => {
      setEdited(false);
      setInputTitle(title);
    };

    const handleSubmit = async () => {
      if (isChanged) {
        setEdited(false);
      } else if (!isDone) {
        try {
          setLoadingIds((prevState: number[]) => (
            [...prevState, id]
          ));

          await updateTodoOnServer(id, inputTitle);

          onEdit(id, inputTitle);
          setEdited(false);
          setInputTitle('');
        } catch {
          setErrorToList('Can`t update current todo');
        } finally {
          setLoadingIds([]);
        }
      } else {
        setErrorToList('Title can`t be empty');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    useEffect(() => {
      if (inputField.current) {
        inputField.current.focus();
      }

      setInputTitle(title);

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isEdited]);

    useEffect(() => {
      setChecked(completed);
    }, [filteredTodos]);

    return (
      <>
        <div
          key={id}
          className={classNames(
            'todo',
            {
              completed: isChecked,
            },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={isChecked}
              onChange={handleComplete}
            />
          </label>

          {
            isEdited
              ? (
                <input
                  type="text"
                  className={classNames(
                    'todo__title-field',
                    {
                      'todo__title-field--error': isDone,
                    },
                  )}
                  placeholder="Empty todo will be deleted"
                  value={inputTitle}
                  onChange={setCurrentValue}
                  onBlur={handleSubmit}
                  ref={inputField}
                />
              ) : (
                <span
                  className="todo__title"
                  onDoubleClick={() => setEdited(true)}
                >
                  {title}
                </span>
              )
          }

          {
            !isEdited && (
              <button
                type="button"
                className="todo__remove"
                onClick={() => onDelete(id)}
              >
                ×
              </button>
            )
          }

          <div
            className={classNames(
              'modal overlay',
              {
                'is-active': loadingIds.includes(id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </>
    );
  },
);
