import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Bot } from 'lucide-react';

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
  gap: 1.2rem;
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${(p) => p.theme.bg.chatBotMessage};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TypingBubble = styled.div`
  background-color: ${(p) => p.theme.bg.chatBotMessage};
  border-radius: 0.8rem;
  padding: 1.2rem;
  max-width: 28rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
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
      <Avatar>
        <Bot size={16} />
      </Avatar>
      <TypingBubble>
        <Dot $delay={0} />
        <Dot $delay={160} />
        <Dot $delay={320} />
      </TypingBubble>
    </TypingContainer>
  );
};

export default TypingIndicator;
