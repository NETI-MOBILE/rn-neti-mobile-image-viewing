import React, { useState, FC, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { OrientationType } from 'react-native-orientation-locker';

import ImageViewHelper from '../helpers/ImageViewHelper';
import OrientationHelper from '../helpers/OrientationHelper';
import { IImageModel, Nullable } from '../types';

interface IImageWithAspectProps {
  image: IImageModel;
  orientation: OrientationType;
}

export const ImageWithAspect: FC<IImageWithAspectProps> = props => {
  const { width } = useWindowDimensions();

  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [imageAspect, setImageAspect] = useState<Nullable<number>>(null);

  useEffect(() => {
    (async () => {
      if (!imageAspect) {
        await handleSetImageAspect();
      }
    })();
  }, []);

  // Handlers

  const handleOnLoadStart = () => {
    setIsLoadingContent(true);
  };

  const handleOnLoad = () => {
    setIsLoadingContent(false);
  };

  const handleSetImageAspect = async () => {
    const aspect = await ImageViewHelper.getImageAspect(props.image);
    setImageAspect(aspect);
  };

  // Renders

  return imageAspect ? (
    <View
      style={[
        styles.imageContainer,
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
          resizeMode="contain"
          style={styles.image}
          onLoadStart={handleOnLoadStart}
          onLoad={handleOnLoad}
          onError={handleOnLoad}
        />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.loaderWrapper}>{isLoadingContent && <ActivityIndicator size="small" />}</View>
    </View>
  ) : (
    <ActivityIndicator size="small" />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
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
