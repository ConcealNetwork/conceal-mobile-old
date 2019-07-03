export const maskAddress = (address, maskingChar='.', maskedChars=8, charsPre=7, charsPost=7) => {
  const pre = address.substring(0, charsPre);
  const post = address.substring(address.length - charsPost);
  return `${pre}${maskingChar.repeat(maskedChars)}${post}`;
};
