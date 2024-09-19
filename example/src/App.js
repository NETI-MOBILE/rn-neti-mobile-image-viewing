import React from 'react';
import { useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ImageViewing } from 'rn-neti-mobile-image-viewing';
export default function App() {
    const imageViewingRef = useRef(null);
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
    return (React.createElement(View, { style: styles.container },
        React.createElement(TouchableOpacity, { onPress: () => {
                imageViewingRef.current?.show();
            } },
            React.createElement(Text, null, "Open")),
        React.createElement(ImageViewing, { ref: imageViewingRef, images: images })));
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
