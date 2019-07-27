import React from 'react';
import { Button } from 'react-native-elements';
import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function ConcealButton({
  disabledTitleStyle,
  disabledStyle,
  loadingStyle,
  loadingProps,
  buttonStyle,
  titleStyle,
  disabled,
  onPress,
  loading,
  style,
  icon,
  text
}) {
  var disabledTitleStyles = [styles.btnDisabledText];
  var disabledStyles = [styles.btnDisabled];
  var titleStyles = [styles.btnText];
  var btnStyles = [styles.button];

  if (buttonStyle) {
    if (Array.isArray(buttonStyle)) {
      btnStyles = inputStyles.concat(buttonStyle);
    } else {
      btnStyles.push(buttonStyle);
    }
  }

  if (titleStyle) {
    if (Array.isArray(titleStyle)) {
      titleStyles = inputStyles.concat(titleStyle);
    } else {
      titleStyles.push(titleStyle);
    }
  }

  if (disabledStyle) {
    if (Array.isArray(disabledStyle)) {
      disabledStyles = inputStyles.concat(disabledStyle);
    } else {
      disabledStyles.push(disabledStyle);
    }
  }

  if (disabledTitleStyle) {
    if (Array.isArray(disabledTitleStyle)) {
      disabledTitleStyles = inputStyles.concat(disabledTitleStyle);
    } else {
      disabledTitleStyles.push(disabledTitleStyle);
    }
  }

  if (!disabled) {
    disabled = false;
  }

  return (
    <Button
      title={text || ''}
      icon={icon || null}
      onPress={onPress || null}
      disabled={disabled || null}
      buttonStyle={btnStyles}
      containerStyle={style || null}
      titleStyle={titleStyles}
      disabledStyle={disabledStyles}
      disabledTitleStyle={disabledTitleStyles}
      loadingStyle={loadingStyle || null}
      loadingProps={loadingProps || null}
      loading={loading || null}
    />
  );
}

const styles = EStyleSheet.create({
  button: {
    height: '45rem',
    borderWidth: 1,
    borderColor: AppColors.concealOrange,
    backgroundColor: "transparent"
  },
  btnDisabled: {
    borderColor: 'rgba(255, 165, 0, 0.3)',
    backgroundColor: "transparent"
  },
  btnText: {
    color: "#AAA",
    fontSize: '14rem'
  },
  btnDisabledText: {
    color: "#666"
  }
})