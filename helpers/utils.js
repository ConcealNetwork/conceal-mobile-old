import * as LocalAuthentication from 'expo-local-authentication';
import { Dimensions, Share } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { showMessage } from 'react-native-flash-message';
import { appSettings } from '../constants/appSettings';

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
      if ((msgType || 'error') === 'error') {
        showErrorMessage(toastMessage);
      } else if (msgType === 'info') {
        showSuccessMessage(toastMessage);
      }
    }
  }
}

export const showErrorMessage = (message) => {
  showMessage({
    duration: 5000,
    message: 'Error',
    description: message,
    type: 'danger',
    titleStyle: styles.errorText,
  });
};

export const showSuccessMessage = (message) => {
  showMessage({
    duration: 5000,
    message: 'Success',
    description: message,
    type: 'success',
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

export const hasBiometricCapabilites = () => {
  return new Promise((resolve, reject) => {
    (async () => {
      resolve(await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync());
    })().catch(err => {
      resolve(false);
    });
  });
}

export const InterestRates = [
  [0.24, 0.33, 0.41],
  [0.50, 0.67, 0.83],
  [0.78, 1.03, 1.28],
  [1.07, 1.40, 1.73],
  [1.38, 1.79, 2.21],
  [1.70, 2.20, 4.70],
  [2.04, 2.63, 3.21],
  [2.40, 3.07, 3.73],
  [2.78, 3.53, 4.28],
  [3.17, 4.00, 4.83],
  [3.58, 4.49, 5.41],
  [4.00, 5.00, 6.00],
];

export const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces);
  return Math.round(number * factorOfTen) / factorOfTen;
}

export const parseLocaleNumber = (stringNumber, truncate) => {
  if (stringNumber) {
    let decimalSeparator = (1.1).toLocaleString().replace(/1/g, '');
    let thousandSeparator = (1111).toLocaleString().replace(/1/g, '');
    let parsedNumber = parseFloat(stringNumber.replace(new RegExp('\\' + thousandSeparator, 'g'), '').replace(new RegExp('\\' + decimalSeparator), '.'));

    if (truncate) {
      return Math.floor(parsedNumber);
    } else {
      return parsedNumber;
    }
  } else {
    return 0;
  }
}

export const getDepositInterest = (amount, duration) => {
  // return the correct interest rate percent from the 2D table
  return InterestRates[duration - 1][Math.min(Math.floor(amount / 10000), 2)] * amount / 100;
}

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
