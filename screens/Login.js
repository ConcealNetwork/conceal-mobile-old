import React, { useContext } from 'react';
import { Animated, Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { Button } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import { colors } from '../constants/Colors';
import styles from '../components/Style';


const Login = () => {
  const { actions, state } = useContext(AppContext);
  const { loginUser, resetPassword, signUpUser } = actions;
  const { layout, userSettings } = state;
  const { formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

  let signUpPanel;
  let resetPasswordPanel;

  const formValidation = (
    email !== '' && /\S+@\S+\.\S+/.test(email) &&
    password !== '' && password.length >= userSettings.minimumPasswordLength &&
    (twoFACode !== '' ? (twoFACode.length === 6 && parseInt(twoFACode)) : true)
  );
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.viewContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.loginView}>
          <Text style={styles.title}>SIGN IN</Text>

          {(message.loginForm || message.signUpForm) &&
            <Text style={styles.textDanger}>{message.signUpForm || message.loginForm}</Text>
          }

          <TextInput
            {...bindEmail}
            style={[styles.inputField, styles.textLarge]}
            placeholder="E-mail"
            placeholderTextColor={colors.placeholderTextColor}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            {...bindPassword}
            secureTextEntry={true}
            style={[styles.inputField, styles.textLarge]}
            placeholder="Password"
            placeholderTextColor={colors.placeholderTextColor}
            textContentType="password"
          />
          <TextInput
            {...bindTwoFACode}
            style={[styles.inputField, styles.textLarge]}
            placeholder="2 Factor Authentication Code"
            placeholderTextColor={colors.placeholderTextColor}
            keyboardType="numeric"
            textContentType="none"
          />

          <Button
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

          <Button
            onPress={() => signUpPanel.show()}
            title="Sign Up"
            accessibilityLabel="Sign Up Button"
            disabled={formSubmitted}
            buttonStyle={[styles.submitButton, styles.loginButton]}
            disabledStyle={styles.submitButtonDisabled}
            titleStyle={styles.buttonTitle}
            disabledTitleStyle={styles.buttonTitleDisabled}
          />

          <Button
            onPress={() => resetPasswordPanel.show()}
            title="Reset Password"
            accessibilityLabel="Reset Password Up Button"
            disabled={formSubmitted}
            buttonStyle={[styles.submitButton, styles.loginButton]}
            disabledStyle={styles.submitButtonDisabled}
            titleStyle={styles.buttonTitle}
            disabledTitleStyle={styles.buttonTitleDisabled}
          />


          <SlidingUpPanel ref={c => signUpPanel = c} animatedValue={new Animated.Value(0)}>
            <SignUp
              signUpUser={data => {
                signUpUser(data);
                Keyboard.dismiss();
                signUpPanel.hide();
              }}
              hidePanel={() => signUpPanel.hide()}
            />
          </SlidingUpPanel>

          <SlidingUpPanel ref={c => resetPasswordPanel = c} animatedValue={new Animated.Value(0)}>
            <ResetPassword
              resetPassword={data => {
                resetPassword(data);
                Keyboard.dismiss();
                resetPasswordPanel.hide();
              }}
              hidePanel={() => resetPasswordPanel.hide()}
            />
          </SlidingUpPanel>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
};

export default Login;
