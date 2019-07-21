import { appSettings } from '../constants/appSettings';
import { AppColors } from '../constants/Colors';
import Toast from 'react-native-root-toast';
import { Share } from "react-native";

export const shareContent = async (content) => {
  try {
    const result = await Share.share({ message: content });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    showErrorToast(error.message);
  }
}

export const maskAddress = (address, maskingChar = '.', maskedChars = 8, charsPre = 7, charsPost = 7) => {
  if (address) {
    const pre = address.substring(0, charsPre);
    const post = address.substring(address.length - charsPost);
    return `${pre}${maskingChar.repeat(maskedChars)}${post}`;
  } else {
    return '';
  }
};

export const showMessage = (message, msgType) => {
  let toastMessage;

  if (message) {
    if (Array.isArray(message)) {
      toastMessage = message.join();
    } else {
      toastMessage = message;
    }

    if (toastMessage !== '') {
      if ((msgType || "error") === "error") {
        showErrorToast(toastMessage);
      } else if (msgType === "info") {
        showSuccessToast(toastMessage);
      }
    }
  }
}

export const showErrorToast = (message) => {
  let toast = Toast.show(message, {
    backgroundColor: AppColors.concealErrorColor,
    duration: Toast.durations.LONG,
    opacity: 1,
    position: 0,
    animation: true,
    hideOnPress: true,
    shadow: true,
    delay: 100
  });
};

export const showSuccessToast = (message) => {
  let toast = Toast.show(message, {
    backgroundColor: AppColors.concealInfoColor,
    duration: Toast.durations.SHORT,
    opacity: 1,
    position: 0,
    animation: true,
    hideOnPress: true,
    shadow: true,
    delay: 100
  });
};

export const format0Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
export const format2Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 2 };
export const format4Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 4 };
export const format6Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 6 };
export const format8Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 8 };

export const formatOptions = {
  minimumFractionDigits: appSettings.coinDecimals,
  maximumFractionDigits: appSettings.coinDecimals,
};
