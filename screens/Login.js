import React, { useContext } from 'react';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';

import { Image } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  Animated,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet
} from 'react-native';


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
    <View style={AppStyles.viewContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={AppStyles.loginView}>
          <Image
            source={require('../assets/images/icon.png')}
            style={{ width: 150, height: 150 }}
          />
          <Text style={AppStyles.title}>SIGN IN</Text>
          <ConcealTextInput
            {...bindEmail}
            placeholder="E-mail"
            keyboardType="email-address"
            textContentType="emailAddress"
            inputStyle={AppStyles.loginInput}
          />
          <ConcealTextInput
            {...bindPassword}
            secureTextEntry={true}
            placeholder="Password"
            textContentType="password"
            inputStyle={AppStyles.loginInput}
          />
          <ConcealTextInput
            {...bindTwoFACode}
            placeholder="2 Factor Authentication Code"
            keyboardType="numeric"
            textContentType="none"
            inputStyle={AppStyles.loginInput}
          />

          <View style={styles.footer}>
            <ConcealButton
              onPress={() => loginUser({ email, password, twoFACode, id: 'loginForm' })}
              text={'Sign In'}
              accessibilityLabel="Log In Button"
              disabled={formSubmitted || !formValid}
              style={[styles.footerBtn, styles.footerBtnLeft]}
            />

            <ConcealButton
              onPress={() => signUpPanel.show()}
              text="Sign Up"
              style={[styles.footerBtn, styles.footerBtnRight]}
              accessibilityLabel="Sign Up Button"
              disabled={formSubmitted}
            />
          </View>

          {/*
          <Button
            onPress={() => resetPasswordPanel.show()}
            title="Reset Password"
            accessibilityLabel="Reset Password Up Button"
            disabled={formSubmitted}
            buttonStyle={[AppStyles.submitButton, AppStyles.loginButton]}
            disabledStyle={AppStyles.submitButtonDisabled}
            titleStyle={AppStyles.buttonTitle}
            disabledTitleStyle={AppStyles.buttonTitleDisabled}
          />
          */}


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

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: 5,
  },
  footerBtnLeft: {
    marginRight: 5,
  }
});


export default Login;
