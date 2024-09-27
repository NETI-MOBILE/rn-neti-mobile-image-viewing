import React, { FC, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, GestureType } from 'react-native-gesture-handler';
import { OrientationType } from 'react-native-orientation-locker';
import Animated from 'react-native-reanimated';

import { IAnimatedImageView } from '../hooks/useAnimatedImageView';
import { useGestureImageView } from '../hooks/useGestureImageView';
import { IConfig, IImageModel } from '../types';
import { ImageWithAspect } from './ImageWithAspect';

interface IImageItemProps {
  image: IImageModel;
  controller: IAnimatedImageView;
  orientation: OrientationType;
  gesturePanRef: GestureType;

  onClose: () => void;
  onZoomEnd: () => void;
  onZoomBegin: () => void;
  onToggleOverlay: () => void;
  hideOverlayOnZoom?: boolean;

  isZoomEnabled?: boolean;
  isSwipeEnabled?: boolean;

  config?: IConfig;
}

export const ImageItem: FC<IImageItemProps> = props => {
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

  return (
    <View style={{ width, height }}>
      <GestureDetector gesture={gestureController.gesture}>
        <Animated.View style={styles.container}>
          <Animated.View style={gestureController.swipeStyle}>
            <Animated.View style={gestureController.imageContainerStyle}>
              <Animated.View style={props.controller.rotateStyle}>
                <ImageWithAspect image={props.image} orientation={props.orientation} />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
