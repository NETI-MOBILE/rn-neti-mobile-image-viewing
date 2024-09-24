import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//@ts-expect-error we don't have such package, this is a usage example case
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageViewing, ImageViewingInstance } from 'rn-neti-mobile-image-viewing';

export default function Sample() {
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
    <SafeAreaProvider style={styles.provider}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleOnOpenPress} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Open</Text>
        </TouchableOpacity>
        <ImageViewing ref={imageViewingRef} images={images} insets={insets} isOrientationEnabled />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  provider: {
    flex: 1,
  },
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
