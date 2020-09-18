import React, { useContext, useState, useEffect } from 'react';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import localStorage from '../helpers/LocalStorage';

import { Image, CheckBox, Overlay, Icon } from 'react-native-elements';
import ConcealPassword from '../components/ccxPassword';

import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation, useCheckbox } from '../helpers/hooks';
import SignUp from './SignUp';
import AuthCheck from './AuthCheck';
import ResetPassword from './ResetPassword';
import AuthHelper from '../helpers/AuthHelper';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import { getAspectRatio } from '../helpers/utils';
import {
  View,
  Text,
  Keyboard,
  Clipboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';


const Login = () => {
  const { actions, state } = useContext(AppContext);
  const { loginUser } = actions;
  const { layout, userSettings } = state;
  const { formSubmitted } = layout;
  const { setAppData } = actions;
  const Auth = new AuthHelper(state.appSettings.apiURL);

  const { value: email, bind: bindEmail, setValue: setEmailValue } = useFormInput((localStorage.get('id_rememberme') == "TRUE") ? localStorage.get('id_username') : '');
  const { value: password, bind: bindPassword, setValue: setPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, setValue: setTwoFACode } = useFormInput('');
  const { checked: rememberMe, bind: bindRememberMe } = useCheckbox(localStorage.get('id_rememberme') == "TRUE");

  // alternative auth check state
  const [showLoginForm, setShowLoginForm] = useState(!Auth.getIsAltAuth());
  const [showAuthCheck, setShowAuthCheck] = useState(Auth.getIsAltAuth());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const formValidation = (
    email !== '' && /\S+@\S+\.\S+/.test(email) &&
    password !== '' && password.length >= userSettings.minimumPasswordLength &&
    (twoFACode !== '' ? (twoFACode.length === 6 && parseInt(twoFACode)) : true)
  );
  const formValid = useFormValidation(formValidation);

  useEffect(() => {
    if (state.layout.loginFinished && isLoggingIn) {
      console.log("isLoggingIn false");
      setIsLoggingIn(false);

      if (!Auth.loggedIn() && Auth.getIsAltAuth()) {
        setShowLoginForm(true);
      }
    }
  }, [state.layout.loginFinished]);

  return (
    <View style={AppStyles.viewContainer}>
      {!showLoginForm &&
        <View style={styles.loggingWrapper}>
          <Text style={styles.loggingH1}>Logging in</Text>
          <Text style={styles.loggingH2}>... please wait ...</Text>
        </View>
      }

      {showLoginForm &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={[AppStyles.loginView, styles.LoginContainer]}>
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
              inputStyle={AppStyles.textLarge}
              rightIcon={
                <Icon
                  onPress={() => {
                    (async () => {
                      setEmailValue(await Clipboard.getString());
                    })().catch(e => console.log(e));
                  }}
                  name='md-copy'
                  type='ionicon'
                  color='white'
                  size={32 * getAspectRatio()}
                />
              }
            />
            <ConcealPassword
              showAlternative={true}
              bindPassword={bindPassword}
              setValue={setPassword}
              inputStyle={[AppStyles.textLarge]}
            />
            <ConcealTextInput
              {...bindTwoFACode}
              placeholder="2 Factor Authentication Code"
              keyboardType="numeric"
              textContentType="none"
              inputStyle={AppStyles.textLarge}
              rightIcon={
                <Icon
                  onPress={() => {
                    (async () => {
                      setTwoFACode(await Clipboard.getString());
                    })().catch(e => console.log(e));
                  }}
                  name='md-copy'
                  type='ionicon'
                  color='white'
                  size={32 * getAspectRatio()}
                />
              }
            />
            <CheckBox
              {...bindRememberMe}
              title='Remember username'
              textStyle={styles.checkBoxText}
              containerStyle={styles.checkBoxContainer}
              checkedColor={AppColors.concealOrange}
              uncheckedColor={AppColors.concealOrange}
              size={20 * getAspectRatio()}
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
                onPress={() => setAppData({ login: { signUpVisible: true } })}
                text="Sign Up"
                style={[styles.footerBtn, styles.footerBtnRight]}
                accessibilityLabel="Sign Up Button"
                disabled={formSubmitted}
              />
            </View>

            <TouchableOpacity style={styles.forgotContainer} onPress={() => setAppData({ login: { resetPasswordVisible: true } })}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
              <Text style={styles.forgotText}>Click here</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      }
      <Overlay
        isVisible={state.appData.login.signUpVisible}
        overlayBackgroundColor={AppColors.concealBlack}
        width="100%"
        height="100%"
      >
        <SignUp
          hidePanel={() => setAppData({ login: { signUpVisible: false } })}
        />
      </Overlay>

      <Overlay
        isVisible={state.appData.login.resetPasswordVisible}
        overlayBackgroundColor={AppColors.concealBlack}
        width="100%"
        height="100%"
      >
        <ResetPassword
          hidePanel={() => setAppData({ login: { resetPasswordVisible: false } })}
        />
      </Overlay>

      <AuthCheck
        onSuccess={(userPass) => {
          setShowAuthCheck(false);
          setIsLoggingIn(true);
          loginUser({
            email: localStorage.get('id_username'),
            password: userPass,
            twoFACode,
            rememberMe,
            id: 'loginForm'
          });
        }}
        onCancel={() => {
          setShowAuthCheck(false);
          setShowLoginForm(true);
          setIsLoggingIn(false);
        }}
        showCheck={showAuthCheck}
      />
    </View>
  )
};

const styles = EStyleSheet.create({
  loggingWrapper: {
    position: 'absolute',
    right: '10rem',
    left: '10rem',
    top: '15%'
  },
  loggingH1: {
    fontSize: '26rem',
    textAlign: 'center',
    color: AppColors.concealTextColor,
  },
  loggingH2: {
    fontSize: '18rem',
    textAlign: 'center',
    color: AppColors.concealTextColor,
  },
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
    borderColor: AppColors.concealBlack,
    backgroundColor: AppColors.concealBlack,
    marginTop: '10rem'
  },
  checkBoxText: {
    fontSize: '18rem',
    color: '#828282'
  },
  forgotContainer: {
    marginTop: '15rem'
  },
  LoginContainer: {
    paddingTop: 60
  }
});

export default Login;