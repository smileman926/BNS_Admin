import Amplify, { Storage } from 'aws-amplify';
import uid from 'uid';

Amplify.configure({
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_REGION,
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
  },
});
export const generateImgNameForAwsUpload = (data, type = 'unknown_entity') => {
  if (!data) {
    return;
  }
  const fileFormat = data.name.split('.');
  return `image-${type}-${uid(9)}.${fileFormat[1]}`;
};
export const uploadImgToAws = (data, key) => {
  return Storage.put(key, data, {
    contentType: data.type,
  });
};

// export const downloadImage = async (url) => await Storage.get(url);
export const downloadImage = ((url) => `https://${process.env.REACT_APP_BUCKET_NAME}.s3.amazonaws.com/public/${url}`);
