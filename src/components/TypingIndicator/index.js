import React from 'react';
import styled, { keyframes } from 'styled-components';

const typingAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
`;

const TypingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem;
`;

const Dot = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  background-color: ${(p) => p.theme.text.secondary};
  border-radius: 50%;
  animation: ${typingAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(p) => p.$delay}ms;
`;

const TypingIndicator = () => {
  return (
    <TypingContainer>
      <Dot $delay={0} />
      <Dot $delay={160} />
      <Dot $delay={320} />
    </TypingContainer>
  );
};

export default TypingIndicator;
