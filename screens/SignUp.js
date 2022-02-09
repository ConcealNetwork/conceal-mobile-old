import React, { useContext, useRef } from 'react';
import { Image } from 'react-native-elements';
import ConcealButton from '../components/ccxButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealCaptcha from '../components/hCaptcha';
import { AppContext } from '../components/ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity 
} from 'react-native';


const SignUp = props => {
  const { actions, state } = useContext(AppContext);
  const { layout, userSettings } = state;
  const { formSubmitted, message } = layout;
  const { signUpUser } = actions;
  const { hidePanel } = props;

  // captcha related fields and hooks
  const [hCode, setHCode] = React.useState("");

  const { value: userName, bind: bindUserName } = useFormInput('');
  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: password, bind: bindPassword } = useFormInput('');

  const formValidation = (
    hCode !== '' &&
    userName !== '' && userName.length >= 3 &&    
    email !== '' && /\S+@\S+\.\S+/.test(email) &&
    password !== '' && password.length >= userSettings.minimumPasswordLength
  );
  const formValid = useFormValidation(formValidation);

  const onCaptchaChange = (code) => {
    setHCode(code);
  };

  return (
    <ScrollView contentContainerStyle={AppStyles.loginView}>
      <Image
        source={require('../assets/images/icon.png')}
        style={{ width: 150 * getAspectRatio(), height: 150 * getAspectRatio() }}
      />
      <Text style={AppStyles.title}>SIGN UP</Text>

      {message.signUpForm &&
        <Text style={AppStyles.textDanger}>{message.signUpForm}</Text>
      }

      <TextInput
        {...bindUserName}
        style={[AppStyles.inputField, AppStyles.textLarge]}
        placeholder="User Name"
        placeholderTextColor={AppColors.placeholderTextColor}
        textContentType="none"
      />

      <TextInput
        {...bindEmail}
        style={[AppStyles.inputField, AppStyles.textLarge]}
        placeholder="E-mail"
        placeholderTextColor={AppColors.placeholderTextColor}
        keyboardType="email-address"
        textContentType="none"
      />
      <TextInput
        {...bindPassword}
        secureTextEntry={true}
        style={[AppStyles.inputField, AppStyles.textLarge]}
        placeholder="Password"
        placeholderTextColor={AppColors.placeholderTextColor}
        textContentType="newPassword"
      />
      <ConcealCaptcha onCaptchaChange={onCaptchaChange} />

      <View style={styles.footer}>
        <ConcealButton
          onPress={() => {
            signUpUser({ userName, email, password, id: 'signUpForm' });
            hidePanel();
          }}
          text="Sign Up"
          accessibilityLabel="Sign Up Button"
          disabled={formSubmitted || !formValid}
          style={[styles.footerBtn, styles.footerBtnLeft]}
          loading={formSubmitted}
          loadingStyle={AppStyles.submitButtonLoading}
          loadingProps={{ color: AppColors.concealOrange }}
        />
        <ConcealButton
          onPress={() => hidePanel()}
          text="Cancel"
          disabled={formSubmitted}
          style={[styles.footerBtn, styles.footerBtnRight]}
          accessibilityLabel="Cancel Button"
        />
      </View>
    </ScrollView>
  )
};

const styles = EStyleSheet.create({
  footer: {
    flex: 1,
    marginTop: 15,
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

export default SignUp;