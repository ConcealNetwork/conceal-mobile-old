import React from 'react';
import { Overlay } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import localStorage from '../helpers/LocalStorage';
import { AppColors } from '../constants/Colors';
import { View } from 'react-native';
import PassCheck from './PassCheck';
import FgpCheck from './FgpCheck';
import PinCheck from './PinCheck';

function getAuthMethod() {
  return localStorage.get('auth_method') || "password";
}

const AuthCheck = props => {
  const { onSuccess, onCancel, showCheck } = props;

  return (
    <View style={styles.AuthWrapper}>
      <Overlay
        isVisible={showCheck && getAuthMethod() == "biometric"}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <FgpCheck
            onComplete={(result) => {
              if (result.success) {
                onSuccess(localStorage.get('lock_password'));
              }
            }}
            onCancel={() => onCancel()}
          />
        </View>
      </Overlay>
      <Overlay
        isVisible={showCheck && getAuthMethod() == "pin"}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <PinCheck
            onComplete={(result) => {
              if (result.success) {
                onSuccess(localStorage.get('lock_password'));
              }
            }}
            onCancel={() => onCancel()}
          />
        </View>
      </Overlay>
      <Overlay
        isVisible={showCheck && getAuthMethod() == "password"}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <PassCheck
            onComplete={(result) => onSuccess(result.password)}
            onCancel={() => onCancel()}
          />
        </View>
      </Overlay>
    </View>
  )
};

const styles = EStyleSheet.create({
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  }
});

export default AuthCheck;
