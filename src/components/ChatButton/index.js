import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { bool, func } from 'prop-types';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Side from '../Side';

const wiggle = keyframes`
  0% { transform: rotate(0deg); }
  5% { transform: rotate(-10deg); }
  10% { transform: rotate(10deg); }
  15% { transform: rotate(-6deg); }
  20% { transform: rotate(6deg); }
  25% { transform: rotate(-3deg); }
  30% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); } 
`;

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

  animation: ${wiggle} 3s ease-in-out infinite;
  animation-delay: 3s;
  animation-iteration-count: 3;
  animation-play-state: running;
`;

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  60% {
    opacity: 1;
    transform: scale(1.05) translateY(0);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const MessageBubble = styled.div`
  position: fixed;
  bottom: 120px;
  right: 40px;
  background: ${(props) => props.theme.brand.primary};
  color: ${(props) => props.theme.text.primary};
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  max-width: 256px;

  &.visible {
    animation: ${popIn} 0.5s ease forwards;
  }
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

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
  position: absolute;
  right: 6px;
  top: 6px;
`;

const FloatingButton = ({ isHome, onClick }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setShowMessage(false);
    onClick();
  };

  return (
    <Side isHome={isHome} orientation="right">
      <>
        <CircularButton onClick={handleClick}>
          <Image src="/avatar.png" height={60} width={50} />
          <OnlineDot />
        </CircularButton>
        {showMessage && (
          <MessageBubble className="visible">
            <CloseButton onClick={() => setShowMessage(false)}>
              <XMarkIcon height={16} width={16} color="#fff" />
            </CloseButton>
            <span>👋 I&apos;m Shahid&apos;s AI assistant — curious to know more about him?</span>
          </MessageBubble>
        )}
      </>
    </Side>
  );
};

FloatingButton.propTypes = {
  isHome: bool,
  onClick: func,
};

export default FloatingButton;
