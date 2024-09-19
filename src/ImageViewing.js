import { useBackHandler } from '@react-native-community/hooks';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View, } from 'react-native';
import { Platform } from 'react-native';
import { FlatList as GestureFlatList, Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import Orientation, { OrientationType, useDeviceOrientationChange } from 'react-native-orientation-locker';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButton } from './components/CloseButton';
import { ImageItem } from './components/ImageItem';
import OrientationHelper from './helpers/OrientationHelper';
import { useAnimatedImageView } from './hooks/useAnimatedImageView';
import { ImageViewingColors } from './settings/ImageViewingColors';
// Для iOS необходимо использовать FlatList из react-native.
const AnimatedFlatList = Animated.createAnimatedComponent((FlatList));
// Для android необходимо использовать FlatList из react-native-gesture-handler.
const AnimatedGestureFlatList = Animated.createAnimatedComponent((GestureFlatList));
export const ImageViewing = forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const flatListRef = useRef(null);
    const gestureFlatListRef = useRef(null);
    // Для того, чтобы iOS работал вместе с скроллом, необходим Gesture.Native() в GestureDetector, в котором находится FlatList.
    const flatListNative = useRef(Gesture.Native());
    const [isLoading, setLoading] = useState(false);
    const [orientation, setOrientation] = useState(OrientationType['PORTRAIT']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const controller = useAnimatedImageView({ orientation });
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
            return {
                left: 0,
                top: insets.top,
            };
        }
        if (OrientationHelper.isLeftLandscapeOrientation(orientation)) {
            return {
                right: 0,
                top: insets.top,
            };
        }
        return {
            top: insets.top,
            left: 0,
        };
    }, [orientation]);
    useEffect(() => {
        if (controller.isShowImage) {
            return;
        }
        setTimeout(() => {
            if (Platform.OS === 'ios') {
                flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
            }
            else {
                gestureFlatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
            }
        }, 550);
    }, [controller.isShowImage]);
    const handleCloseModal = useCallback(() => {
        controller.onHide();
        controller.onChangeOrientation(OrientationType['PORTRAIT']);
        setTimeout(() => {
            setOrientation(OrientationType['PORTRAIT']);
            Orientation.lockToPortrait();
        }, 501);
    }, []);
    // Чтобы при нажатии на системную кнопку закрывать просмотр картинок.
    const handleBackAction = useCallback(() => {
        if (controller.isShowImage) {
            handleCloseModal();
            return true;
        }
        return false;
    }, [controller.isShowImage]);
    useBackHandler(handleBackAction);
    useDeviceOrientationChange(changedOrientation => {
        if (OrientationHelper.isNotChangeOrientation(orientation, changedOrientation) ||
            !controller.isShowImage ||
            !props.isOrientationEnabled) {
            return;
        }
        setLoading(true);
        setOrientation(changedOrientation);
        controller.onChangeOrientation(changedOrientation);
        const timeout = setTimeout(() => {
            if (Platform.OS === 'ios') {
                flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
            }
            else {
                gestureFlatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
            }
            setLoading(false);
            clearTimeout(timeout);
        }, 600);
    });
    // Imperative handlers
    useImperativeHandle(ref, () => ({
        show: () => {
            controller.onShow();
        },
        hide: () => {
            handleCloseModal();
        },
        snapItem: (index) => {
            setCurrentIndex(index);
            if (Platform.OS === 'ios') {
                flatListRef.current?.scrollToIndex({ index, animated: false });
            }
            else {
                gestureFlatListRef.current?.scrollToIndex({ index, animated: false });
            }
        },
    }));
    const onViewableItemsChanged = useCallback((info, isShowImage) => {
        if (info.viewableItems.length > 0 && isShowImage) {
            setCurrentIndex(info.viewableItems[0]?.index ?? 0);
            props.onSnapViewingItem && props.onSnapViewingItem(info.viewableItems[0]?.index ?? 0);
        }
    }, []);
    const viewabilityConfigCallbackPairs = useRef({ waitForInteraction: true, viewAreaCoveragePercentThreshold: Platform.OS === 'ios' ? 90 : 60 });
    // Handlers
    const handleKeyExtractor = useCallback((_, index) => {
        return `iwc_${index.toString()}`;
    }, []);
    const handleGetLayout = useCallback((_, index) => {
        return {
            index,
            length: OrientationHelper.isLandscapeOrientation(orientation) ? height : width,
            offset: OrientationHelper.isLandscapeOrientation(orientation) ? height * index : width * index,
        };
    }, [orientation]);
    const handleToggleOverlay = useCallback(() => {
        controller.onToggleOverlay();
    }, []);
    // Renders
    const renderItem = ({ item }) => {
        return (React.createElement(ImageItem, { image: item, controller: controller, orientation: orientation, gesturePanRef: flatListNative.current, isZoomEnabled: props.isZoomEnabled, isSwipeEnabled: props.isSwipeEnabled, onClose: handleCloseModal, onZoomEnd: controller.onZoomEnd, onZoomBegin: controller.onZoomBegin, onToggleOverlay: handleToggleOverlay }));
    };
    // Renders
    const renderList = useCallback((props) => {
        if (Platform.OS === 'ios') {
            // Чтобы на iOS работали жесты, FlatList нужно обернуть в GestureDetector.
            return (React.createElement(GestureDetector, { gesture: flatListNative.current },
                React.createElement(AnimatedFlatList, { ref: flatListRef, ...props })));
        }
        return React.createElement(AnimatedGestureFlatList, { ref: gestureFlatListRef, ...props });
    }, []);
    return (React.createElement(Animated.View, { style: [styles.container, controller.modalStyle] },
        React.createElement(GestureHandlerRootView, { style: styles.flex },
            isLoading && (React.createElement(View, { style: styles.containerLoader },
                React.createElement(ActivityIndicator, { size: 'large' }))),
            React.createElement(Animated.View, { style: [styles.flex, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }] },
                React.createElement(Animated.View, { style: [styles.containerHeader, headerStyle] },
                    React.createElement(View, { style: styles.containerCloseButton },
                        React.createElement(CloseButton, { bgColor: ImageViewingColors.backgroundCloseButton, color: ImageViewingColors.iconCloseButtonColor, containerStyle: styles.closeButton, handleClose: handleCloseModal }))),
                renderList({
                    // Параметры отрисовки и данных
                    data: props.images,
                    bounces: false,
                    // При landscape-right список нужно инвертировать, что бы сохранять последовательность элементов, как при landscape-left.
                    inverted: OrientationHelper.isRightLandscapeOrientation(orientation),
                    horizontal: !OrientationHelper.isLandscapeOrientation(orientation),
                    pagingEnabled: true,
                    overScrollMode: 'never',
                    showsVerticalScrollIndicator: false,
                    showsHorizontalScrollIndicator: false,
                    viewabilityConfig: viewabilityConfigCallbackPairs.current,
                    onViewableItemsChanged: info => onViewableItemsChanged(info, controller.isShowImage),
                    animatedProps: controller.animatedProps,
                    // Параметры оптимизации
                    removeClippedSubviews: true,
                    initialNumToRender: 10,
                    maxToRenderPerBatch: 5,
                    keyExtractor: handleKeyExtractor,
                    getItemLayout: handleGetLayout,
                    // Рендер функции
                    renderItem,
                }),
                React.createElement(Animated.View, { style: [controller.footerStyle, styles.footerContainer, footerStyle] },
                    React.createElement(Animated.View, { style: controller.rotateStyle },
                        React.createElement(Text, { style: styles.pageText },
                            currentIndex + 1,
                            "/",
                            props.images.length)))))));
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
        backgroundColor: ImageViewingColors.backgroundModalColor,
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
        backgroundColor: ImageViewingColors.backgroundModalColor,
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
        backgroundColor: ImageViewingColors.footerModalOverlayColor,
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
        color: ImageViewingColors.textPageColor,
    },
});
