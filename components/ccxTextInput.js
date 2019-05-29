import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const inputTheme = {
  roundness: 0,
  colors: {
    text: "#FFFFFF",
    primary: '#FFA500',
    placeholder: "#6c757d"
  }
}

export default function ConcealTextInput({
  onChangeText,
  value,
  label,
  placeholder,
  keyboardType
}) {
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      theme={inputTheme}
      label={label}
      mode="flat"
      style={styles.input}
      placeholder={placeholder}
      keyboardType={keyboardType ? keyboardType : "default"}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#212529"
  },
})