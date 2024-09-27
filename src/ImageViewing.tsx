import { useBackHandler } from '@react-native-community/hooks';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import {
  FlatList as GestureFlatList,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Orientation, { OrientationType, useDeviceOrientationChange } from 'react-native-orientation-locker';
import Animated, { AnimatedProps, SharedValue } from 'react-native-reanimated';

import { CloseButton } from './components/CloseButton';
import { ImageItem } from './components/ImageItem';
import ImageViewHelper from './helpers/ImageViewHelper';
import OrientationHelper from './helpers/OrientationHelper';
import { useAnimatedImageView } from './hooks/useAnimatedImageView';
import { CloseButtonType, IImageModel, ImageViewingInstance, ImageViewingProps, Nullable } from './types';

// For iOS, you need to use the FlatList from react-native.
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<IImageModel>);
// For android, you need to use the FlatList from react-native-gesture-handler.
const AnimatedGestureFlatList = Animated.createAnimatedComponent(GestureFlatList<IImageModel>);

export const ImageViewing = forwardRef<ImageViewingInstance, ImageViewingProps>((props, ref) => {
  const { width, height } = useWindowDimensions();

  const flatListRef = useRef<Nullable<FlatList>>(null);
  const gestureFlatListRef = useRef<Nullable<GestureFlatList>>(null);

  // In order for iOS to work together with scrolling, Gesture.Native() is needed in the GestureDetector where the FlatList is located.
  const flatListNative = useRef(Gesture.Native());

  const imageViewingColors = useMemo(() => ImageViewHelper.getImageViewColors(props.colors), [props.colors]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<OrientationType>(OrientationType['PORTRAIT']);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    // Current package version works correctly only with lockToPortrait call
    Orientation.lockToPortrait();
  }, []);

  const controller = useAnimatedImageView({ orientation, insets: props.insets });

  const footerStyle = useMemo(() => {
    if (OrientationHelper.isRightLandscapeOrientation(orientation)) {
      return styles.landscapeRightFooter;
    }

    if (OrientationHelper.isLeftLandscapeOrientation(orientation)) {
      return styles.landscapeLeftFooter;
    }

    return styles.portraitFooter;
  }, [orientation]);

  const headerStyle = useMemo(() => {
    if (OrientationHelper.isRightLandscapeOrientation(orientation)) {
      return { left: 0, top: props.insets?.top ?? 0 };
    }

    if (OrientationHelper.isLeftLandscapeOrientation(orientation)) {
      return { right: 0, top: props.insets?.top ?? 0 };
    }

    return { top: props.insets?.top ?? 0, left: 0 };
  }, [orientation]);

  useEffect(() => {
    if (controller.isShowImage) {
      return;
    }

    setTimeout(() => {
      if (Platform.OS === 'ios') {
        flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
      } else {
        gestureFlatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
      }
    }, 550);
  }, [controller.isShowImage]);

  const handleCloseModal = useCallback(() => {
    controller.onHide();
    controller.onChangeOrientation(OrientationType['PORTRAIT']);

    setTimeout(() => {
      setOrientation(OrientationType['PORTRAIT']);
    }, 501);
  }, []);

  // To close the image view when clicking on the system button.
  const handleBackAction = useCallback(() => {
    if (controller.isShowImage) {
      handleCloseModal();
      return true;
    }

    return false;
  }, [controller.isShowImage]);

  useBackHandler(handleBackAction);

  useDeviceOrientationChange(changedOrientation => {
    if (
      OrientationHelper.isNotChangeOrientation(orientation, changedOrientation) ||
      !controller.isShowImage ||
      !props.isOrientationEnabled
    ) {
      return;
    }

    setLoading(true);
    setOrientation(changedOrientation);
    controller.onChangeOrientation(changedOrientation);

    const timeout = setTimeout(() => {
      if (Platform.OS === 'ios') {
        flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
      } else {
        gestureFlatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
      }

      const loaderTimeout = setTimeout(() => {
        setLoading(false);
        clearTimeout(loaderTimeout);
      }, 300);

      clearTimeout(timeout);
    }, 300);
  });

  // Imperative handlers

  useImperativeHandle(ref, () => ({
    show: () => {
      controller.onShow();
    },
    hide: () => {
      handleCloseModal();
    },
    snapItem: (index: number) => {
      setCurrentIndex(index);

      if (Platform.OS === 'ios') {
        flatListRef.current?.scrollToIndex({ index, animated: false });
      } else {
        gestureFlatListRef.current?.scrollToIndex({ index, animated: false });
      }
    },
  }));

  const onViewableItemsChanged = useCallback((info: { viewableItems: ViewToken[] }, isShowImage: boolean) => {
    if (info.viewableItems.length > 0 && isShowImage) {
      setCurrentIndex(info.viewableItems[0]?.index ?? 0);
      props.onSnapViewingItem && props.onSnapViewingItem(info.viewableItems[0]?.index ?? 0);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef<
    ViewabilityConfig | SharedValue<ViewabilityConfig | undefined> | undefined
    >({ waitForInteraction: true, viewAreaCoveragePercentThreshold: Platform.OS === 'ios' ? 90 : 60 });

  // Handlers

  const handleKeyExtractor = useCallback((_: IImageModel, index: number) => {
    return `iwc_${index.toString()}`;
  }, []);

  const handleGetLayout = useCallback(
    (_: ArrayLike<IImageModel> | null | undefined, index: number) => {
      return {
        index,
        length: OrientationHelper.isLandscapeOrientation(orientation) ? height : width,
        offset: OrientationHelper.isLandscapeOrientation(orientation) ? height * index : width * index,
      };
    },
    [orientation],
  );

  const handleToggleOverlay = useCallback(() => {
    controller.onToggleOverlay();
  }, []);

  // Renders

  const renderItem = ({ item }: { item: IImageModel }) => {
    return (
      <ImageItem
        image={item}
        controller={controller}
        orientation={orientation}
        gesturePanRef={flatListNative.current}
        isZoomEnabled={props.isZoomEnabled}
        isSwipeEnabled={props.isSwipeEnabled}
        onClose={handleCloseModal}
        onZoomEnd={controller.onZoomEnd}
        onZoomBegin={controller.onZoomBegin}
        onToggleOverlay={handleToggleOverlay}
        hideOverlayOnZoom={props.hideOverlayOnZoom}
        config={props.config}
      />
    );
  };

  // Renders

  const renderList = useCallback((props: AnimatedProps<FlatListProps<IImageModel>>) => {
    if (Platform.OS === 'ios') {
      // In order for gestures to work on iOS, the FlatList must be wrapped in a GestureDetector.
      return (
        <GestureDetector gesture={flatListNative.current}>
          <AnimatedFlatList ref={flatListRef} {...props} />
        </GestureDetector>
      );
    }

    return <AnimatedGestureFlatList ref={gestureFlatListRef} {...props} />;
  }, []);

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: imageViewingColors.backgroundModalColor }, controller.modalStyle]}
    >
      <GestureHandlerRootView style={styles.flex}>
        {isLoading && (
          <View style={[styles.containerLoader, { backgroundColor: imageViewingColors.backgroundModalColor }]}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <Animated.View style={[styles.flex, { paddingTop: Platform.OS === 'ios' ? 0 : props.insets?.top ?? 0 }]}>
          <Animated.View style={[styles.containerHeader, headerStyle]}>
            <View style={styles.containerCloseButton}>
              <CloseButton
                bgColor={imageViewingColors.closeButtonBackground}
                type={props.closeButtonType ?? CloseButtonType.light}
                containerStyle={styles.closeButton}
                onPress={handleCloseModal}
              />
            </View>
          </Animated.View>
          {/* Set the parameters for the list */}
          {renderList({
            // Rendering and data parameters
            data: props.images,
            bounces: false,
            // With landscape-right, the list must be inverted in order to keep the sequence of elements as with landscape-left.
            inverted: OrientationHelper.isRightLandscapeOrientation(orientation),
            horizontal: !OrientationHelper.isLandscapeOrientation(orientation),
            pagingEnabled: true,
            overScrollMode: 'never',
            showsVerticalScrollIndicator: false,
            showsHorizontalScrollIndicator: false,
            viewabilityConfig: viewabilityConfigCallbackPairs.current,
            onViewableItemsChanged: info => onViewableItemsChanged(info, controller.isShowImage),
            animatedProps: controller.animatedProps,
            // Optimization parameters
            removeClippedSubviews: true,
            initialNumToRender: 10,
            maxToRenderPerBatch: 5,
            keyExtractor: handleKeyExtractor,
            getItemLayout: handleGetLayout,
            // Rendering functions
            renderItem,
          })}
          <Animated.View
            style={[
              controller.footerStyle,
              styles.footerContainer,
              { backgroundColor: imageViewingColors.footerModalOverlayColor },
              footerStyle,
            ]}
          >
            <Animated.View style={controller.rotateStyle}>
              <Text style={[styles.pageText, { color: imageViewingColors.textColor }]}>
                {currentIndex + 1}/{props.images.length}
              </Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureHandlerRootView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -999,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHeader: {
    position: 'absolute',
    zIndex: 999,
  },
  containerCloseButton: {
    width: 44,
    height: 44,
    padding: 10,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    padding: 10,
    borderRadius: 0,
  },
  containerImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeLeftFooter: {
    top: 0,
    left: 0,
    width: 56,
    bottom: 0,
  },
  landscapeRightFooter: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 56,
  },
  portraitFooter: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
  },
  pageText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
