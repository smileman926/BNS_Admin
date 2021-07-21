import styles from './index.module.scss';
import React, { useCallback, useRef } from 'react';

const DropZone = ({ onChange }) => {
  const inputRef = useRef(null);

  const onUpload = useCallback(()=> inputRef.current.click(), [inputRef]);

  const onSelect = useCallback((e) => onChange(e.target.files),[]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(e.dataTransfer.files);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return <div
    className={styles.dropZone}
    onClick={onUpload}
    onDragOver={onDragOver}
    role="presentation"
    onDrop={onDrop}
  >
    <input
      className={styles.fileInpt}
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={onSelect}
    />
    <div className={styles.textCont}>
      <span className={styles.span}>DROP PRODUCT PICTURE HERE</span>
      <div className={styles.spansCont}>
        <span className={styles.span}>OR</span>
        {' '}
        <span className={styles.chSpan}>CHOOSE PICTURE</span>
      </div>
    </div>
  </div>
};

export default DropZone;
