import React, { useContext } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Image } from 'react-native-elements';
import ConcealButton from '../components/ccxButton';
import ConcealCaptcha from '../components/hCaptcha';

import { AuthContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import { getAspectRatio } from '../helpers/utils';


const ResetPassword = props => {
  const { authActions, state } = useContext(AuthContext);
  const { layout } = state;
  const { formSubmitted, message } = layout;
  const { resetPassword } = authActions;
  const { hidePanel } = props;

  // captcha related fields and hooks
  const [hCode, setHCode] = React.useState("");

  const { value: email, bind: bindEmail } = useFormInput(global.username);

  const formValidation = (
    hCode !== '' && email !== '' && /\S+@\S+\.\S+/.test(email)
  );
  const formValid = useFormValidation(formValidation);

  const onCaptchaChange = (code) => {
    setHCode(code);
  };

  return (
    <View style={[AppStyles.viewContainer]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={AppStyles.loginView}>
          <Image
            source={require('../assets/images/icon.png')}
            style={{ width: 150 * getAspectRatio(), height: 150 * getAspectRatio() }}
          />
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
          <ConcealCaptcha onCaptchaChange={onCaptchaChange} />

          <View style={styles.footer}>
            <ConcealButton
              onPress={() => {
                resetPassword({ email, id: 'resetPasswordForm' });
                hidePanel();
              }}
              text='Send E-mail'
              accessibilityLabel="Send E-mail Button"
              disabled={formSubmitted || !formValid}
              style={[styles.footerBtn, styles.footerBtnLeft]}
            />

            <ConcealButton
              onPress={() => hidePanel()}
              text="Cancel"
              style={[styles.footerBtn, styles.footerBtnRight]}
              accessibilityLabel="Cancel Button"
              disabled={formSubmitted}
            />
          </View>
        </ScrollView>
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

export default ResetPassword;
