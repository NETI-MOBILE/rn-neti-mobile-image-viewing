import React from 'react';
import { useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ImageViewing, ImageViewingInstance } from 'rn-neti-mobile-image-viewing';

export default function App() {
  const imageViewingRef = useRef<ImageViewingInstance>(null);

  const images = useMemo(() => {
    return [
      {
        url: 'https://bakewithmeapi-dev.netimob.com/storage/files/0d/32/70e468463c18fb0ddd7aa325d73806fe.jpg',
        sizes: { width: 1280, height: 960 },
      },
      {
        url: 'https://bakewithmeapi-dev.netimob.com/storage/files/47/84/59258cfae3aa20267c57e7a1d300ad7a.jpg',
        sizes: { width: 1440, height: 959 },
      },
      {
        url: 'https://bakewithmeapi-dev.netimob.com/storage/files/f2/ad/bebee12c4635098878c256171f906f57.jpg',
        sizes: { width: 960, height: 1280 },
      },
    ];
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          imageViewingRef.current?.show();
        }}
      >
        <Text>Open</Text>
      </TouchableOpacity>
      <ImageViewing ref={imageViewingRef} images={images} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
