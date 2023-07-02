import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { IoIosSearch } from "react-icons/io";
import { InputWrapper, StyledInput, IconWrapper } from "./Input.styled";

type IInput = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputType?: string;
  className?: string;
  debounceDelay?: number;
  defaultValue?: string;
  isSearch?: boolean;
  disabled?: boolean;
};

const Input = ({
  value,
  defaultValue,
  onChange = () => null,
  placeholder = "",
  inputType = "text",
  className = "",
  debounceDelay = 0,
  isSearch = false,
  disabled = false,
}: IInput) => {
  const [inputValue, setInputValue] = useState<string | undefined>(value);

  // Debounce the onChange event
  const [debouncedValue] = useDebounce(inputValue, debounceDelay);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  useEffect(() => {
    if (debouncedValue !== undefined) {
      onChange(debouncedValue);
    }
  }, [debouncedValue,onChange]);

  return (
    <InputWrapper className={className}>
      <StyledInput
        type={inputType}
        defaultValue={defaultValue}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {isSearch ? (
        <IconWrapper>
          <IoIosSearch />
        </IconWrapper>
      ) : null}
    </InputWrapper>
  );
};

export default Input;
