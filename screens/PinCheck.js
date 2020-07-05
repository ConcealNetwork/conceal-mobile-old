import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealPinView from '../components/ccxPinView';
import ConcealButton from '../components/ccxButton';
import localStorage from '../helpers/LocalStorage';
import { AppColors } from '../constants/Colors';
import { View } from 'react-native';


const PinCheck = props => {
  const { onComplete, onCancel } = props;

  return (
    <View style={styles.pinWrapper}>
      <View style={styles.pinCompWrapper}>
        <ConcealPinView
          onComplete={(val, clear) => {
            if (localStorage.get('lock_pin') !== val) {
              clear();
              onComplete({ success: false });
            } else {
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
