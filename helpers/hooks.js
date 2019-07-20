import { useEffect, useState } from 'react';
import { Clipboard } from 'react-native';


export const useFormInput = init => {
  const [value, setValue] = useState(init);
  const onChangeText = val => setValue(val);
  const reset = () => setValue('');
  return { bind: { value, onChangeText }, reset, setValue, value };
};

export const useFormValidation = init => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) });
  return formValid;
};

export const useClipboard = () => {
  const [contents, setContents] = useState('');

  const getClipboardContents = async () => {
    const content = await Clipboard.getString();
    setContents(content);
  };

  useEffect(() => {
    getClipboardContents();
  }, []);

  const setClipboardContents = (content) => {
    Clipboard.setString(content);
    setContents(content);
  };

  return [contents, setClipboardContents];
};
