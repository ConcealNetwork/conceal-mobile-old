import { Icon } from 'react-native-elements';
import React, { useState, useRef, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import localStorage from '../helpers/LocalStorage';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import { View, Text } from 'react-native';

const FgpCheck = props => {
  const { onComplete, onCancel } = props;

  // our hook into the state of the function component for the authentication mode
  const [isScanning, setIsScanning] = useState(0);
  const [fgpValue, setfgpValue] = useState(false);
  const isMountedRef = useRef(null);

  const startBiometricAuth = (mounted) => {
    if ((isScanning == 0) && (isMountedRef.current)) {
      setIsScanning(1);

      LocalAuthentication.authenticateAsync().then(result => {
        if (isMountedRef.current) {
          setfgpValue(result.success);

          if (!result.success) {
            setIsScanning(0);

            setTimeout(() => {
              if (isMountedRef.current) {
                setIsScanning(1);
                startBiometricAuth();
              }
            }, 3000);
          }

          // signal back success or failure
          onComplete({ success: result.success });
        }
      });
    }
  }

  this.getFgpStatusText = () => {
    if (isScanning == 1) {
      return "Please use the fingerprint...";
    } else {
      if (fgpValue) {
        return "Fingerprint SUCCESS";
      } else {
        return "Fingerprint FAILED! Please try again";
      }
    }
  }

  this.getFgpStyle = () => {
    if (isScanning == 1) {
      return { color: AppColors.concealTextColor };
    } else {
      if (fgpValue) {
        return { color: AppColors.concealTextColor };
      } else {
        return { color: AppColors.concealErrorColor };
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true;

    if (isMountedRef.current) {
      setIsScanning(0);
      startBiometricAuth();
    }

    return () => {
      LocalAuthentication.cancelAuthenticate();
      isMountedRef.current = false;
    }
  }, []);

  return (
    <View style={styles.fgpWrapper}>
      <Text style={styles.hello}>Hello,</Text>
      <Text style={styles.email}>{localStorage.get('id_username')}</Text>

      <View style={styles.fgpIconWrapper}>
        <Text style={[styles.fgpStatus, this.getFgpStyle()]}>{this.getFgpStatusText()}</Text>
        <Icon
          name='ios-finger-print'
          type='ionicon'
          color={fgpValue ? 'orange' : 'white'}
          size={128 * getAspectRatio()}
        />
      </View>
      <View style={styles.footer}>
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
    fontSize: '18rem',
    marginBottom: '15rem'
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

export default FgpCheck;
