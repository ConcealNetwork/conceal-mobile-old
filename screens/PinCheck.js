import React, { useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealPinView from '../components/ccxPinView';
import ConcealButton from '../components/ccxButton';
import localStorage from '../helpers/LocalStorage';
import { AppColors } from '../constants/Colors';
import { View, Text } from 'react-native';


const PinCheck = props => {
  const { onComplete, onCancel } = props;
  const [success, setSuccess] = useState(0);

  this.getPinStatusText = () => {
    if (success == 0) {
      return "Please enter your PIN...";
    } else if (success == 1) {
      return "Corrent PIN was entered.";
    } else if (success == 2) {
      return "Wrong PIN. Please try again.";
    }
  }

  this.getPinStyle = () => {
    if (success == 0) {
      return { color: AppColors.concealTextColor };
    } else if (success == 1) {
      return { color: AppColors.concealTextColor };
    } else if (success == 2) {
      return { color: AppColors.concealErrorColor };
    }
  }


  return (
    <View style={styles.pinWrapper}>
      <Text style={styles.hello}>Hello,</Text>
      <Text style={styles.email}>{localStorage.get('id_username')}</Text>
      <Text style={[styles.pinStatus, this.getPinStyle()]}>{this.getPinStatusText()}</Text>

      <View style={styles.pinCompWrapper}>
        <ConcealPinView
          onComplete={(val, clear) => {
            if (localStorage.get('lock_pin') !== val) {
              clear();
              setSuccess(2);
              onComplete({ success: false });

              setTimeout(() => {
                setSuccess(0);
              }, 3000);
            } else {
              setSuccess(1);
              onComplete({ success: true });
            }
          }}
        />
      </View>
      <View style={styles.footer}>
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
    flex: 1
  },
  hello: {
    fontSize: '22rem',
    textAlign: 'center',
    color: AppColors.concealTextColor
  },
  email: {
    fontSize: '16rem',
    textAlign: 'center',
    color: AppColors.concealTextColor
  },
  pinStatus: {
    fontSize: '16rem',
    textAlign: 'center',
    marginTop: '20rem',
    marginLeft: '10rem',
    marginRight: '10rem',
    padding: '10rem',
    borderWidth: 1,
    borderColor: AppColors.concealOrange,
  },
  pinCompWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '70rem'
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

export default PinCheck;
