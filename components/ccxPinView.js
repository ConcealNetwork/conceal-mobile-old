import React, { useRef } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PinView from 'react-native-pin-view';
import { AppColors } from '../constants/Colors';
import { getAspectRatio } from '../helpers/utils';

export default function ConcealPinView({ onComplete }) {
  const pinView = useRef(null);

  return (
    <View style={styles.pinWrapper}>
      <PinView
        ref={pinView}
        inputBgColor={"#FFF"}
        inputBgOpacity={0.5}
        buttonSize={50 * getAspectRatio()}
        inputActiveBgColor={AppColors.concealOrange}
        buttonTextColor={AppColors.concealTextColor}
        buttonBgColor={AppColors.concealOrange}
        onComplete={onComplete || null}
        pinLength={6}
      />
    </View>
  );
}

const styles = EStyleSheet.create({

})
