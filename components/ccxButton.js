import React from 'react';
import { colors } from '../constants/Colors';
import { Button } from 'react-native-elements';
import { StyleSheet, Text } from 'react-native';

export default function ConcealButton({
  onPress,
  style,
  text
}) {
  var btnStyles = [styles.button];

  if (style) {
    if (Array.isArray(style)) {
      btnStyles = btnStyles.concat(style);
    } else {
      btnStyles.push(style);
    }
  }

  return (
    <Button
      title={text}
      onPress={onPress}
      buttonStyle={btnStyles}
      containerStyle={btnStyles}
      titleStyle={styles.buttonText}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 5,
    backgroundColor: colors.concealOrange
  },
  buttonText: {
    color: "#FFFFFF",
    textShadowColor: '#666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5
  }
})