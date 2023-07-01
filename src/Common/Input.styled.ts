import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
`;

export const StyledInput = styled.input`
  height: 20px;
  padding: 4px 8px;
  padding-right: 30px; /* Space for the search icon */
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const IconWrapper = styled.div`
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