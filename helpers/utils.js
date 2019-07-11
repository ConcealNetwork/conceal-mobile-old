import { appSettings } from '../constants/appSettings';

export const maskAddress = (address, maskingChar = '.', maskedChars = 8, charsPre = 7, charsPost = 7) => {
  const pre = address.substring(0, charsPre);
  const post = address.substring(address.length - charsPost);
  return `${pre}${maskingChar.repeat(maskedChars)}${post}`;
};

export const format0Decimals = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
export const format2Decimals = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
export const format4Decimals = { minimumFractionDigits: 4, maximumFractionDigits: 4 };
export const format8Decimals = { minimumFractionDigits: 8, maximumFractionDigits: 8 };

export const formatOptions = {
  minimumFractionDigits: appSettings.coinDecimals,
  maximumFractionDigits: appSettings.coinDecimals,
};