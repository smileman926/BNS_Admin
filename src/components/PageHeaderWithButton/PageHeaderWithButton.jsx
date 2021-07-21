import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import style from './PageHeaderWithButton.module.scss';

const PageHeaderWithButton = ({
  title, buttonTitle, path, clickHandler,
}) => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    if (clickHandler) {
      clickHandler();
    } else {
      history.push(path);
    }
  }, []);
  return (
    <div className={style.container}>
      <span className={style.title}>
        {title}
      </span>
      {buttonTitle
    && (
    <button onClick={handleClick} className={style.btn}>
      <span>
        {buttonTitle}
      </span>
    </button>
    )}
    </div>
  );
};

export default PageHeaderWithButton;
