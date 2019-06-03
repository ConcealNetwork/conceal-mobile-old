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
  style,
  placeholder,
  keyboardType
}) {
  var compStyles = [styles.input];

  if (style) {
    if (Array.isArray(style)) {
      compStyles = compStyles.concat(style);
    } else {
      compStyles.push(style);
    }
  }

  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      theme={inputTheme}
      label={label}
      mode="flat"
      style={compStyles}
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