import React, { useContext } from "react";
import { Icon } from 'react-native-elements';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealPassword from '../components/ccxPassword';
import ConcealButton from '../components/ccxButton';
import localStorage from '../helpers/LocalStorage';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import { View, Text } from 'react-native';


const PassCheck = props => {
  const { onComplete, onCancel } = props;

  const { state } = useContext(AppContext);
  const { userSettings } = state;

  // hook for password edit field
  const { value: password, bind: bindPassword, setValue: setPassword } = useFormInput('');

  const formValidation = (password !== '' && password.length >= userSettings.minimumPasswordLength);
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.passWrapper}>
      <Text style={styles.hello}>Hello,</Text>
      <Text style={styles.email}>{localStorage.get('id_username')}</Text>

      <View style={styles.passInnerWrapper}>
        <View style={styles.passFieldWrapper}>
          <ConcealPassword
            showAlternative={false}
            bindPassword={bindPassword}
            setValue={setPassword}
          />
        </View>
        <View style={styles.passIconWrapper}>
          <Icon
            name='md-lock'
            type='ionicon'
            color={'white'}
            style={styles.lockIcon}
            size={164 * getAspectRatio()}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!formValid}
          onPress={() => onComplete({ success: true, password: password })}
          text="OK"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => onCancel()}
          text="CANCEL"
        />
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  passWrapper: {
    flex: 1,
    paddingTop: '10rem'
  },
  passInnerWrapper: {
    flex: 1,
    margin: '10rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  passFieldWrapper: {
    width: '100%',
    marginBottom: '20rem'
  },
  lockIcon: {
    marginTop: '20rem'
  },
  hello: {
    fontSize: '22rem',
    textAlign: 'center',
    color: AppColors.concealTextColor,
  },
  email: {
    fontSize: '16rem',
    textAlign: 'center',
    color: AppColors.concealTextColor,
  },
  footer: {
    bottom: '0rem',
    left: '20rem',
    right: '20rem',
    padding: '10rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: AppColors.concealBackground
  },
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  }
});

export default PassCheck;
