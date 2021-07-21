import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

const BackgroundImageSelect = ({ disabled }) => {
  const inputRef = useRef();
  const handleSelectFileClick = useCallback(() => {
    inputRef.current.click();
  });
  return (
    <div className={styles.imgContainer}>
      <div className={clsx(styles.imgSquare, styles.dotedBorder, styles.addFileCont)} onClick={handleSelectFileClick} role='presentation'>
        <div className={styles.spanCont}>
          <input type='file' ref={inputRef} className={styles.fileInput} disabled={disabled} />
          <span className={styles.span}>+</span>
          <span> Select File</span>
        </div>
      </div>
      <div className={styles.imgSquare}><img className={styles.img} alt='' src='/assets/img/bg1.jpeg' /></div>
    </div>
  );
};

export default BackgroundImageSelect;
