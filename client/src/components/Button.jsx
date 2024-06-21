import React from "react";
import styled from "styled-components";

const StyledBtn = ({ children, className, onClick }) => (
  <Button className={className} onClick={onClick}>
    {children}
  </Button>
);

const TextStyledButton = ({ className, onClick, children, size }) => (
  <TextButton className={className} onClick={onClick} size={size}>
    {children}
  </TextButton>
);

const Button = styled.button`
  border: none;
  display: inline-block;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.8s;
  background-color: #459cff;
  color: #fff;
  transform: translateY(1px);
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const TextButton = styled(Button)`
  margin: 0;
  padding: 0 10px;
  border: none;
  background: none;
  color: black;
  font-size: ${(props) => props.size || "15px"};

  &:hover {
    color: #0056b3;
    background: none;
  }
`;

export { StyledBtn, TextStyledButton };
