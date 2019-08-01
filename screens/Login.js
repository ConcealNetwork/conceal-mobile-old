import React, { useContext } from 'react';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import EStyleSheet from 'react-native-extended-stylesheet';

import { Image, CheckBox } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation, useCheckbox } from '../helpers/hooks';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import { getAspectRatio } from '../helpers/utils';
import {
  View,
  Text,
  Animated,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';


const Login = () => {
  const { actions, state } = useContext(AppContext);
  const { loginUser, resetPassword, signUpUser } = actions;
  const { layout, userSettings, appData } = state;
  const { formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput(global.username);
  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');
  const { checked: rememberMe, bind: bindRememberMe } = useCheckbox(global.rememberme);

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
            style={{ width: 150 * getAspectRatio(), height: 150 * getAspectRatio() }}
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
          <CheckBox
            {...bindRememberMe}
            title='Remember username'
            textStyle={styles.checkBoxText}
            containerStyle={styles.checkBoxContainer}
            checkedColor={AppColors.concealOrange}
            uncheckedColor={AppColors.concealOrange}
          />

          <View style={styles.footer}>
            <ConcealButton
              onPress={() => loginUser({ email, password, twoFACode, rememberMe, id: 'loginForm' })}
              text='Sign In'
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

          <TouchableOpacity onPress={() => resetPasswordPanel.show()}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
            <Text style={styles.forgotText}>Click here</Text>
          </TouchableOpacity>

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

const styles = EStyleSheet.create({
  footer: {
    flex: 1,
    marginTop: '20rem',
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: '5rem',
  },
  footerBtnLeft: {
    marginRight: '5rem',
  },
  forgotText: {
    textAlign: 'center',
    color: AppColors.concealOrange,
    fontSize: '16rem'
  },
  checkBoxContainer: {
    borderColor: AppColors.concealBorderColor,
    backgroundColor: AppColors.concealBlack
  },
  checkBoxText: {
    fontSize: '18rem',
    color: '#828282'
  }
});


export default Login;
