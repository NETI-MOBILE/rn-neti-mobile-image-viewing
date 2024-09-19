import React, { FC } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ImageViewingColors } from '../settings/ImageViewingColors';

interface ICloseButtonProps {
  handleClose: () => void;
  color?: string;
  bgColor?: string;
  containerStyle?: ViewStyle;
}

export const CloseButton: FC<ICloseButtonProps> = props => {
  //Renders

  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.handleClose}
        style={[styles.closeButton, { backgroundColor: props.bgColor || ImageViewingColors.outline }]}
      >
        <Image source={{ uri: require('../assets/images/dismiss_icon.png') }} style={styles.dismissIcon} />
      </TouchableOpacity>
    </View>
  );
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
