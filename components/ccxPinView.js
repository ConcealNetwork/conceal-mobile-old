import React, { useRef } from 'react';
import PinView from 'react-native-pin-view';
import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getAspectRatio } from '../helpers/utils';
import { View } from "react-native";

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