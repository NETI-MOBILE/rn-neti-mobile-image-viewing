import { useMemo } from 'react';
import { Platform } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { cancelAnimation, clamp, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming, } from 'react-native-reanimated';
import ImageViewHelper from '../helpers/ImageViewHelper';
import OrientationHelper from '../helpers/OrientationHelper';
export const useGestureImageView = ({ isSwipeEnabled = true, isZoomEnabled = true, ...props }) => {
    const isZoomed = useSharedValue(false);
    const isPortraitOrientation = useMemo(() => OrientationHelper.isPortraitOrientation(props.orientation), [props.orientation]);
    const imageViewingConfig = useMemo(() => ImageViewHelper.getImageViewConfig(props.config), [props.config]);
    // Values for enlarging the image
    const scale = useSharedValue(1);
    const baseScale = useSharedValue(1);
    const x = useSharedValue(0);
    const y = useSharedValue(0);
    // Values for the moving position
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const baseTranslationX = useSharedValue(0);
    const baseTranslationY = useSharedValue(0);
    // Values for the swipe position
    const position = useSharedValue(0);
    const isSwipeHorizontal = useSharedValue(0);
    const initialSwipeLocation = useSharedValue({ x: 0, y: 0 });
    useDerivedValue(() => {
        if (scale.value > 1 && !isZoomed.value) {
            isZoomed.value = true;
            runOnJS(props.onZoomBegin)();
        }
        else if (scale.value === 1 && isZoomed.value) {
            isZoomed.value = false;
            runOnJS(props.onZoomEnd)();
        }
    }, [props.onZoomBegin, props.onZoomEnd]);
    const gesture = useMemo(() => {
        const pinch = Gesture.Pinch()
            .onUpdate(event => {
            // We make sure that there is a two-finger tap
            if (event.numberOfPointers === 2) {
                const calculateScale = baseScale.value * (event.scale * imageViewingConfig.decreaseZoomSpeed);
                if (calculateScale < imageViewingConfig.minScale) {
                    scale.value = imageViewingConfig.minScale;
                }
                else if (calculateScale >= imageViewingConfig.maxScale) {
                    scale.value = imageViewingConfig.maxScale;
                }
                else {
                    scale.value = baseScale.value * (event.scale * imageViewingConfig.decreaseZoomSpeed);
                }
                // Getting the center's coordinates
                const centerX = props.width / 2;
                const centerY = props.height / 2;
                if (baseScale.value === imageViewingConfig.minScale) {
                    // At the first scale, we do translate to the middle of pressing relative to the center of the screen
                    baseTranslationX.value = (centerX - x.value) * event.scale;
                    baseTranslationY.value = (centerY - y.value) * event.scale;
                }
                else {
                    // If the scale is already there, then we set the early values
                    baseTranslationX.value = translationX.value;
                    baseTranslationY.value = translationY.value;
                }
                // In order not to go beyond the boundaries at scaling, we calculate the maximum and minimum values for x, y.
                const maxXOffset = (props.width * scale.value - props.width) / 2;
                const maxYOffset = (props.height * scale.value - props.height) / 2;
                // Using clamp, we set the range of the value that we can get.
                translationX.value = clamp(baseTranslationX.value, -maxXOffset, maxXOffset);
                translationY.value = clamp(baseTranslationY.value, -maxYOffset, maxYOffset);
            }
        })
            .onTouchesDown((event, state) => {
            'worklet';
            if (event.numberOfTouches === 2) {
                const xA = event.allTouches[0].x;
                const yA = event.allTouches[0].y;
                const xB = event.allTouches[1].x;
                const yB = event.allTouches[1].y;
                // Finding out the center between two fingers
                x.value = (xA + xB) / 2;
                y.value = (yA + yB) / 2;
                // Turn on the gesture, otherwise the scroll of the list starts to work.
                state.activate();
            }
        })
            .onEnd(event => {
            'worklet';
            // If scale is equal to 1, we reset translation.
            if (scale.value <= imageViewingConfig.minScale) {
                translationX.value = 0;
                translationY.value = 0;
                baseTranslationX.value = 0;
                baseTranslationY.value = 0;
            }
            // If the gesture ended with two fingers, then we save the value, since scale always starts with the value 1.
            if (event.numberOfPointers === 2) {
                baseScale.value = scale.value;
            }
        })
            .enabled(isZoomEnabled);
        // Translation
        const pan = Gesture.Pan()
            .onStart(event => {
            if (event.numberOfPointers === 1) {
                baseTranslationX.value = translationX.value;
                baseTranslationY.value = translationY.value;
            }
        })
            .onUpdate(event => {
            // We allow movement only if scale > 1 and only one finger pressed.
            if (event.numberOfPointers === 1 && scale.value > imageViewingConfig.minScale) {
                // We calculate the dimensions to which we can move. It is necessary in order not to go beyond the boundaries of the screen.
                const maxXOffset = (props.width * scale.value - props.width) / 2;
                const maxYOffset = (props.height * scale.value - props.height) / 2;
                translationX.value = clamp(baseTranslationX.value + event.translationX, -maxXOffset, maxXOffset);
                translationY.value = clamp(baseTranslationY.value + event.translationY, -maxYOffset, maxYOffset);
            }
        })
            .onTouchesDown((event, state) => {
            'worklet';
            if (Platform.OS === 'ios') {
                return;
            }
            // We forbid the gesture if 2 fingers are pressed or the scale is 1.
            if (event.numberOfTouches === 2 || scale.value === imageViewingConfig.minScale) {
                state.end();
                return;
            }
            state.begin();
        });
        if (Platform.OS === 'ios') {
            // This setting is necessary for iOS so that gestures work correctly with the list
            pan.simultaneousWithExternalGesture(props.gesturePanRef);
        }
        const swipe = Gesture.Pan()
            .manualActivation(true)
            .onBegin(event => {
            'worklet';
            initialSwipeLocation.value = {
                x: event.x,
                y: event.y,
            };
        })
            .onUpdate(event => {
            'worklet';
            // If the scale is greater than 1, then we prohibit closing by swiping.
            if (scale.value > imageViewingConfig.minScale) {
                return;
            }
            const maxYOffset = props.height / imageViewingConfig.swipeHeightFactor;
            const maxXOffset = props.width / imageViewingConfig.swipeWidthFactor;
            // If the screen orientation is portrait, then we allow to swipe vertically, otherwise a horizontal swipe is used.
            if (isPortraitOrientation) {
                position.value = clamp(event.translationY, -maxYOffset, maxYOffset);
            }
            else {
                position.value = clamp(event.translationX, -maxXOffset, maxXOffset);
            }
        })
            .onTouchesDown((event, state) => {
            // We forbid the gesture if 2 fingers are pressed or the scale is greater than 1.
            if (event.numberOfTouches === 2 || scale.value > imageViewingConfig.minScale) {
                state.fail();
                return;
            }
            state.begin();
        })
            .onTouchesMove((event, state) => {
            'worklet';
            if (isSwipeHorizontal.value === 1) {
                state.activate();
                return;
            }
            cancelAnimation(position);
            const xDiff = Math.abs(event.changedTouches[0].x - initialSwipeLocation.value.x);
            const yDiff = Math.abs(event.changedTouches[0].y - initialSwipeLocation.value.y);
            if (isPortraitOrientation) {
                isSwipeHorizontal.value = xDiff > yDiff ? 2 : 1;
            }
            else {
                isSwipeHorizontal.value = xDiff > yDiff ? 1 : 2;
            }
            if (isSwipeHorizontal.value === 2) {
                state.fail();
            }
            else {
                state.activate();
            }
        })
            .onEnd(() => {
            'worklet';
            // Setting the offset for swipe horizontally and vertically.
            const maxYOffset = props.height / imageViewingConfig.swipeHeightFactor;
            const maxXOffset = props.width / imageViewingConfig.swipeWidthFactor;
            if (position.value === maxYOffset ||
                position.value === -maxYOffset ||
                position.value === maxXOffset ||
                position.value === -maxXOffset) {
                runOnJS(props.onCloseModal)();
            }
            initialSwipeLocation.value = {
                x: 0,
                y: 0,
            };
            isSwipeHorizontal.value = 0;
            // Resetting the position at the end of the swipe
            position.value = withSpring(0, imageViewingConfig.swipeAnimation);
        })
            .enabled(isSwipeEnabled);
        const tap = Gesture.Tap()
            .onStart(() => {
            'worklet';
            runOnJS(props.onToggleOverlay)();
        })
            .numberOfTaps(1)
            .simultaneousWithExternalGesture(props.gesturePanRef);
        // Zoom in/out when pressed twice
        const doubleTap = Gesture.Tap()
            .onStart(event => {
            'worklet';
            if (scale.value === imageViewingConfig.minScale) {
                scale.value = withTiming(imageViewingConfig.maxScale, { duration: imageViewingConfig.zoomInDuration });
                baseScale.value = imageViewingConfig.maxScale;
                // Getting the center's coordinates
                const centerX = props.width / 2;
                const centerY = props.height / 2;
                // In order not to go beyond the boundaries at scaling, we calculate the maximum and minimum values for x, y.
                const maxXOffset = props.width / 2;
                const maxYOffset = props.height / 2;
                // Using clamp, we set the range of the value that we can get.
                const translateX = clamp((centerX - event.x) * 2, -maxXOffset, maxXOffset);
                const translateY = clamp((centerY - event.y) * 2, -maxYOffset, maxYOffset);
                translationX.value = withTiming(translateX, { duration: imageViewingConfig.zoomInDuration });
                translationY.value = withTiming(translateY, { duration: imageViewingConfig.zoomInDuration });
                baseTranslationX.value = translateX;
                baseTranslationY.value = translateY;
            }
            else if (scale.value > imageViewingConfig.minScale) {
                scale.value = withTiming(imageViewingConfig.minScale, { duration: imageViewingConfig.zoomOutDuration });
                baseScale.value = imageViewingConfig.minScale;
                translationY.value = withTiming(0, { duration: imageViewingConfig.zoomOutDuration });
                translationX.value = withTiming(0, { duration: imageViewingConfig.zoomOutDuration });
                baseTranslationX.value = 0;
                baseTranslationY.value = 0;
            }
        })
            .numberOfTaps(2)
            .enabled(isZoomEnabled);
        return Gesture.Race(Gesture.Exclusive(doubleTap, tap), Gesture.Simultaneous(pan, pinch, swipe));
    }, [
        x.value,
        y.value,
        scale.value,
        isZoomed.value,
        position.value,
        baseScale.value,
        translationX.value,
        translationY.value,
        baseTranslationX.value,
        baseTranslationY.value,
        isSwipeHorizontal.value,
        initialSwipeLocation.value,
        props.width,
        props.height,
        isPortraitOrientation,
        props.gesturePanRef,
        isSwipeEnabled,
    ]);
    const imageContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translationX.value }, { translateY: translationY.value }, { scale: scale.value }],
        };
    });
    const swipeStyle = useAnimatedStyle(() => {
        if (isPortraitOrientation) {
            return {
                transform: [{ translateY: position.value }],
            };
        }
        return {
            transform: [{ translateX: position.value }],
        };
    });
    const resetGesture = () => {
        if (scale.value > 1) {
            scale.value = withTiming(1);
            baseScale.value = 1;
            translationY.value = withTiming(0);
            translationX.value = withTiming(0);
        }
    };
    return {
        gesture,
        swipeStyle,
        imageContainerStyle,
        resetGesture,
    };
};
