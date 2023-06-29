import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { useDebounce, useDebouncedCallback } from "use-debounce";

type IInput = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputType?: string;
  className?: string;
  debounceDelay?: number;
  defaultValue?: string;
};

const Input = ({
  value,
  defaultValue,
  onChange = () => null,
  placeholder = "",
  inputType = "text",
  className = "",
  debounceDelay = 0,
}: IInput) => {
  const [inputValue, setInputValue] = useState<string | undefined>(value);

  // Debounce the onChange event
  const [debouncedValue] = useDebounce(inputValue, debounceDelay);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  useEffect(() => {
    onChange(debouncedValue ?? "");
  }, [debouncedValue]);

  return (
    <StyledInput
      type={inputType}
      defaultValue={defaultValue}
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default Input;

const StyledInput = styled.input`
  height: 20px;
  padding: 4px 8px ;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
