import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//@ts-expect-error we don't have such package, this is a usage example case
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageViewing } from 'rn-neti-mobile-image-viewing';
export default function Sample() {
    const insets = useSafeAreaInsets();
    const imageViewingRef = useRef(null);
    const images = [
        { url: 'https://i.ibb.co/9VcD4NL/sample1.jpg', sizes: { width: 1280, height: 960 } },
        { url: 'https://i.ibb.co/bRXvxxM/sample2.jpg', sizes: { width: 1440, height: 959 } },
        { url: 'https://i.ibb.co/pxX6w3L/sample3.jpg', sizes: { width: 960, height: 1280 } },
    ];
    const handleOnOpenPress = () => {
        imageViewingRef.current?.show();
    };
    return (React.createElement(SafeAreaProvider, { style: styles.provider },
        React.createElement(View, { style: styles.container },
            React.createElement(TouchableOpacity, { onPress: handleOnOpenPress, style: styles.buttonContainer },
                React.createElement(Text, { style: styles.buttonText }, "Open")),
            React.createElement(ImageViewing, { ref: imageViewingRef, images: images, insets: insets, isOrientationEnabled: true }))));
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
