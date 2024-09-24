import { Image } from 'react-native';
import { ImageViewingColors } from '../settings/ImageViewingColors';
import { ImageViewingConfig } from '../settings/ImageViewingConfig';
export default class ImageViewHelper {
    static getImageAspect = async (image) => {
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
    static getImageAspectByUrl = async (imageUrl) => {
        if (!imageUrl) {
            return null;
        }
        return new Promise(resolve => {
            if (imageUrl) {
                // to prevent memory leak, when unmount components, it is necessary to extend the method with receiving data cancellation
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
    static getImageViewConfig = (config) => {
        if (config) {
            const swipeConfig = Object.assign({}, ImageViewingConfig.swipeAnimation, config.swipeAnimation ?? {});
            return Object.assign({}, ImageViewingConfig, config, { swipeAnimation: swipeConfig });
        }
        return ImageViewingConfig;
    };
    static getImageViewColors = (colors) => {
        if (colors) {
            return Object.assign({}, ImageViewingColors, colors);
        }
        return ImageViewingColors;
    };
}
