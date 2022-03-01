import { Ionicons } from '@expo/vector-icons';
import ConfirmHcaptcha from '@hcaptcha/react-native-hcaptcha';
import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import Config from '../config.json';
import { AppColors } from '../constants/Colors';
import { getAspectRatio } from '../helpers/utils';

export default function ConcealCaptcha({ onCaptchaChange }) {
  // captcha related fields and hooks
  const [captchaVisible, setCaptchaVisible] = React.useState(false);
  const [hCodeValid, setHCodeValid] = React.useState(false);
  const hCaptcha = useRef(null);

  const onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel'].includes(event.nativeEvent.data)) {
        // do not call hCaptcha.hide(); function in this condition. Otherwise app will crash.
        console.log('Captcha was canceled');
        if (captchaVisible) {
          setTimeout(() => {
            setCaptchaVisible(false);
            hCaptcha.current.hide();
          }, 500);
        }
        return;
      } else if (['error', 'expired'].includes(event.nativeEvent.data)) {
        console.log('Captcha errored or expired', event.nativeEvent.data);
        hCaptcha.current.hide();
        setHCodeValid(false);
        return;
      } else {
        console.log('Verified code from hCaptcha', event.nativeEvent.data);
        onCaptchaChange(event.nativeEvent.data);
        setHCodeValid(true);
        setTimeout(() => {
          setCaptchaVisible(false);
          hCaptcha.current.hide();
        }, 500);
      }
    }
  };

  return (
    <View style={styles.captchaRoot}>
      <ConfirmHcaptcha
        ref={hCaptcha}
        siteKey={Config.hCaptcha.key}
        baseUrl={Config.hCaptcha.url}
        languageCode="en"
        showLoading={true}
        onMessage={onMessage}
      />
      <TouchableOpacity
        style={styles.captchaWrapper}
        onPress={() => {
          setCaptchaVisible(true);
          onCaptchaChange("");

          // show the captcha
          hCaptcha.current.show();
        }}>
        <View style={styles.hCodeCheckmark}>
          {hCodeValid && <Ionicons name="checkmark" size={36} color="orange" />}
        </View>
        <Text style={styles.hCaptchaText}>I am human</Text>
        <Image
          source={require('../assets/images/hcaptcha.png')}
          style={{ width: 40 * getAspectRatio(), height: 40 * getAspectRatio() }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = EStyleSheet.create({
  captchaRoot: {
    width: "100%",
    height: "60rem",
    marginTop: "10rem",
    marginBottom: "5rem",
  },
  captchaWrapper: {
    width: "100%",
    height: "60rem",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  hCaptchaText: {
    color: "orange",
    fontSize: "18rem",
    marginLeft: "10rem",
    marginRight: "10rem"
  },
  hCodeCheckmark: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: AppColors.concealBorderColor
  }
})
