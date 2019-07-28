import { useEffect, useState } from 'react';


export const useFormInput = (init) => {
  const [value, setValue] = useState(init);
  const onChangeText = val => setValue(val);
  const reset = () => setValue('');
  return { bind: { value, onChangeText }, reset, setValue, value };
};

export const useCheckbox = (init) => {
  const [checked, setValue] = useState(init);
  const onPress = val => { setValue(!checked) };
  const reset = () => setValue(false);
  return { bind: { checked, onPress }, reset, setValue, checked };
};

export const useFormValidation = (init) => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) });
  return formValid;
};
