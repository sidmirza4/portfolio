import React from 'react';
import { AlertCircle, RefreshCw, Bot } from 'lucide-react';
import { BOT_NAME } from '../../lib/constants';
import {
  ChatStatesContainer,
  Avatar,
  LoadingSpinner,
  ErrorIcon,
  Title,
  Description,
  RetryButton,
  ActionChipsContainer,
  ActionChipsWrapper,
  ActionChip,
} from './styles';
import { CHIP_DATA } from '../../lib/constants';

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
              {CHIP_DATA.map((chip) => (
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
