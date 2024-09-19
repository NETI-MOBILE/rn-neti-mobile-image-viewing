import { OrientationType } from 'react-native-orientation-locker';

export default class OrientationHelper {
  static isNotChangeOrientation(currentOrientation: OrientationType, stateOrientation: OrientationType): boolean {
    return (
      currentOrientation === stateOrientation ||
      stateOrientation === OrientationType['FACE-DOWN'] ||
      stateOrientation === OrientationType['FACE-UP'] ||
      stateOrientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
      stateOrientation === OrientationType['UNKNOWN']
    );
  }

  static isLandscapeOrientation(orientation: OrientationType) {
    return orientation === OrientationType['LANDSCAPE-LEFT'] || orientation === OrientationType['LANDSCAPE-RIGHT'];
  }

  static isLeftLandscapeOrientation(orientation: OrientationType) {
    return orientation === OrientationType['LANDSCAPE-LEFT'];
  }

  static isRightLandscapeOrientation(orientation: OrientationType) {
    return orientation === OrientationType['LANDSCAPE-RIGHT'];
  }

  static isPortraitOrientation(orientation: OrientationType) {
    return (
      orientation === OrientationType['PORTRAIT'] ||
      orientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
      orientation === OrientationType['UNKNOWN'] ||
      orientation === OrientationType['FACE-DOWN'] ||
      orientation === OrientationType['FACE-UP']
    );
  }
}
