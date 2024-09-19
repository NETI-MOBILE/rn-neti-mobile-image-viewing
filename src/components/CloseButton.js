import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageViewingColors } from '../settings/ImageViewingColors';
export const CloseButton = props => {
    //Renders
    return (React.createElement(View, { style: props.containerStyle },
        React.createElement(TouchableOpacity, { activeOpacity: 0.7, onPress: props.handleClose, style: [styles.closeButton, { backgroundColor: props.bgColor || ImageViewingColors.outline }] },
            React.createElement(Image, { source: { uri: require('../assets/images/dismiss_icon.png') }, style: styles.dismissIcon }))));
};
const styles = StyleSheet.create({
    closeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    dismissIcon: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
