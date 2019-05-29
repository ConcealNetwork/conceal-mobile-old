import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';

const btnTheme = {
  roundness: 0,
  colors: {
    primary: "#FFA500"
  }
}

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
      theme={btnTheme}
      onPress={onPress}
      style={btnStyles}
      contentStyle={styles.buttonContent}
      mode="contained"
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5
  },
  buttonContent: {
    height: 45
  },
  buttonText: {
    color: "#FFFFFF",
    textShadowColor: '#666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5
  }
})