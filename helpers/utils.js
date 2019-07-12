import { appSettings } from '../constants/appSettings';
import { AppColors } from '../constants/Colors';
import Toast from 'react-native-root-toast';

export const maskAddress = (address, maskingChar = '.', maskedChars = 8, charsPre = 7, charsPost = 7) => {
  if (address) {
    const pre = address.substring(0, charsPre);
    const post = address.substring(address.length - charsPost);
    return `${pre}${maskingChar.repeat(maskedChars)}${post}`;
  } else {
    return '';
  }
};

export const showErrorToast = (message) => {
  let toast = Toast.show(message, {
    backgroundColor: AppColors.concealErrorColor,
    duration: Toast.durations.LONG,
    opacity: 1,
    position: 0,
    animation: true,
    hideOnPress: true,
    shadow: true,
    delay: 300
  });
};

export const showSuccessToast = (message) => {
  let toast = Toast.show(message, {
    backgroundColor: AppColors.concealInfoColor,
    duration: Toast.durations.LONG,
    opacity: 1,
    position: 0,
    animation: true,
    hideOnPress: true,
    shadow: true,
    delay: 300
  });
};

export const format0Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
export const format2Decimals = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
export const format4Decimals = { minimumFractionDigits: 4, maximumFractionDigits: 4 };
export const format8Decimals = { minimumFractionDigits: 8, maximumFractionDigits: 8 };

export const formatOptions = {
  minimumFractionDigits: appSettings.coinDecimals,
  maximumFractionDigits: appSettings.coinDecimals,
};
