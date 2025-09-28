import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { bool, func } from 'prop-types';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

// Keyframe animations
const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const ping = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Styled Components
const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    bottom: 2rem;
    right: 2rem;
  }
`;

const ChatButton = styled.button`
  position: relative;
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.brand.primary};
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-out;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0.6rem 2rem rgba(0, 0, 0, 0.2);
    background-color: #0578c7;
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    box-shadow: 0 0 0 4px ${(p) => p.theme.brand.primary}30, 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
  }

  ${(p) =>
    p.$isOpen &&
    `
    background-color: ${p.theme.text.secondary};
    
    &:hover {
      background-color: #75708a;
    }
  `}
`;

const BackgroundGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 50%;

  ${ChatButton}:hover & {
    opacity: 1;
  }
`;

const RippleEffect = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  animation: ${ripple} 0.4s ease-out;
`;

const IconContainer = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease-out;

  ${(p) =>
    p.$isOpen &&
    `
    transform: rotate(180deg) scale(0.9);
  `}
`;

const Icon = styled.div`
  width: 2.4rem;
  height: 2.4rem;
`;

const NotificationIndicator = styled.div`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1rem;
  height: 1rem;
  background-color: ${(p) => p.theme.brand.accent};
  border: 2px solid ${(p) => p.theme.bg.default};
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

const NotificationPulse = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.brand.accent};
  animation: ${ping} 1s cubic-bezier(0, 0, 0.2, 1) infinite;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: ${(p) => p.theme.bg.defaultLight};
  color: ${(p) => p.theme.text.default};
  font-size: ${(p) => p.theme.fontSize.small};
  border-radius: 0.5rem;
  box-shadow: 0 1rem 3rem -1rem rgba(2, 12, 27, 0.7);
  border: 1px solid ${(p) => p.theme.brand.border};
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  transform: translateY(0.5rem);

  ${(p) =>
    p.$isHovered &&
    !p.$isPressed &&
    `
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  `}

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 1rem;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${(p) => p.theme.bg.defaultLight};
  }
`;

const WelcomeMessage = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${(p) => p.theme.bg.defaultLight};
  color: ${(p) => p.theme.text.default};
  border-radius: 0.5rem;
  box-shadow: 0 20px 30px -15px rgba(2, 12, 27, 0.7);
  border: 1px solid ${(p) => p.theme.brand.border};
  max-width: 17.5rem;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  transform: translateY(1rem);

  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    display: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 2rem;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${(p) => p.theme.bg.defaultLight};
  }
`;

const WelcomeContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const WelcomeAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: ${(p) => p.theme.brand.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WelcomeText = styled.div`
  p {
    margin: 0;

    &:first-child {
      font-size: ${(p) => p.theme.fontSize.small};
      margin-bottom: 0.25rem;
    }

    &:last-child {
      font-size: ${(p) => p.theme.fontSize.micro};
      color: ${(p) => p.theme.text.secondary};
    }
  }
`;

// Main Component
const FloatingChatButton = ({ isOpen, onClick, hasNotification = false, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = () => {
    setShowRipple(true);
    onClick();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(true);
      handleClick();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  };

  useEffect(() => {
    if (showRipple) {
      const timer = setTimeout(() => setShowRipple(false), 400);
      return () => clearTimeout(timer);
    }
  }, [showRipple]);

  return (
    <ChatButtonContainer className={className}>
      {/* Chat Button */}
      <ChatButton
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        $isOpen={isOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {/* Background Gradient */}
        <BackgroundGradient />

        {/* Ripple Effect */}
        {showRipple && <RippleEffect />}

        {/* Icon Container */}
        <IconContainer $isOpen={isOpen}>
          <Icon>{isOpen ? <X size="100%" /> : <MessageCircle size="100%" />}</Icon>
        </IconContainer>

        {/* Notification Indicator */}
        {hasNotification && !isOpen && (
          <>
            <NotificationIndicator />
            <NotificationPulse />
          </>
        )}
      </ChatButton>

      {/* Tooltip */}
      <Tooltip $isHovered={isHovered} $isPressed={isPressed}>
        {isOpen ? 'Close chat' : 'Need help? Chat with ShAI'}
      </Tooltip>

      {/* Welcome Message (commented out for now) */}
      <WelcomeMessage>
        <WelcomeContent>
          <WelcomeAvatar>
            <MessageCircle size={16} color="white" />
          </WelcomeAvatar>
          <WelcomeText>
            <p>Hi! I'm ShAI 👋</p>
            <p>I can help you learn about Shahid's projects and experience.</p>
          </WelcomeText>
        </WelcomeContent>
      </WelcomeMessage>
    </ChatButtonContainer>
  );
};

FloatingChatButton.propTypes = {
  isOpen: bool,
  onClick: func,
  hasNotification: bool,
  className: PropTypes.string,
};

export default FloatingChatButton;
