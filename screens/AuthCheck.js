import React from 'react';
import { View } from 'react-native';
import { Overlay } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppColors } from '../constants/Colors';
import localStorage from '../helpers/LocalStorage';
import FgpCheck from './FgpCheck';
import PassCheck from './PassCheck';
import PinCheck from './PinCheck';

function getAuthMethod() {
  //return localStorage.get('auth_method') || 'password';
  // dissabled alternative methods for now
  return 'password';
}

const AuthCheck = props => {
  const { onSuccess, onCancel, showCheck } = props;

  return (
    <View style={styles.AuthWrapper}>
      <Overlay
        isVisible={showCheck && getAuthMethod() === 'biometric'}
        overlayBackgroundColor={AppColors.concealBackground}
        fullScreen={true}
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
        isVisible={showCheck && getAuthMethod() === 'pin'}
        overlayBackgroundColor={AppColors.concealBackground}
        fullScreen={true}
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
        isVisible={showCheck && getAuthMethod() === 'password'}
        overlayBackgroundColor={AppColors.concealBackground}
        fullScreen={true}
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
    backgroundColor: AppColors.concealBackground,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  }
});

export default AuthCheck;
