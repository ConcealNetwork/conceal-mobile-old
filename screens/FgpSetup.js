import { Input, Icon } from 'react-native-elements';
import React, { useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ConcealPassword from '../components/ccxPassword';
import ConcealButton from '../components/ccxButton';
import localStorage from '../helpers/LocalStorage';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import AppConf from '../app.json';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';


const FgpSetup = props => {
  const { actions, state } = useContext(AppContext);
  const { network, user, userSettings } = state;
  const { onSave, onCancel } = props;
  const { loginUser } = actions;

  // our hook into the state of the function component for the authentication mode
  const { value: password, bind: bindPassword, setValue: setPassword } = useFormInput('');
  const [isScanning, setIsScanning] = useState(0);
  const [fgpValue, setfgpValue] = useState(false);

  const formValidation = (
    (password != '') && (fgpValue)
  );
  const formValid = useFormValidation(formValidation);

  if (isScanning == 0) {
    setIsScanning(1);

    LocalAuthentication.authenticateAsync().then(result => {
      setfgpValue(result.success);
      setIsScanning(2);
    });
  }

  getFgpStatusText = () => {
    if (isScanning == 1) {
      return "Please use the fingerprint...";
    } else {
      if (fgpValue) {
        return "Fingerprint SUCCESS";
      } else {
        return "Fingerprint FAILED!";
      }
    }
  }

  return (
    <View style={styles.fgpWrapper}>
      <ConcealPassword
        showAlternative={false}
        bindPassword={bindPassword}
        setValue={setPassword}
      />
      <View style={styles.fgpIconWrapper}>
        <Text style={styles.fgpStatus}>{this.getFgpStatusText()}</Text>
        <Icon
          name='ios-finger-print'
          type='ionicon'
          color={fgpValue ? 'orange' : 'white'}
          size={128 * getAspectRatio()}
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!formValid}
          onPress={() => {
            onSave({ fgpData: true, passData: password });
          }}
          text="SAVE"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => {
            LocalAuthentication.cancelAuthenticate();
            setIsScanning(0);
            onCancel();
          }}
          text="CANCEL"
        />
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  fgpWrapper: {
    flex: 1,
    paddingTop: '10rem'
  },
  fgpIconWrapper: {
    top: '40rem',
    left: '0rem',
    right: '0rem',
    bottom: '60rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fgpStatus: {
    color: AppColors.concealTextColor,
    fontSize: '18rem'
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

export default FgpSetup;
