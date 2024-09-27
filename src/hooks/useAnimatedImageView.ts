import { useMemo, useState } from 'react';
import { StatusBar, StyleProp, ViewStyle } from 'react-native';
import { OrientationType } from 'react-native-orientation-locker';
import {
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';

import OrientationHelper from '../helpers/OrientationHelper';
import { IEdgeInsets } from '../types';

export interface IAnimatedImageView {
  isShowImage: boolean;
  isShowOverlay: SharedValue<number>;
  modalStyle: StyleProp<ViewStyle>;
  rotateStyle: StyleProp<ViewStyle>;
  footerStyle: StyleProp<ViewStyle>;
  animatedProps: Partial<{ scrollEnabled: boolean }>;

  onShow: () => void;
  onHide: () => void;
  onZoomEnd: () => void;
  onZoomBegin: () => void;
  onToggleOverlay: () => void;
  onChangeOrientation: (orientation: OrientationType) => void;
}

interface IProps {
  orientation: OrientationType;
  insets?: IEdgeInsets;
}

export const useAnimatedImageView = (props: IProps): IAnimatedImageView => {
  const rotate = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(0);
  const isShowOverlay = useSharedValue<number>(1);
  const scrollEnabled = useSharedValue(true);

  const isPortraitOrientation = useMemo(
    () => OrientationHelper.isPortraitOrientation(props.orientation),
    [props.orientation],
  );

  const [isShowImage, setShowImage] = useState<boolean>(false);

  const modalStyle = useAnimatedStyle(() => {
    return {
      zIndex: interpolate(opacity.value, [0, 1], [-1, 2]),
      opacity: interpolate(opacity.value, [0, 1], [0, 1]),
    };
  });

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${interpolate(rotate.value, [-1, 0, 1], [90, 0, -90])}deg` }],
    } as DefaultStyle;
  });

  const footerStyle = useAnimatedStyle(() => {
    if (isPortraitOrientation) {
      return {
        transform: [{ translateY: interpolate(isShowOverlay.value, [0, 1], [800, 0 - (props.insets?.bottom ?? 0)]) }],
      } as DefaultStyle;
    }

    return {
      transform: [
        {
          translateX: interpolate(
            isShowOverlay.value,
            [0, 1],
            [props.orientation === OrientationType['LANDSCAPE-RIGHT'] ? 800 : -800, 0],
          ),
        },
      ],
    } as DefaultStyle;
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

    if (!isShowOverlay.value) {
      onToggleOverlay();
    }
  };

  const onChangeOrientation = (orientation: OrientationType) => {
    if (OrientationHelper.isPortraitOrientation(orientation)) {
      rotate.value = withTiming(0, { duration: 500 });
    } else if (OrientationHelper.isLeftLandscapeOrientation(orientation)) {
      rotate.value = withTiming(-1, { duration: 500 });
    } else if (OrientationHelper.isRightLandscapeOrientation(orientation)) {
      rotate.value = withTiming(1, { duration: 500 });
    }
  };

  const onToggleOverlay = () => {
    if (isShowOverlay.value === 0) {
      isShowOverlay.value = withTiming(1);
    } else {
      isShowOverlay.value = withTiming(0);
    }
  };

  return {
    isShowOverlay,
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
