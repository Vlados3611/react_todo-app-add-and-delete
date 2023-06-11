import React, { useContext } from 'react';

import classNames from 'classnames';

import { Notification } from '../types/Notification';

import { TodoContext } from '../TodoContext';

type Props = {
  notification: Notification;
};

export const TodoNotification: React.FC<Props> = React.memo(
  ({ notification }) => {
    const {
      id,
      reason,
      hidden,
    } = notification;

    const { removeErrorByClick } = useContext(TodoContext);

    return (
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => {
            removeErrorByClick(id);
          }}
        >
          x
        </button>
        {reason}
      </div>
    );
  },
);
