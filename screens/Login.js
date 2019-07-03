import React, { useContext } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import styles from '../components/Style';
import { colors } from '../constants/Colors';


const Login = () => {
  const { actions, state } = useContext(AppContext);
  const { loginUser } = actions;
  const { layout, userSettings } = state;
  const { formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

  const formValidation = (
    email !== '' && email.length >= 3 &&
    password !== '' && password.length >= userSettings.minimumPasswordLength &&
    (twoFACode !== '' ? (twoFACode.length === 6 && parseInt(twoFACode)) : true)
  );
  const formValid = useFormValidation(formValidation);

  return (
    <View style={[styles.viewContainer, styles.loginView]}>
      <Text style={styles.title}>SIGN IN</Text>

      {message.loginForm &&
        <Text style={styles.textDanger}>{message.loginForm}</Text>
      }

      <TextInput
        {...bindEmail}
        style={[styles.inputField, styles.textLarge]}
        placeholder="E-mail"
        placeholderTextColor={colors.placeholderTextColor}
        keyboardType="email-address"
      />
      <TextInput
        {...bindPassword}
        secureTextEntry={true}
        style={[styles.inputField, styles.textLarge]}
        placeholder="Password"
        placeholderTextColor={colors.placeholderTextColor}
      />
      <TextInput
        {...bindTwoFACode}
        style={[styles.inputField, styles.textLarge]}
        placeholder="2 Factor Authentication Code"
        placeholderTextColor={colors.placeholderTextColor}
      />

      <Button
        //onPress={() => loginUser({ email, password, twoFACode, id: 'loginForm' })}
        onPress={() => loginUser({ email, password, twoFACode, id: 'loginForm' })}
        title={formSubmitted ? '' : 'Sign In'}
        accessibilityLabel="Log In Button"
        disabled={formSubmitted || !formValid}
        buttonStyle={[styles.submitButton, styles.loginButton]}
        disabledStyle={styles.submitButtonDisabled}
        titleStyle={styles.buttonTitle}
        disabledTitleStyle={styles.buttonTitleDisabled}
        loading={formSubmitted}
        loadingStyle={styles.submitButtonLoading}
        loadingProps={{ color: colors.concealOrange }}
      />
    </View>
  )
};

export default Login;