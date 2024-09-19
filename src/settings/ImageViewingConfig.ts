import { Platform } from 'react-native';

export const ImageViewingConfig = {
  minScale: 1,
  maxScale: 3,

  // For iOS, it is better not to make the value larger, otherwise the zoom-in becomes too fast.
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
