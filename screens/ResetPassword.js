import React, { useContext } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import styles from '../components/Style';
import { colors } from '../constants/Colors';


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
    <View style={[styles.viewContainer, styles.loginView]}>
      <Text style={styles.title}>RESET PASSWORD</Text>

      {message.resetPasswordForm &&
        <Text style={styles.textDanger}>{message.resetPasswordForm}</Text>
      }

      <TextInput
        {...bindEmail}
        style={[styles.inputField, styles.textLarge]}
        placeholder="E-mail"
        placeholderTextColor={colors.placeholderTextColor}
        keyboardType="email-address"
        textContentType="none"
        secureTextEntry={false}
      />

      <Button
        onPress={() => resetPassword({ email, id: 'resetPasswordForm' })}
        title={formSubmitted ? '' : 'Send E-mail'}
        accessibilityLabel="Send E-mail Button"
        disabled={formSubmitted || !formValid}
        buttonStyle={[styles.submitButton, styles.loginButton]}
        disabledStyle={styles.submitButtonDisabled}
        titleStyle={styles.buttonTitle}
        disabledTitleStyle={styles.buttonTitleDisabled}
        loading={formSubmitted}
        loadingStyle={styles.submitButtonLoading}
        loadingProps={{ color: colors.concealOrange }}
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
