import React from 'react';
import styled from 'styled-components';
import { AlertCircle, RefreshCw, Bot } from 'lucide-react';
import { BOT_NAME } from '../../lib/constants';

// Chip data (same as in ChatWidget)
const chipData = [
  { id: '1', label: 'Show projects', action: "Tell me about Shahid's projects" },
  { id: '2', label: 'Skills', action: "What are Shahid's technical skills?" },
  { id: '3', label: 'Contact', action: 'How can I contact Shahid?' },
  { id: '4', label: 'Resume', action: "Can I see Shahid's resume?", variant: 'primary' },
];

const ChatStatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.2rem;
  text-align: center;
  height: 100%;
  width: 100%;
  min-height: 40rem;
`;

const Avatar = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.bg.chatBotMessage};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.6rem;
  position: relative;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: -0.8rem;
  left: -0.8rem;
  width: 8rem;
  height: 8rem;
  border: 2px solid ${(p) => p.theme.brand.primary};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorIcon = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.6rem;
`;

const Title = styled.h3`
  color: ${(p) => p.theme.text.default};
  font-size: ${(p) => p.theme.fontSize.large};
  font-weight: 600;
  margin: 0 0 0.8rem 0;
`;

const Description = styled.p`
  color: ${(p) => p.theme.text.secondary};
  font-size: ${(p) => p.theme.fontSize.small};
  margin: 0 0 2.4rem 0;
  max-width: 28rem;
  line-height: 1.4;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  background-color: ${(p) => p.theme.brand.primary};
  color: white;
  border: none;
  border-radius: 0.8rem;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0578c7;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const ActionChipsContainer = styled.div`
  width: 100%;
  max-width: 32rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActionChipsWrapper = styled.div`
  display: flex;
  gap: 0.8rem;
  padding-bottom: 0.8rem;
  min-width: max-content;
`;

const ActionChip = styled.button`
  padding: 0.75rem 1.2rem;
  border-radius: 1.6rem;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 4.4rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: pointer;
  transform: scale(1);
  outline: none;
  border: 1px solid;

  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.brand.primary}50, 0 0 0 1px transparent;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  ${(p) =>
    p.$variant === 'primary'
      ? `
    border-color: ${p.theme.brand.primary}30;
    color: ${p.theme.brand.primary};
    background-color: ${p.theme.brand.primary}05;
    
    &:hover {
      border-color: ${p.theme.brand.primary}50;
      background-color: ${p.theme.brand.primary}10;
    }
    
    &:active {
      background-color: ${p.theme.brand.primary}15;
    }
  `
      : `
    border-color: ${p.theme.text.secondary}30;
    color: ${p.theme.text.secondary};
    background-color: transparent;
    
    &:hover {
      border-color: ${p.theme.text.secondary}50;
      color: ${p.theme.text.default};
      background-color: ${p.theme.text.secondary}05;
    }
    
    &:active {
      background-color: ${p.theme.text.secondary}10;
    }
  `}
`;

const ChatStates = ({ state, onRetry, onChipClick, className }) => {
  if (state === 'empty') {
    return (
      <ChatStatesContainer className={className}>
        <Avatar>
          <Bot size={32} />
        </Avatar>
        <Title>Welcome to {BOT_NAME}</Title>
        <Description>
          I'm Shahid's AI assistant. I can help you learn about his projects, skills, and
          experience. Get started with one of these suggestions:
        </Description>
        {onChipClick && (
          <ActionChipsContainer>
            <ActionChipsWrapper>
              {chipData.map((chip) => (
                <ActionChip
                  key={chip.id}
                  onClick={() => onChipClick(chip.action)}
                  $variant={chip.variant}
                  aria-label={`Suggested message: ${chip.label}`}
                >
                  {chip.label}
                </ActionChip>
              ))}
            </ActionChipsWrapper>
          </ActionChipsContainer>
        )}
      </ChatStatesContainer>
    );
  }

  if (state === 'loading') {
    return (
      <ChatStatesContainer className={className}>
        <Avatar>
          <Bot size={32} />
          <LoadingSpinner />
        </Avatar>
        <Description>Setting up your AI assistant...</Description>
      </ChatStatesContainer>
    );
  }

  if (state === 'error') {
    return (
      <ChatStatesContainer className={className}>
        <ErrorIcon>
          <AlertCircle size={32} color="#f87171" />
        </ErrorIcon>
        <Title>Connection Error</Title>
        <Description>
          I'm having trouble connecting right now. Please check your internet connection and try
          again.
        </Description>
        {onRetry && (
          <RetryButton onClick={onRetry}>
            <RefreshCw size={16} />
            Try Again
          </RetryButton>
        )}
      </ChatStatesContainer>
    );
  }

  return null;
};

export default ChatStates;
