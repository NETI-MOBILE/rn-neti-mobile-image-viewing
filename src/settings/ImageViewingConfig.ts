import { Platform } from 'react-native';

export const ImageViewingConfig = {
  minScale: 1,
  maxScale: 3,

  // Для iOS лучше не делать значение больше, иначе увеличение становится слишком резким.
  decreaseZoomSpeed: Platform.OS === 'ios' ? 0.85 : 1,
  zoomInDuration: 600,
  zoomOutDuration: 300,

  swipeWidthFactor: 2,
  swipeHeightFactor: 3,
  swipeAnimation: {
    damping: 17,
    stiffness: 85,
  },
};
