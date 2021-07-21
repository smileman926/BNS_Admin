import React, { useCallback } from 'react';

import styles from './index.module.scss';

const DeleteActionIcon = (handleDelete) => {
  const handleClick = useCallback(() => {
    handleDelete();
  }, [handleDelete]);
  return (
    <div className={styles.container}>
      <span className={styles.span}>
        Action:
      </span>
      <img className={styles.icon} alt="" src="/assets/icons/trash_can.svg" />
    </div>
  );
};
export default DeleteActionIcon;
