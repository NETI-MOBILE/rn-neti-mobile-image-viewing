import { Image } from 'react-native';

import { IImageModel, IImageSize, Nullable } from '../types';

export default class ImageViewRenderHelper {
  static getImageAspectByUrl = async (imageUrl: string): Promise<Nullable<number>> => {
    if (!imageUrl) {
      return null;
    }

    return new Promise(resolve => {
      if (imageUrl) {
        // для предотвращения memory leak, при unmount компонентов, необходимо расширить метод отменой получения данных
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

  static getImageAspect = async (image: IImageModel) => {
    if (!image) {
      // Дефолтное значение для aspect
      return 1;
    }

    let aspect = ImageViewRenderHelper.getImageAspectBySize(image.sizes);

    if (!aspect) {
      aspect = await ImageViewRenderHelper.getImageAspectByUrl(image.url);
    }

    if (aspect) {
      return aspect;
    }

    // Дефолтное значение для aspect
    return 1;
  };
}
