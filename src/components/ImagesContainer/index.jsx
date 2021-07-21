import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';
import { downloadImage } from '../../utils/services/S3';

const ImagesContainer = ({
  files, handleDeleteImage, handleSelectImage, showUploadedImages, selectedImage
}) => {
  return (
    <div className={clsx(styles.imgCont, showUploadedImages && styles.showImages)} onDrop={(e) => e.stopPropagation()}>
      {files.map((item, i) => (
        <div className={styles.imagesCont} key={item.name}>
          <img className={clsx(styles.imgs, item === selectedImage && styles.active)} src={item.id ? downloadImage(item.image_url) : URL.createObjectURL(item)} onClick={() => handleSelectImage(item)} />
          <img className={styles.imgDelete} src="/assets/icons/delete.svg" onClick={() => handleDeleteImage(item)} />
        </div>
      ))}
    </div>
  );
};

export default ImagesContainer;
