import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useGestureImageView } from '../hooks/useGestureImageView';
import { ImageWithAspect } from './ImageWithAspect';
export const ImageItem = props => {
    const { width, height } = useWindowDimensions();
    useEffect(() => {
        gestureController.resetGesture();
    }, [props.orientation]);
    // In order for the gestures not to keep their state on closing, we reset their values
    useEffect(() => {
        if (!props.controller.isShowImage) {
            gestureController.resetGesture();
        }
    }, [props.controller.isShowImage]);
    const handleClose = () => {
        gestureController.resetGesture();
        props.onClose();
    };
    const gestureController = useGestureImageView({
        width,
        height,
        orientation: props.orientation,
        gesturePanRef: props.gesturePanRef,
        isZoomEnabled: props.isZoomEnabled,
        isSwipeEnabled: props.isSwipeEnabled,
        onZoomEnd: props.onZoomEnd,
        onZoomBegin: props.onZoomBegin,
        onCloseModal: handleClose,
        onToggleOverlay: props.onToggleOverlay,
        controller: props.controller,
        hideOverlayOnZoom: props.hideOverlayOnZoom,
        config: props.config,
    });
    return (React.createElement(View, { style: { width, height } },
        React.createElement(GestureDetector, { gesture: gestureController.gesture },
            React.createElement(Animated.View, { style: styles.container },
                React.createElement(Animated.View, { style: gestureController.swipeStyle },
                    React.createElement(Animated.View, { style: gestureController.imageContainerStyle },
                        React.createElement(Animated.View, { style: props.controller.rotateStyle },
                            React.createElement(ImageWithAspect, { image: props.image, orientation: props.orientation }))))))));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
