import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import localStorage from '../helpers/LocalStorage';
import ConcealPinView from '../components/ccxPinView';
import { AppContext } from '../components/ContextProvider';
import { Input, Icon, Overlay } from 'react-native-elements';
import React, { useContext, useState, useEffect } from "react";
import { getAspectRatio, showMessageDialog } from '../helpers/utils';
import { Text, View, } from "react-native";


export default function ConcealTextInput({ bindPassword, setValue }) {

  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;

  const [showPinModal, setShowPinModal] = useState(false);

  toogleSecurePassword = () => {
    setAppData({
      sendScreen: {
        securePasswordEntry: !state.appData.sendScreen.securePasswordEntry
      }
    });
  }

  return (
    <View>
      <Input
        {...bindPassword}
        placeholder='please enter your password...'
        inputStyle={styles.password}
        containerStyle={styles.sendInput}
        textContentType="password"
        secureTextEntry={state.appData.sendScreen.securePasswordEntry}
        onFocus={() => {
          console.log(localStorage.get('auth_method'));
          if (localStorage.get('auth_method') == "pin") {
            setShowPinModal(true);
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
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
  },
  password: {
    color: "#FFFFFF",
    fontSize: '18rem'
  }
})