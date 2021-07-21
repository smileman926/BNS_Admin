import { generateImgNameForAwsUpload, uploadImgToAws } from '../utils/services/S3';

async function uploadImages({ mainImage, listImages, type }) {
  listImages.forEach((el) => (el.image_url = generateImgNameForAwsUpload(el, type)));
  await Promise.all([...listImages.map((el) => uploadImgToAws(el, el.image_url))]);
  return {
    mainImage: listImages.find((el) => el.name === mainImage.name).image_url,
    imageLists: listImages.map((el) => el.image_url),
  };
}

export default uploadImages;
