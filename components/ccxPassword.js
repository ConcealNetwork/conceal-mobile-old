import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Input, Icon } from 'react-native-elements';
import React, { useState } from "react";
import { getAspectRatio } from '../helpers/utils';
import { View, } from "react-native";


export default function ConcealTextInput({ bindPassword, setValue, showAlternative }) {

  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.PassWrapper}>
      <Input
        {...bindPassword}
        placeholder={'please enter your password...'}
        inputStyle={styles.PassInput}
        containerStyle={styles.PassContainer}
        inputContainerStyle={styles.PassInputContainer}
        textContentType="password"
        secureTextEntry={isSecure}
        rightIcon={
          <Icon
            onPress={() => setIsSecure(!isSecure)}
            name='ios-eye-off'
            type='ionicon'
            color='white'
            size={32 * getAspectRatio()}
          />
        }
      />
    </View>
  );
}

const styles = EStyleSheet.create({
  PassWrapper: {
    width: '100%'
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