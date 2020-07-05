import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import localStorage from '../helpers/LocalStorage';
import ConcealPinView from '../components/ccxPinView';
import ConcealButton from '../components/ccxButton';
import { Icon, Overlay } from 'react-native-elements';
import React, { useState } from "react";
import * as LocalAuthentication from 'expo-local-authentication';
import { getAspectRatio, showMessageDialog } from '../helpers/utils';
import { Text, View, } from "react-native";


export default function ConcealTextInput({ onAuthenticate }) {

  const [showPinModal, setShowPinModal] = useState(false);
  const [showFgpModal, setShowFgpModal] = useState(false);
  const [isScanning, setIsScanning] = useState(0);

  if (showFgpModal && (isScanning == 0)) {
    setIsScanning(1);

    LocalAuthentication.authenticateAsync().then(result => {
      setShowFgpModal(false);
      setIsScanning(0);

      if (result.success) {
        setValue(localStorage.get('lock_password'));
      } else {
        showMessageDialog('Failed to validate fingerprint, please try again', 'error');
      }
    });
  }

  return (
    <View style={styles.PassWrapper}>
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
            <Icon
              name='ios-finger-print'
              type='ionicon'
              color='white'
              size={164 * getAspectRatio()}
            />
            <Text style={styles.fgpStatus}>Use your fingerprint to authenticate</Text>
          </View>
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnLeft]}
              onPress={() => setShowFgpModal(false)}
              text="PASSWORD"
            />
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnRight]}
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
  PassWrapper: {
    width: '100%'
  },
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
  PassInputContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'rgb(55, 55, 55)'
  },
  PassContainer: {
    width: '100%',
    height: '40rem',
    marginTop: '5rem',
    borderWidth: 0,
    marginBottom: '5rem'
  },
  PassInput: {
    color: "#FFFFFF",
    fontSize: '18rem'
  },
  fgpStatus: {
    color: AppColors.concealTextColor,
    marginTop: '15rem',
    fontSize: '16rem'
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
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  }
})