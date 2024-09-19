import React, { FC, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View, ImageProps, StyleProp, ViewStyle } from 'react-native';

import { ImageViewingColors } from '../settings/ImageViewingColors';

interface IImageWithLoaderProps extends ImageProps {
  loaderStyles?: StyleProp<ViewStyle>;
  containerStyles?: StyleProp<ViewStyle>;
}

export const ImageWithLoader: FC<IImageWithLoaderProps> = props => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingStart = () => {
    setIsLoading(true);
  };

  const handleLoadingEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={props.containerStyles}>
      <Image
        style={[styles.image, props.style]}
        onLoadStart={handleLoadingStart}
        onLoad={handleLoadingEnd}
        onError={handleLoadingEnd}
        {...props}
      />

      <View style={[styles.loaderWrapper, props.loaderStyles]}>
        {isLoading && <ActivityIndicator size={'small'} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  loaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: -2,
    backgroundColor: ImageViewingColors.white,
  },
});
