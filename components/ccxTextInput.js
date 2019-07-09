import React from 'react';
import { Input } from 'react-native-elements';
import { AppColors } from '../constants/Colors';
import { StyleSheet } from 'react-native';

export default function ConcealTextInput({
  onChangeText,
  value,
  editable,
  rightIcon,
  inputStyle,
  placeholder,
  keyboardType,
  containerStyle,
  secureTextEntry,
  textContentType,
  inputContainerStyle
}) {
  var inputContainerStyles = [styles.InputContainer];
  var containerStyles = [styles.Container];
  var inputStyles = [styles.Input];

  if (inputStyle) {
    if (Array.isArray(inputStyle)) {
      inputStyles = inputStyles.concat(inputStyle);
    } else {
      inputStyles.push(inputStyle);
    }
  }

  if (containerStyle) {
    if (Array.isArray(containerStyle)) {
      containerStyles = containerStyles.concat(containerStyle);
    } else {
      containerStyles.push(containerStyle);
    }
  }

  if (inputContainerStyle) {
    if (Array.isArray(inputContainerStyle)) {
      inputContainerStyles = inputContainerStyles.concat(inputContainerStyle);
    } else {
      inputContainerStyles.push(inputContainerStyle);
    }
  }

  if (editable == undefined) {
    editable = true;
  }

  return (
    <Input
      value={value}
      editable={editable}
      inputStyle={inputStyles}
      placeholder={placeholder}
      onChangeText={onChangeText}
      containerStyle={containerStyles}
      secureTextEntry={secureTextEntry}
      textContentType={textContentType}
      inputContainerStyle={inputContainerStyles}
      keyboardType={keyboardType ? keyboardType : "default"}
      placeholderTextColor={AppColors.placeholderTextColor}
      rightIcon={rightIcon}
    />
  );
}

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: 40,
    marginTop: 5,
    borderWidth: 0,
    marginBottom: 5
  },
  InputContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'rgb(55, 55, 55)'
  },
  Input: {
    fontSize: 20,
    color: 'rgb(255, 255, 255)'
  }
})