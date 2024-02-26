import { ImageType } from '@content-service/contracts';

export const mimetype = (format: ImageType) => {
  switch (format) {
    case ImageType.Jpg:
      return 'image/jpeg';
      break;
    case ImageType.Webp:
      return 'image/webp';
      break;
  }
};
