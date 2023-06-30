import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useDebounce } from "use-debounce";
import { IoIosSearch } from "react-icons/io";

type IInput = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputType?: string;
  className?: string;
  debounceDelay?: number;
  defaultValue?: string;
  isSearch?: boolean;
};

const Input = ({
  value,
  defaultValue,
  onChange = () => null,
  placeholder = "",
  inputType = "text",
  className = "",
  debounceDelay = 0,
  isSearch = false
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
  }, [debouncedValue]);

  return (
    <InputWrapper className={className}>
      <StyledInput
        type={inputType}
        defaultValue={defaultValue}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {isSearch ? <SearchIconWrapper>
        <IoIosSearch />
      </SearchIconWrapper> : null }
    </InputWrapper>
  );
};

export default Input;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  height: 20px;
  padding: 4px 8px;
  padding-right: 30px; /* Space for the search icon */
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #ccc;
`;
