import React from 'react';
import PinView from 'react-native-pin-view';
import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function ConcealPinView({
  onComplete
}) {
  return (
    <PinView
      inputBgColor={"#FFF"}
      inputBgOpacity={0.5}
      inputActiveBgColor={AppColors.concealOrange}
      buttonTextColor={AppColors.concealTextColor}
      buttonBgColor={AppColors.concealOrange}
      onComplete={onComplete || null}
      pinLength={5}
    />
  );
}

const styles = EStyleSheet.create({

})