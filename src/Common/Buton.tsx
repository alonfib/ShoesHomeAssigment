import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

const StyledButton = styled.button`
  /* Add your button styles here */
  background-color: #3498db;
  color: #ffffff;
  padding: 4px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  /* Add hover styles */
  &:hover {
    background-color: #ccc;
  }

  /* Add disabled styles */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
