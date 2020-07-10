import React, { useState } from 'react';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealPassword from '../components/ccxPassword';
import ConcealPinView from '../components/ccxPinView';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import { View } from 'react-native';


const PinSetup = props => {
  const { onSave, onCancel } = props;

  // our hook into the state of the function component for the authentication mode
  const { value: password, bind: bindPassword, setValue: setPassword } = useFormInput('');
  const [pinValue, setPinValue] = useState('');

  const formValidation = (
    (password != '') && (pinValue != '')
  );
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.pinWrapper}>
      <View style={styles.passCompWrapper}>
        <ConcealPassword
          bindPassword={bindPassword}
          setValue={setPassword}
        />
      </View>
      <View style={styles.pinCompWrapper}>
        <ConcealPinView
          onComplete={(val, clear) => { setPinValue(val) }}
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!formValid}
          onPress={() => {
            onSave({ pinData: pinValue, passData: password });
          }}
          text="SAVE"
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
  pinWrapper: {
    flex: 1,
    paddingTop: '10rem'
  },
  pinCompWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '70rem'
  },
  passCompWrapper: {
    margin: '10rem'
  },
  passwordInput: {
    marginTop: '30rem',
    marginBottom: '50rem'
  },
  passwordText: {
    color: "#FFFFFF",
    fontSize: '18rem'
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

export default PinSetup;
