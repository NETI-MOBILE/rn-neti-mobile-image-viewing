import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, GestureType } from 'react-native-gesture-handler';
import { OrientationType } from 'react-native-orientation-locker';
import Animated from 'react-native-reanimated';

import { IAnimatedImageView } from '../hooks/useAnimatedImageView';
import { useGestureImageView } from '../hooks/useGestureImageView';
import { IImageModel } from '../types';
import { ImageWithAspect } from './ImageWithAspect';

interface IProps {
  image: IImageModel;
  controller: IAnimatedImageView;
  orientation: OrientationType;
  gesturePanRef: GestureType;

  onClose: () => void;
  onZoomEnd: () => void;
  onZoomBegin: () => void;
  onToggleOverlay: () => void;

  isZoomEnabled?: boolean;
  isSwipeEnabled?: boolean;
}

export const ImageItem = (props: IProps) => {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    gestureController.resetGesture();
  }, [props.orientation]);

  // Для того, чтобы жесты не сохраняли свое состояние при закрытии, сбрасываем их значения.
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
