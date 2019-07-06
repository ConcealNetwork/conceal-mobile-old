import React from 'react';
import { colors } from '../constants/Colors';
import { Button } from 'react-native-elements';
import { StyleSheet, Text } from 'react-native';

export default function ConcealButton({
  loadingStyle,
  loadingProps,
  disabled,
  onPress,
  loading,
  style,
  text
}) {
  var btnStyles = [styles.button];

  if (!disabled) {
    disabled = false;
  }

  return (
    <Button
      title={text || ''}
      onPress={onPress || null}
      disabled={disabled || null}
      buttonStyle={btnStyles || null}
      containerStyle={style || null}
      titleStyle={styles.btnText || null}
      disabledStyle={styles.btnDisabled || null}
      disabledTitleStyle={styles.btnDisabledText || null}
      loadingStyle={loadingStyle || null}
      loadingProps={loadingProps || null}
      loading={loading || null}
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