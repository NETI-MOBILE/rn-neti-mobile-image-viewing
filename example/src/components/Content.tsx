import React, { FC, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageViewing, ImageViewingInstance } from 'rn-nextika-image-viewing';

export const Content: FC = () => {
  const insets = useSafeAreaInsets();

  const imageViewingRef = useRef<ImageViewingInstance | null>(null);

  const images = [
    { url: 'https://i.ibb.co/9VcD4NL/sample1.jpg', sizes: { width: 1280, height: 960 } },
    { url: 'https://i.ibb.co/bRXvxxM/sample2.jpg', sizes: { width: 1440, height: 959 } },
    { url: 'https://i.ibb.co/pxX6w3L/sample3.jpg', sizes: { width: 960, height: 1280 } },
  ];

  const handleOnOpenPress = () => {
    imageViewingRef.current?.show();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOnOpenPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Open</Text>
      </TouchableOpacity>
      <ImageViewing ref={imageViewingRef} images={images} insets={insets} isOrientationEnabled hideOverlayOnZoom />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: 'blue',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
