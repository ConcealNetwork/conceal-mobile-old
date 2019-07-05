import React, { useContext } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import styles from '../components/Style';
import { colors } from '../constants/Colors';


const SignUp = props => {
  const { state } = useContext(AppContext);
  const { hidePanel, signUpUser } = props;
  const { layout, userSettings } = state;
  const { formSubmitted, message } = layout;

  const { value: userName, bind: bindUserName } = useFormInput('');
  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: password, bind: bindPassword } = useFormInput('');

  const formValidation = (
    userName !== '' && userName.length >= 3 &&
    email !== '' && /\S+@\S+\.\S+/.test(email) &&
    password !== '' && password.length >= userSettings.minimumPasswordLength
  );
  const formValid = useFormValidation(formValidation);

  return (
    <View style={[styles.viewContainer, styles.loginView]}>
      <Text style={styles.title}>SIGN UP</Text>

      {message.signUpForm &&
        <Text style={styles.textDanger}>{message.signUpForm}</Text>
      }

      <TextInput
        {...bindUserName}
        style={[styles.inputField, styles.textLarge]}
        placeholder="User Name"
        placeholderTextColor={colors.placeholderTextColor}
        textContentType="none"
      />

      <TextInput
        {...bindEmail}
        style={[styles.inputField, styles.textLarge]}
        placeholder="E-mail"
        placeholderTextColor={colors.placeholderTextColor}
        keyboardType="email-address"
        textContentType="none"
      />
      <TextInput
        {...bindPassword}
        secureTextEntry={true}
        style={[styles.inputField, styles.textLarge]}
        placeholder="Password"
        placeholderTextColor={colors.placeholderTextColor}
        textContentType="newPassword"
      />

      <Button
        onPress={() => signUpUser({ userName, email, password, id: 'signUpForm' })}
        title={formSubmitted ? '' : 'Sign Up'}
        accessibilityLabel="Sign Up Button"
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

export default SignUp;
