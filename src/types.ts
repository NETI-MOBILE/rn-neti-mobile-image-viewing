import { ColorValue } from 'react-native';

export type Nullable<T> = null | T;

export interface IImageModel {
  url: string;
  sizes?: IImageSize;
}

export interface IImageSize {
  width: number;
  height: number;
}

export interface IEdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ISwipeAnimation {
  damping?: number;
  stiffness?: number;
}

export interface IConfig {
  minScale?: number;
  maxScale?: number;
  decreaseZoomSpeed?: number;
  zoomInDuration?: number;
  zoomOutDuration?: number;

  swipeWidthFactor?: number;
  swipeHeightFactor?: number;
  swipeAnimation?: ISwipeAnimation;
}

export interface IColors {
  backgroundModalColor: ColorValue; // Background color for the modal window (with images)
  closeButtonBackground: ColorValue; // Background color for the close button
  footerModalOverlayColor: ColorValue; // Background color for footer
  outline: ColorValue;
  textColor: ColorValue; // The color of the text (footer)
  white: ColorValue;
}

export interface ImageViewingInstance {
  /**
   * Show modal image viewing
   */
  show: () => void;

  /**
   * Hide modal image viewing
   */
  hide: () => void;

  /**
   * Scroll to item by index. When a page has a list of images, this feature allows you to do a scroll along with the main list. It is necessary to show not the first element on open.
   *
   * @param index
   */
  snapItem: (index: number) => void;
}

export enum CloseButtonType {
  light = 'light',
  dark = 'dark',
}

export type ImageViewingProps = {
  /**
   * ImageViewingInstance to show or hide carousel with images.
   * It also includes snapItem feature with scroll to item by index.
   *
   * @example
   * const imageViewingRef = useRef<ImageViewingInstance | null>(null);
   *
   * imageViewingRef.current?.show();
   * imageViewingRef.current?.hide();
   * imageViewingRef.current?.snapItem(1);
   */
  ref?: React.Ref<ImageViewingInstance>;

  /**
   * Data array images. The sizes parameter is not required, but is desirable for calculating aspect ratio without calling Image.getSize()
   *
   * @requires
   *
   * @example
   * [
   *  { url: 'https:\\*', sizes: { width: 1280, height: 960 } }
   * ]
   */
  images: IImageModel[];

  /**
   * Screen insets to consider device safe zones
   *
   * @example
   * { top: 0, bottom: 0, left: 0, right: 0 }
   */
  insets?: IEdgeInsets;

  /**
   * Parameter to enable/disable zoom support.
   * Enabled by default.
   */
  isZoomEnabled?: boolean;

  /**
   * Parameter to enable/disable swipe support
   * Enabled by default.
   */
  isSwipeEnabled?: boolean;

  /**
   * Parameter to enable/disable orientation support
   * Disabled by default.
   */
  isOrientationEnabled?: boolean;

  /**
   * Callback fired when navigating to an item.
   * @param index
   */
  onSnapViewingItem?: (index: number) => void;

  /**
   * Config for custom zoom and swipe settings
   */
  config?: IConfig;

  /**
   * Colors config to customize the current colors
   */
  colors?: IColors;

  /**
   * Close button type to customize close button color value (light/dark).
   * Light by default.
   */
  closeButtonType?: CloseButtonType;

  /**
   * Parameter to hide overlay on zoom
   * Disabled by default.
   */
  hideOverlayOnZoom?: boolean;
};
