export type Nullable<T> = null | T;

export interface IImageModel {
  url: string;
  sizes?: IImageSize;
}

export interface IImageSize {
  width: number;
  height: number;
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
   * Scroll to item by index. When a page has a list of images, this feature allows you to do a scroll along with the main list. It is necessary to show not the first element when opening.
   *
   * @param index
   */
  snapItem: (index: number) => void;
}

export type ImageViewingProps = {
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
   * Parameter for enable/disable zoom
   */
  isZoomEnabled?: boolean;

  /**
   * Parameter for enable/disable swipe
   */
  isSwipeEnabled?: boolean;

  /**
   * Parameter for enable/disable orientation
   */
  isOrientationEnabled?: boolean;

  /**
   * Callback fired when navigating to an item.
   * @param index
   */
  onSnapViewingItem?: (index: number) => void;
};
