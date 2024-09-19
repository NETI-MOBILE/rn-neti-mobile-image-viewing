import React, { useState, FC } from 'react';
import { ActivityIndicator, Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { OrientationType } from 'react-native-orientation-locker';

import ImageViewRenderHelper from '../helpers/ImageViewRenderHelper';
import OrientationHelper from '../helpers/OrientationHelper';
import { IImageModel, Nullable } from '../types';

interface IImageWithAspect {
  image: IImageModel;
  orientation: OrientationType;
}

export const ImageWithAspect: FC<IImageWithAspect> = props => {
  const { width } = useWindowDimensions();

  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [imageAspect, setImageAspect] = useState<Nullable<number>>(null);

  // Handlers

  const handleLoadingStart = () => {
    setIsLoadingContent(true);
  };

  const handleLoadingEnd = () => {
    setIsLoadingContent(false);
  };

  const handleOnError = () => {
    handleLoadingEnd();
  };

  const handleSetImageAspect = async () => {
    const aspect = await ImageViewRenderHelper.getImageAspect(props.image);
    setImageAspect(aspect);
  };

  // Renders

  if (!imageAspect) {
    handleSetImageAspect();
  }

  return imageAspect ? (
    <View
      style={[
        styles.containerImage,
        {
          aspectRatio: imageAspect,
          width: width,
          height: OrientationHelper.isPortraitOrientation(props.orientation) ? undefined : width,
        },
      ]}
    >
      {props.image?.url ? (
        <Image
          source={{ uri: props.image.url }}
          resizeMode={'contain'}
          style={styles.image}
          onLoadStart={handleLoadingStart}
          onLoad={handleLoadingEnd}
          onError={handleOnError}
        />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.loaderWrapper}>{isLoadingContent && <ActivityIndicator size={'small'} />}</View>
    </View>
  ) : (
    <View>
      <ActivityIndicator size="small" />
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    width: '100%',
    overflow: 'hidden',
    alignItems: undefined, // переопределяем стили в ImageWithLoader,
    justifyContent: undefined, // переопределяем стили в ImageWithLoader
  },
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
  },
});
