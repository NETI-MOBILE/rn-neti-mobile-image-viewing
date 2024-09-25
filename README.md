# rn-neti-mobile-image-viewing

React-Native library for image viewing with zoom and orientation change.

https://github.com/user-attachments/assets/1b89f85f-4bdc-4219-abb2-d70f3e92746a

## Installation

  ```sh
# npm
npm install rn-neti-mobile-image-viewing
# yarn
yarn add rn-neti-mobile-image-viewing
```

## Peer dependencies

For the package to work, you must install [react-native-orientation-locker](https://github.com/wonday/react-native-orientation-locker) ^1.7.0.

Optionally, you can use react-native-safe-area-context, if you want to consider screen safe zones (insets),
when working with photos and zoom. In case you don't need them, EdgeInsets (top/bottom/left/right) will be equal to 0.

## Usage
You can check common usage [example](./example/Sample.tsx)

  ```jsx
import { ImageViewing, ImageViewingInstance } from 'rn-neti-mobile-image-viewing';

export default function App() {
  return <ImageViewing ref={imageViewingRef} images={images} insets={insets} />;
}
```

## Props

- `ref` - ImageViewingInstance to show or hide carousel with images. It also includes snapItem feature with scroll to item by index.
- `images` - Image data array.
- `insets` - Screen insets to consider device safe zones.
- `isZoomEnabled` - Parameter to enable/disable zoom support. Enabled by default.
- `isSwipeEnabled` - Parameter to enable/disable swipe support. Enabled by default.
- `isOrientationEnabled` - Parameter to enable/disable orientation support. Disabled by default.
- `onSnapViewingItem` - Callback. Gets called when navigating to an item.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Credits

Made with [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)
