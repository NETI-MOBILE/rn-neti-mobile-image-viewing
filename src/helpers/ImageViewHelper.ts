import { Image } from 'react-native';

import { IImageModel, IImageSize, Nullable } from '../types';

export default class ImageViewHelper {
  static getImageAspect = async (image: IImageModel) => {
    if (!image.url && (!image.sizes?.width || !image.sizes?.height)) {
      // Default aspect value
      return 1;
    }

    let aspect = ImageViewHelper.getImageAspectBySize(image.sizes);

    if (!aspect) {
      aspect = await ImageViewHelper.getImageAspectByUrl(image.url);
    }

    // Default aspect value
    return aspect ?? 1;
  };

  static getImageAspectByUrl = async (imageUrl: string): Promise<Nullable<number>> => {
    if (!imageUrl) {
      return null;
    }

    return new Promise(resolve => {
      if (imageUrl) {
        // to prevent memory leak, when unmount components, it is necessary to extend the method with receiving data cancellation
        Image.getSize(
          imageUrl,
          (width: number, height: number) => {
            resolve(Number((width / height).toFixed(2)));
          },
          () => {
            resolve(null);
          },
        );
      }
    }) as Promise<Nullable<number>>;
  };

  static getImageAspectBySize = (size: IImageSize | undefined) => {
    if (!size?.width || !size.height) {
      return null;
    }

    return Number((size.width / size.height).toFixed(2));
  };
}
