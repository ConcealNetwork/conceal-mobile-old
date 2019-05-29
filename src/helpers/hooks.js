import { useState, useEffect } from 'react';


export const useFormInput = (init) => {
  const [value, setValue] = useState(init);
  const onChange = e => setValue(e.target.value);
  return { value, onChange };
};

export const useFormValidation = (init) => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) });
  return formValid;
};
