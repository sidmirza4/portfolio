import styled from 'styled-components';
import { bool, func } from 'prop-types';
import Side from '../Side';
import Image from 'next/image';

const CircularButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 70px;
  height: 70px;
  background-color: ${(props) => props.theme.brand.primary};
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  }
`;

const AssistantIcon = styled.svg`
  width: 28px;
  height: 28px;
  fill: black;
`;

const OnlineDot = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${(props) => props.theme.brand.accent};
  border-radius: 100%;
  border: ${(props) => `1px solid ${props.theme.brand.border}`};
  position: absolute;
  top: 6px;
  right: 2px;
`;

const FloatingButton = ({ isHome, onClick }) => {
  return (
    <Side isHome={isHome} orientation="right">
      <CircularButton onClick={onClick}>
        <Image src="/avatar.png" height={60} width={50} />
        <OnlineDot />
      </CircularButton>
    </Side>
  );
};

FloatingButton.propTypes = {
  isHome: bool,
  onClick: func,
};

export default FloatingButton;
