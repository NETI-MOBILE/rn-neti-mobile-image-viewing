import { OrientationType } from 'react-native-orientation-locker';
export default class OrientationHelper {
    static isNotChangeOrientation(currentOrientation, stateOrientation) {
        return (currentOrientation === stateOrientation ||
            stateOrientation === OrientationType['FACE-DOWN'] ||
            stateOrientation === OrientationType['FACE-UP'] ||
            stateOrientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
            stateOrientation === OrientationType['UNKNOWN']);
    }
    static isLandscapeOrientation(orientation) {
        return orientation === OrientationType['LANDSCAPE-LEFT'] || orientation === OrientationType['LANDSCAPE-RIGHT'];
    }
    static isLeftLandscapeOrientation(orientation) {
        return orientation === OrientationType['LANDSCAPE-LEFT'];
    }
    static isRightLandscapeOrientation(orientation) {
        return orientation === OrientationType['LANDSCAPE-RIGHT'];
    }
    static isPortraitOrientation(orientation) {
        return (orientation === OrientationType['PORTRAIT'] ||
            orientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
            orientation === OrientationType['UNKNOWN'] ||
            orientation === OrientationType['FACE-DOWN'] ||
            orientation === OrientationType['FACE-UP']);
    }
}
