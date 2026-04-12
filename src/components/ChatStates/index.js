import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, RefreshCw, Bot } from 'lucide-react';
import { BOT_NAME, CHIP_DATA } from '../../lib/constants';
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

const ChatStates = ({ state, onRetry, onChipClick, className }) => {
  if (state === 'empty') {
    return (
      <ChatStatesContainer className={className}>
        <Avatar>
          <Bot size={32} />
        </Avatar>
        <Title>Hello, I am {BOT_NAME}</Title>
        <Description>
          I&apos;m Shahid&apos;s AI assistant. I can help you learn about his projects, skills, and
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
          I&apos;m having trouble connecting right now. Please check your internet connection and
          try again.
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

ChatStates.propTypes = {
  state: PropTypes.oneOf(['empty', 'loading', 'error']).isRequired,
  onRetry: PropTypes.func,
  onChipClick: PropTypes.func,
  className: PropTypes.string,
};

export default ChatStates;
