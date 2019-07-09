import React, { useContext } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';


const ResetPassword = props => {
  const { state } = useContext(AppContext);
  const { hidePanel, resetPassword } = props;
  const { layout } = state;
  const { formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput('');

  const formValidation = (
    email !== '' && /\S+@\S+\.\S+/.test(email)
  );
  const formValid = useFormValidation(formValidation);

  return (
    <View style={[AppStyles.viewContainer, AppStyles.loginView]}>
      <Text style={AppStyles.title}>RESET PASSWORD</Text>

      {message.resetPasswordForm &&
        <Text style={AppStyles.textDanger}>{message.resetPasswordForm}</Text>
      }

      <TextInput
        {...bindEmail}
        style={[AppStyles.inputField, AppStyles.textLarge]}
        placeholder="E-mail"
        placeholderTextColor={AppColors.placeholderTextColor}
        keyboardType="email-address"
        textContentType="none"
        secureTextEntry={false}
      />

      <Button
        onPress={() => resetPassword({ email, id: 'resetPasswordForm' })}
        title={formSubmitted ? '' : 'Send E-mail'}
        accessibilityLabel="Send E-mail Button"
        disabled={formSubmitted || !formValid}
        buttonStyle={[AppStyles.submitButton, AppStyles.loginButton]}
        disabledStyle={AppStyles.submitButtonDisabled}
        titleStyle={AppStyles.buttonTitle}
        disabledTitleStyle={AppStyles.buttonTitleDisabled}
        loading={formSubmitted}
        loadingStyle={AppStyles.submitButtonLoading}
        loadingProps={{ color: AppColors.concealOrange }}
      />
      <Button
        onPress={() => hidePanel()}
        title="Cancel"
        accessibilityLabel="Cancel Button"
      />
    </View>
  )
};

export default ResetPassword;
