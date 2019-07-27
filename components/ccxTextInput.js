import React from 'react';
import { Input } from 'react-native-elements';
import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function ConcealTextInput({
  onChangeText,
  value,
  label,
  editable,
  rightIcon,
  inputStyle,
  labelStyle,
  placeholder,
  keyboardType,
  containerStyle,
  secureTextEntry,
  textContentType,
  inputContainerStyle
}) {
  var inputContainerStyles = [styles.InputContainer];
  var containerStyles = [styles.Container];
  var labelStyles = [styles.label];
  var inputStyles = [styles.Input];

  if (inputStyle) {
    if (Array.isArray(inputStyle)) {
      inputStyles = inputStyles.concat(inputStyle);
    } else {
      inputStyles.push(inputStyle);
    }
  }

  if (labelStyle) {
    if (Array.isArray(labelStyle)) {
      labelStyles = labelStyles.concat(labelStyle);
    } else {
      labelStyles.push(labelStyle);
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
      label={label}
      editable={editable}
      inputStyle={inputStyles}
      labelStyle={labelStyles}
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

const styles = EStyleSheet.create({
  Container: {
    width: '100%',
    height: '40rem',
    marginTop: '5rem',
    borderWidth: 0,
    marginBottom: '5rem'
  },
  InputContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'rgb(55, 55, 55)'
  },
  Input: {
    fontSize: '20rem',
    color: 'rgb(255, 255, 255)'
  },
  label: {
    color: 'rgb(255, 0, 0)'
  }
})