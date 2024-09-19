import { Image } from 'react-native';
export default class ImageViewRenderHelper {
    static getImageAspectByUrl = async (imageUrl) => {
        if (!imageUrl) {
            return null;
        }
        return new Promise(resolve => {
            if (imageUrl) {
                // для предотвращения memory leak, при unmount компонентов, необходимо расширить метод отменой получения данных
                Image.getSize(imageUrl, (width, height) => {
                    resolve(Number((width / height).toFixed(2)));
                }, () => {
                    resolve(null);
                });
            }
        });
    };
    static getImageAspectBySize = (size) => {
        if (!size?.width || !size.height) {
            return null;
        }
        return Number((size.width / size.height).toFixed(2));
    };
    static getImageAspect = async (image) => {
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
