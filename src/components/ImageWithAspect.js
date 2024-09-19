import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import ImageViewRenderHelper from '../helpers/ImageViewRenderHelper';
import OrientationHelper from '../helpers/OrientationHelper';
export const ImageWithAspect = props => {
    const { width } = useWindowDimensions();
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [imageAspect, setImageAspect] = useState(null);
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
    return imageAspect ? (React.createElement(View, { style: [
            styles.containerImage,
            {
                aspectRatio: imageAspect,
                width: width,
                height: OrientationHelper.isPortraitOrientation(props.orientation) ? undefined : width,
            },
        ] },
        props.image?.url ? (React.createElement(Image, { source: { uri: props.image.url }, resizeMode: 'contain', style: styles.image, onLoadStart: handleLoadingStart, onLoad: handleLoadingEnd, onError: handleOnError })) : (React.createElement(View, { style: styles.image })),
        React.createElement(View, { style: styles.loaderWrapper }, isLoadingContent && React.createElement(ActivityIndicator, { size: 'small' })))) : (React.createElement(View, null,
        React.createElement(ActivityIndicator, { size: "small" })));
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
