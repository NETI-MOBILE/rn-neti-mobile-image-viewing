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

Optionally, you can install react-native-safe-area-context, if you want to consider screen safe zones (insets),
when working with photos and zoom. In another case EdgeInsets (top/bottom/left/right) will be equal to 0.

## Usage
You can check common usage [example](./example/Sample.tsx)

  ```jsx
import { ImageViewing, ImageViewingInstance } from 'rn-neti-mobile-image-viewing';

export default function App() {
  return <ImageViewing ref={imageViewingRef} images={images} insets={insets} />;
}
```

## Props

| Name                 | Type                            | Description                                                                                                                         |
|----------------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| images               | IImageModel[]                   | Image data array                                                                                                                    |
| ref                  | React.Ref<ImageViewingInstance> | Optional. ImageViewingInstance to show or hide carousel with images. It also includes snapItem feature with scroll to item by index |
| insets               | IEdgeInsets                     | Optional. Screen insets to consider device safe zones                                                                               |
| isZoomEnabled        | boolean                         | Optional. Parameter to enable/disable zoom support. Enabled by default                                                              |                                                                                                    |
| isSwipeEnabled       | boolean                         | Optional. Parameter to enable/disable swipe support. Enabled by default                                                             |                                                                                                    |
| isOrientationEnabled | boolean                         | Optional. Parameter to enable/disable orientation support. Disabled by default                                                      |                                                                                                    |
| onSnapViewingItem    | (index: number) => void         | Callback. Gets called when navigating to an item                                                                                    |                                                                                                    |
| config               | IConfig                         | Optional. Config for custom zoom and swipe settings                                                                                 |                                                                                                    |
| colors               | IColors                         | Optional. Colors config to customize the current colors                                                                             |                                                                                                    |
| closeButtonType      | CloseButtonType                 | Optional. Close button type to customize close button color value (light/dark). Light by default                                    |                                                                                                    |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Credits

Made with [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)
