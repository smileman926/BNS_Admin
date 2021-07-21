import { FileImageOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { downloadImage } from '../../utils/services/S3';

function ImageDownload({ src, color, size }) {
  const [url, setUrl] = useState(false);

  useEffect(() => {
    setUrl(downloadImage(src));
    // eslint-disable-next-line
  }, [src]);

  return (
    <Avatar
      shape="square"
      size={size || 50}
      src={url}
      icon={<FileImageOutlined style={{ color: color || '#fff' }} />}
    />
  );
}

export default ImageDownload;
