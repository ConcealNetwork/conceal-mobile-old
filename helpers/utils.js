import { Share, Dimensions } from "react-native";
import { appSettings } from '../constants/appSettings';
import { AppColors } from '../constants/Colors';
import { showMessage, hideMessage } from "react-native-flash-message";
import EStyleSheet from 'react-native-extended-stylesheet';

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
    showErrorMessage(error.message);
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

export const showMessageDialog = (message, msgType) => {
  let toastMessage;

  if (message) {
    if (Array.isArray(message)) {
      toastMessage = message.join();
    } else {
      toastMessage = message;
    }

    if (toastMessage !== '') {
      if ((msgType || "error") === "error") {
        showErrorMessage(toastMessage);
      } else if (msgType === "info") {
        showSuccessMessage(toastMessage);
      }
    }
  }
}

export const showErrorMessage = (message) => {
  showMessage({
    duration: 3000,
    message: message,
    type: "danger",
    titleStyle: styles.errorText,
  });
};

export const showSuccessMessage = (message) => {
  showMessage({
    duration: 3000,
    message: message,
    type: "success",
    titleStyle: styles.errorText,
  });
};

const styles = EStyleSheet.create({
  successText: {
    color: "#FFFFFF",
    fontSize: '18rem',
    paddingTop: '10rem'
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: '18rem',
    paddingTop: '10rem'
  }
});


export const getAspectRatio = () => {
  return Dimensions.get('window').width / 360;
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
