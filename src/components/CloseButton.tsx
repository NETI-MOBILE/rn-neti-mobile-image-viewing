import React, { FC } from 'react';
import { ColorValue, Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { CloseButtonType } from '../types';

interface ICloseButtonProps {
  onPress: () => void;
  type?: CloseButtonType;
  bgColor?: ColorValue;
  containerStyle?: StyleProp<ViewStyle>;
}

export const CloseButton: FC<ICloseButtonProps> = props => {
  const closeIconSrc =
    props.type === CloseButtonType.dark
      ? require('../assets/images/dismissWhite.png')
      : require('../assets/images/dismissBlack.png');

  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.onPress}
        style={[styles.closeButton, { backgroundColor: props.bgColor }]}
      >
        <Image source={closeIconSrc} style={styles.dismissIcon} />
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
    overflow: 'hidden',
  },
  dismissIcon: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
