import { useMemo } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import type { GestureType, SimultaneousGesture } from 'react-native-gesture-handler';
import { OrientationType } from 'react-native-orientation-locker';
import {
  cancelAnimation,
  clamp,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ImageViewingConfig } from '../settings/ImageViewingConfig';

interface IProps {
  width: number;
  height: number;
  orientation: OrientationType;
  gesturePanRef: GestureType;

  onZoomBegin: () => void;
  onZoomEnd: () => void;
  onCloseModal: () => void;
  onToggleOverlay: () => void;

  isZoomEnabled?: boolean;
  isSwipeEnabled?: boolean;
}

export interface IGestureImageView {
  gesture: SimultaneousGesture;
  swipeStyle: ViewStyle;
  imageContainerStyle: ViewStyle;

  resetGesture: () => void;
}

export const useGestureImageView = ({
  isSwipeEnabled = true,
  isZoomEnabled = true,
  ...props
}: IProps): IGestureImageView => {
  const isZoomed = useSharedValue(false);

  // Значения для увеличения картинки
  const scale = useSharedValue<number>(1);
  const baseScale = useSharedValue<number>(1);
  const x = useSharedValue<number>(0);
  const y = useSharedValue<number>(0);

  // Значения для позиции перемещения
  const translationX = useSharedValue<number>(0);
  const translationY = useSharedValue<number>(0);
  const baseTranslationX = useSharedValue<number>(0);
  const baseTranslationY = useSharedValue<number>(0);

  // Значения для позиции свайпа
  const position = useSharedValue<number>(0);
  const isSwipeHorizontal = useSharedValue<number>(0);
  const initialSwipeLocation = useSharedValue<{ x: number; y: number }>({ x: 0, y: 0 });

  useDerivedValue(() => {
    if (scale.value > 1 && !isZoomed.value) {
      isZoomed.value = true;
      runOnJS(props.onZoomBegin)();
    } else if (scale.value === 1 && isZoomed.value) {
      isZoomed.value = false;
      runOnJS(props.onZoomEnd)();
    }
  }, [props.onZoomBegin, props.onZoomEnd]);

  const gesture = useMemo(() => {
    const isPortrait =
      props.orientation === OrientationType['PORTRAIT'] ||
      props.orientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
      props.orientation === OrientationType['UNKNOWN'] ||
      props.orientation === OrientationType['FACE-DOWN'] ||
      props.orientation === OrientationType['FACE-UP'];

    const pinch = Gesture.Pinch()
      .onUpdate(event => {
        // Отслеживаем что бы было нажатие двумя пальцами
        if (event.numberOfPointers === 2) {
          const calculateScale = baseScale.value * (event.scale * ImageViewingConfig.decreaseZoomSpeed);

          if (calculateScale < ImageViewingConfig.minScale) {
            scale.value = ImageViewingConfig.minScale;
          } else if (calculateScale >= ImageViewingConfig.maxScale) {
            scale.value = ImageViewingConfig.maxScale;
          } else {
            scale.value = baseScale.value * (event.scale * ImageViewingConfig.decreaseZoomSpeed);
          }

          // Получение координаты центра
          const centerX = props.width / 2;
          const centerY = props.height / 2;

          if (baseScale.value === ImageViewingConfig.minScale) {
            // При первом scale, делаем translate к середине нажатия относительно центра экрана
            baseTranslationX.value = (centerX - x.value) * event.scale;
            baseTranslationY.value = (centerY - y.value) * event.scale;
          } else {
            // Если scale уже есть, то прописываем ранние значения
            baseTranslationX.value = translationX.value;
            baseTranslationY.value = translationY.value;
          }

          // Что бы при scale не выходить за границы, вычисляем максимальное и минимальное значение для x, y.
          const maxXOffset = (props.width * scale.value - props.width) / 2;
          const maxYOffset = (props.height * scale.value - props.height) / 2;

          // При помощи clamp задаем диапазон значения которое можем получить.
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

          // Узнаем центр между двумя пальцами
          x.value = (xA + xB) / 2;
          y.value = (yA + yB) / 2;

          // Включаем жест, иначе начинает срабатывать скролл списка.
          state.activate();
        }
      })
      .onEnd(event => {
        'worklet';

        // Если scale равен 1, сбрасываем translation.
        if (scale.value <= ImageViewingConfig.minScale) {
          translationX.value = 0;
          translationY.value = 0;
          baseTranslationX.value = 0;
          baseTranslationY.value = 0;
        }

        // Если жест закончился с двумя пальцами то сохраняем значение. Так как scale всегда начинается с значения 1.
        if (event.numberOfPointers === 2) {
          baseScale.value = scale.value;
        }
      })
      .enabled(isZoomEnabled);

    // Функционал Translation
    const pan = Gesture.Pan()
      .onStart(event => {
        if (event.numberOfPointers === 1) {
          baseTranslationX.value = translationX.value;
          baseTranslationY.value = translationY.value;
        }
      })
      .onUpdate(event => {
        // Разрешаем перемещения только если scale > 1 и нажат один палец.
        if (event.numberOfPointers === 1 && scale.value > ImageViewingConfig.minScale) {
          // Вычисляем размеры до которых можем перемещается. Нужно для того, что бы не выходить за границы экрана.
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

        // Запрещаем жест если нажата 2 пальца или scale равен 1.
        if (event.numberOfTouches === 2 || scale.value === ImageViewingConfig.minScale) {
          state.end();
          return;
        }

        state.begin();
      });

    if (Platform.OS === 'ios') {
      // Данная настройка нужна для iOS, чтобы жесты корректно работали с списком
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

        // Если scale больше 1, то запрещаем закрытия при помощи смахивания.
        if (scale.value > ImageViewingConfig.minScale) {
          return;
        }

        const maxYOffset = props.height / ImageViewingConfig.swipeHeightFactor;
        const maxXOffset = props.width / ImageViewingConfig.swipeWidthFactor;

        // Если ориентация экрана портретная, то позволяем делать свайп по вертикали, иначе горизонтальный свайп.
        if (isPortrait) {
          position.value = clamp(event.translationY, -maxYOffset, maxYOffset);
        } else {
          position.value = clamp(event.translationX, -maxXOffset, maxXOffset);
        }
      })
      .onTouchesDown((event, state) => {
        // Запрещаем жест если нажата 2 пальца или scale больше 1.
        if (event.numberOfTouches === 2 || scale.value > ImageViewingConfig.minScale) {
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

        if (isPortrait) {
          isSwipeHorizontal.value = xDiff > yDiff ? 2 : 1;
        } else {
          isSwipeHorizontal.value = xDiff > yDiff ? 1 : 2;
        }

        if (isSwipeHorizontal.value === 2) {
          state.fail();
        } else {
          state.activate();
        }
      })
      .onEnd(() => {
        'worklet';
        // Задаем offset для свайпа по горизонтали и вертикали.
        const maxYOffset = props.height / ImageViewingConfig.swipeHeightFactor;
        const maxXOffset = props.width / ImageViewingConfig.swipeWidthFactor;

        if (
          position.value === maxYOffset ||
          position.value === -maxYOffset ||
          position.value === maxXOffset ||
          position.value === -maxXOffset
        ) {
          runOnJS(props.onCloseModal)();
        }

        initialSwipeLocation.value = {
          x: 0,
          y: 0,
        };
        isSwipeHorizontal.value = 0;

        // Сброс позиции при завершении свайпа
        position.value = withSpring(0, ImageViewingConfig.swipeAnimation);
      })
      .enabled(isSwipeEnabled);

    const tap = Gesture.Tap()
      .onStart(() => {
        'worklet';
        runOnJS(props.onToggleOverlay)();
      })
      .numberOfTaps(1)
      .simultaneousWithExternalGesture(props.gesturePanRef);

    // Приблизить/отдалить при двойном нажатии
    const doubleTap = Gesture.Tap()
      .onStart(event => {
        'worklet';

        if (scale.value === ImageViewingConfig.minScale) {
          scale.value = withTiming(ImageViewingConfig.maxScale, { duration: ImageViewingConfig.zoomInDuration });
          baseScale.value = ImageViewingConfig.maxScale;

          // Получение координаты центра
          const centerX = props.width / 2;
          const centerY = props.height / 2;

          // Чтобы при scale не выходить за границы, вычисляем максимальное и минимальное значение для x, y.
          const maxXOffset = props.width / 2;
          const maxYOffset = props.height / 2;

          // При помощи clamp задаем диапазон значения которое можем получить.
          const translateX = clamp((centerX - event.x) * 2, -maxXOffset, maxXOffset);
          const translateY = clamp((centerY - event.y) * 2, -maxYOffset, maxYOffset);

          translationX.value = withTiming(translateX, { duration: ImageViewingConfig.zoomInDuration });
          translationY.value = withTiming(translateY, { duration: ImageViewingConfig.zoomInDuration });

          baseTranslationX.value = translateX;
          baseTranslationY.value = translateY;
        } else if (scale.value > ImageViewingConfig.minScale) {
          scale.value = withTiming(ImageViewingConfig.minScale, { duration: ImageViewingConfig.zoomOutDuration });
          baseScale.value = ImageViewingConfig.minScale;
          translationY.value = withTiming(0, { duration: ImageViewingConfig.zoomOutDuration });
          translationX.value = withTiming(0, { duration: ImageViewingConfig.zoomOutDuration });
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
    props.orientation,
    props.gesturePanRef,
    isSwipeEnabled,
  ]);

  const imageContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translationX.value,
        },
        {
          translateY: translationY.value,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  const swipeStyle = useAnimatedStyle(() => {
    if (
      props.orientation === OrientationType['PORTRAIT'] ||
      props.orientation === OrientationType['PORTRAIT-UPSIDEDOWN'] ||
      props.orientation === OrientationType['UNKNOWN'] ||
      props.orientation === OrientationType['FACE-DOWN'] ||
      props.orientation === OrientationType['FACE-UP']
    ) {
      return {
        transform: [
          {
            translateY: position.value,
          },
        ],
      };
    }

    return {
      transform: [
        {
          translateX: position.value,
        },
      ],
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
