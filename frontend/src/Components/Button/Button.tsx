import React from 'react';
import type { ReactNode, MouseEventHandler } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  name: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  bg?: string;
  bPad?: string;
  color?: string;
  bRad?: string;
  iColor?: string; 
  hColor?: string;   
}

const Button: React.FC<ButtonProps> = ({
  name,
  icon,
  onClick,
  bg,
  bPad,
  color,
  bRad,
  iColor,
  hColor,
}) => {
  return (
    <ButtonStyled
      style={{
        background: bg,
        padding: bPad,
        borderRadius: bRad,
        color: color,
      }}
      onClick={onClick}
      hColor={hColor}
    >
      {icon && <span style={{ color: iColor ?? color }}>{icon}</span>}
      {name}
    </ButtonStyled>
  );
};

// styled-components nhận thêm prop hColor
const ButtonStyled = styled.button<{ hColor?: string }>`
  outline: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &:hover {
    color: ${(props) => props.hColor ?? props.color};
  }
`;

export default Button;
