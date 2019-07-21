import { useEffect, useState } from 'react';


export const useFormInput = (init) => {
  const [value, setValue] = useState(init);
  const onChangeText = val => setValue(val);
  const reset = () => setValue('');
  return { bind: { value, onChangeText }, reset, setValue, value };
};

export const useFormValidation = (init) => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) });
  return formValid;
};
