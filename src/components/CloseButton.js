import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CloseButtonType } from '../types';
export const CloseButton = props => {
    const closeIconSrc = props.type === CloseButtonType.dark
        ? require('../assets/images/dismissWhite.png')
        : require('../assets/images/dismissBlack.png');
    return (React.createElement(View, { style: props.containerStyle },
        React.createElement(TouchableOpacity, { activeOpacity: 0.7, onPress: props.onPress, style: [styles.closeButton, { backgroundColor: props.bgColor }] },
            React.createElement(Image, { source: closeIconSrc, style: styles.dismissIcon }))));
};
const styles = StyleSheet.create({
    closeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    dismissIcon: {
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
