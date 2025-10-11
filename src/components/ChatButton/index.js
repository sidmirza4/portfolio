import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { MessageCircle, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { BOT_NAME } from '../../lib/constants';

// Keyframe animations
const rippleEffect = keyframes`
  to {
    transform: scale(2);
    opacity: 0;
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Styled Components
const ChatButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ChatButton = styled.button`
  position: relative;
  width: 6.4rem; /* 64px */
  height: 6.4rem; /* 64px */
  border-radius: 50%;
  background-color: ${(p) => p.theme.brand.primary};
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-out;
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
    box-shadow: 0 0.6rem 2rem rgba(0, 0, 0, 0.2), 0 0 0 2px ${(p) => p.theme.bg.default},
      0 0 0 6px color-mix(in oklab, ${(p) => p.theme.brand.primary} 30%, transparent);
  }

  /* Open state styling */
  ${(p) =>
    p.$isOpen &&
    `
    background-color: #75708a;
    
    &:hover {
      background-color:rgb(101, 96, 119);
    }
  `}

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    ${(p) =>
      p.$isOpen &&
      `
      display: none;
    `}
  }
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
  top: 50%;
  left: 50%;
  width: 3.2rem; /* Start from center, half the button size */
  height: 3.2rem;
  margin-top: -1.6rem; /* Center it */
  margin-left: -1.6rem; /* Center it */
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ${rippleEffect} 0.5s ease-out;
  pointer-events: none;
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
  width: 2.4rem; /* 24px */
  height: 2.4rem; /* 24px */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-out;

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    width: 2rem;
    height: 2rem;
  }
`;

/* Green notification dot on top-right corner */
const NotificationIndicator = styled.div`
  position: absolute;
  top: -0.2rem;
  right: -0.2rem;
  width: 1.2rem;
  height: 1.2rem;
  background-color: ${(p) => p.theme.brand.accent};
  border-radius: 50%;
  opacity: 1;
  display: ${(p) => (p.$hasNotification ? 'block' : 'none')};
  animation: ${pulseAnimation} 1s cubic-bezier(0, 0, 0.2, 1) infinite;

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    width: 1rem;
    height: 1rem;
    top: 0;
    right: 0;
  }
`;

const WelcomeMessage = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 1rem;
  width: 28rem;
  background-color: ${(p) => p.theme.bg.default};
  border-radius: 1.2rem;
  box-shadow: 0 0.8rem 2.4rem rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  transition: all 0.3s ease-out;
  pointer-events: none;
  z-index: 10;
  display: none; /* Commented out for now */

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    width: calc(100vw - 3rem);
    right: -1rem;
  }
`;

const WelcomeContent = styled.div`
  display: flex;
  gap: 1.2rem;
  padding: 1.6rem;
  align-items: flex-start;
`;

const WelcomeAvatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.brand.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WelcomeText = styled.div`
  flex: 1;

  p {
    margin: 0;
    color: ${(p) => p.theme.text.default};
    font-size: ${(p) => p.theme.fontSize.micro};
    line-height: 1.4;

    &:first-child {
      font-weight: 600;
      margin-bottom: 0.4rem;
    }
  }
`;

// Main Component
const FloatingChatButton = ({ isOpen, onClick, hasNotification = false }) => {
  const [showRipple, setShowRipple] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    setShowRipple(true);

    // Reset ripple effect
    setTimeout(() => setShowRipple(false), 400);

    onClick?.();
  };

  return (
    <ChatButtonContainer>
      <ChatButton
        ref={buttonRef}
        $isOpen={isOpen}
        onClick={handleClick}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        role="button"
        tabIndex={0}
      >
        <BackgroundGradient />

        {showRipple && <RippleEffect />}

        <IconContainer $isOpen={isOpen}>
          <Icon>{isOpen ? <X size="100%" /> : <MessageCircle size="100%" />}</Icon>
        </IconContainer>

        {/* Green notification dot on top-right */}
        <NotificationIndicator $hasNotification={hasNotification && !isOpen} />
      </ChatButton>

      {/* Welcome Message (commented out for now) */}
      <WelcomeMessage>
        <WelcomeContent>
          <WelcomeAvatar>
            <MessageCircle size={16} color="white" />
          </WelcomeAvatar>
          <WelcomeText>
            <p>Hi! I&apos;m {BOT_NAME} 👋</p>
            <p>I can help you learn about Shahid&apos;s projects and experience.</p>
          </WelcomeText>
        </WelcomeContent>
      </WelcomeMessage>
    </ChatButtonContainer>
  );
};

FloatingChatButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  hasNotification: PropTypes.bool,
};

export default FloatingChatButton;
