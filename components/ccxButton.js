import React from 'react';
import { colors } from '../constants/Colors';
import { Button } from 'react-native-elements';
import { StyleSheet, Text } from 'react-native';

export default function ConcealButton({
  disabled,
  onPress,
  style,
  text
}) {
  var btnStyles = [styles.button];

  if (!disabled) {
    disabled = false;
  }

  return (
    <Button
      title={text}
      onPress={onPress}
      disabled={disabled}
      buttonStyle={btnStyles}
      containerStyle={style}
      titleStyle={styles.btnText}
      disabledStyle={styles.btnDisabled}
      disabledTitleStyle={styles.btnDisabledText}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.concealOrange,
    backgroundColor: "transparent"
  },
  btnDisabled: {
    borderColor: 'rgba(255, 165, 0, 0.3)',
    backgroundColor: "transparent"
  },
  btnText: {
    color: "#AAA"
  },
  btnDisabledText: {
    color: "#666"
  }
})