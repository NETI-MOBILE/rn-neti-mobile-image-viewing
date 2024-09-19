import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { ImageViewingColors } from '../settings/ImageViewingColors';
export const ImageWithLoader = props => {
    const [isLoading, setIsLoading] = useState(true);
    const handleLoadingStart = () => {
        setIsLoading(true);
    };
    const handleLoadingEnd = () => {
        setIsLoading(false);
    };
    return (React.createElement(View, { style: props.containerStyles },
        React.createElement(Image, { style: [styles.image, props.style], onLoadStart: handleLoadingStart, onLoad: handleLoadingEnd, onError: handleLoadingEnd, ...props }),
        React.createElement(View, { style: [styles.loaderWrapper, props.loaderStyles] }, isLoading && React.createElement(ActivityIndicator, { size: 'small' }))));
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
