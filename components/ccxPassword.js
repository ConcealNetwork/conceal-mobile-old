import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import localStorage from '../helpers/LocalStorage';
import ConcealPinView from '../components/ccxPinView';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import { Input, Icon, Overlay } from 'react-native-elements';
import React, { useContext, useState, useEffect } from "react";
import * as LocalAuthentication from 'expo-local-authentication';
import { getAspectRatio, showMessageDialog } from '../helpers/utils';
import { Text, View, } from "react-native";


export default function ConcealTextInput({ bindPassword, setValue, showAlternative }) {

  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;

  const [showPinModal, setShowPinModal] = useState(false);
  const [showFgpModal, setShowFgpModal] = useState(false);
  const [isScanning, setIsScanning] = useState(0);

  toogleSecurePassword = () => {
    setAppData({
      sendScreen: {
        securePasswordEntry: !state.appData.sendScreen.securePasswordEntry
      }
    });
  }

  getPlaceholderText = () => {
    if (!showAlternative) {
      return 'please enter your password...';
    } else {
      if (localStorage.get('auth_method') == "pin") {
        return 'please press to enter your PIN...';
      } else if (localStorage.get('auth_method') == "biometric") {
        return 'please press to validate fingerprint...';
      } else {
        return 'please enter your password...';
      }
    }
  }

  if (showFgpModal && (isScanning == 0)) {
    setIsScanning(1);

    LocalAuthentication.authenticateAsync().then(result => {
      setShowFgpModal(false);
      setIsScanning(2);

      if (result.success) {
        setValue(localStorage.get('lock_password'));
      } else {
        showMessageDialog('Failed to validate fingerprint, please try again', 'error');
      }
    });
  }

  return (
    <View>
      <Input
        {...bindPassword}
        placeholder={getPlaceholderText()}
        inputStyle={styles.password}
        containerStyle={styles.sendInput}
        textContentType="password"
        secureTextEntry={state.appData.sendScreen.securePasswordEntry}
        onFocus={() => {
          if (showAlternative && (localStorage.get('auth_method') == "pin")) {
            setShowPinModal(true);
          } else if (showAlternative && (localStorage.get('auth_method') == "biometric")) {
            setShowFgpModal(true);
          }
        }}
        rightIcon={
          <Icon
            onPress={() => this.toogleSecurePassword()}
            name='ios-eye-off'
            type='ionicon'
            color='white'
            size={32 * getAspectRatio()}
          />
        }
      />
      <Overlay
        isVisible={showPinModal}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <ConcealPinView
            onComplete={(pin) => {
              setShowPinModal(false);
              if (localStorage.get('lock_pin') == pin) {
                setValue(localStorage.get('lock_password'));
              } else {
                showMessageDialog('Wrong PIN, please try again', 'error');
              }
            }}
            onCancel={() => setShowPinModal(false)}
          />
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn]}
              onPress={() => setShowPinModal(false)}
              text="CLOSE"
            />
          </View>
        </View>
      </Overlay>
      <Overlay
        isVisible={showFgpModal}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <View style={styles.fgpIconWrapper}>
            <Text style={styles.fgpStatus}>Please use the fingerprint...</Text>
            <Icon
              name='ios-finger-print'
              type='ionicon'
              color='white'
              size={128 * getAspectRatio()}
            />
          </View>
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn]}
              onPress={() => setShowFgpModal(false)}
              text="CLOSE"
            />
          </View>
        </View>
      </Overlay>
    </View>
  );
}

const styles = EStyleSheet.create({
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    paddingTop: '50rem'
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
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
  },
  password: {
    color: "#FFFFFF",
    fontSize: '18rem'
  },
  fgpStatus: {
    color: AppColors.concealTextColor,
    fontSize: '18rem'
  },
  footer: {
    bottom: '10rem',
    left: '20rem',
    right: '20rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1
  }
})