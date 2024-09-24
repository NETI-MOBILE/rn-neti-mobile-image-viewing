import { useState } from 'react';
import { StatusBar } from 'react-native';
import { OrientationType } from 'react-native-orientation-locker';
import { interpolate, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import OrientationHelper from '../helpers/OrientationHelper';
export const useAnimatedImageView = (props) => {
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(0);
    const isShowOverlay = useSharedValue(1);
    const scrollEnabled = useSharedValue(true);
    const [isShowImage, setShowImage] = useState(false);
    const modalStyle = useAnimatedStyle(() => {
        return {
            zIndex: interpolate(opacity.value, [0, 1], [-1, 2]),
            opacity: interpolate(opacity.value, [0, 1], [0, 1]),
        };
    });
    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(rotate.value, [-1, 0, 1], [90, 0, -90])}deg` }],
        };
    });
    const footerStyle = useAnimatedStyle(() => {
        if (props.orientation === OrientationType['PORTRAIT'] ||
            props.orientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
            props.orientation === OrientationType['UNKNOWN'] ||
            props.orientation === OrientationType['FACE-DOWN'] ||
            props.orientation === OrientationType['FACE-UP']) {
            return {
                transform: [{ translateY: interpolate(isShowOverlay.value, [0, 1], [800, 0 - (props.insets?.bottom ?? 0)]) }],
            };
        }
        return {
            transform: [
                {
                    translateX: interpolate(isShowOverlay.value, [0, 1], [props.orientation === OrientationType['LANDSCAPE-RIGHT'] ? 800 : -800, 0]),
                },
            ],
        };
    });
    const animatedProps = useAnimatedProps(() => {
        return {
            scrollEnabled: scrollEnabled.value,
        };
    });
    const onZoomBegin = () => {
        scrollEnabled.value = false;
    };
    const onZoomEnd = () => {
        scrollEnabled.value = true;
    };
    const onShow = () => {
        opacity.value = withTiming(1);
        setShowImage(true);
        StatusBar.setBarStyle('light-content');
    };
    const onHide = () => {
        opacity.value = withTiming(0);
        setShowImage(false);
        StatusBar.setBarStyle('dark-content');
    };
    const onChangeOrientation = (orientation) => {
        if (OrientationHelper.isPortraitOrientation(orientation)) {
            rotate.value = withTiming(0, { duration: 500 });
        }
        else if (OrientationHelper.isLeftLandscapeOrientation(orientation)) {
            rotate.value = withTiming(-1, { duration: 500 });
        }
        else if (OrientationHelper.isRightLandscapeOrientation(orientation)) {
            rotate.value = withTiming(1, { duration: 500 });
        }
    };
    const onToggleOverlay = () => {
        if (isShowOverlay.value === 0) {
            isShowOverlay.value = withTiming(1);
        }
        else {
            isShowOverlay.value = withTiming(0);
        }
    };
    return {
        isShowImage,
        modalStyle,
        rotateStyle,
        footerStyle,
        animatedProps,
        onShow,
        onHide,
        onZoomEnd,
        onZoomBegin,
        onToggleOverlay,
        onChangeOrientation,
    };
};
