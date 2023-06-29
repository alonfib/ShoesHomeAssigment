import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { useDebounce, useDebouncedCallback } from "use-debounce";

type IInput = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputType?: string;
  className?: string;
  debounceDelay?: number;
  defaultValue?: string;
};

const Input = ({ 
  label, 
  value,
  defaultValue, 
  onChange = () => null, 
  placeholder = "", 
  inputType = "text",
  className = "",
  debounceDelay =  0
}: IInput) => {
  const [inputValue, setInputValue] = useState<string  | undefined >(value);

  // Debounce the onChange event
  const [debouncedValue] = useDebounce(inputValue , debounceDelay);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  useEffect(() => {
    onChange(debouncedValue ?? "" );
  }, [debouncedValue]);

  return (
    <InputWrapper className={className}>
      <label className="input-label">{label}</label>
      <input
        className="input-field"
        type={inputType}
        defaultValue={defaultValue}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default Input;

const InputWrapper = styled.div`
  margin-bottom: 10px;

  .input-label {
    display: block;
    margin-bottom: 5px;
  }

  .input-field {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
`;
