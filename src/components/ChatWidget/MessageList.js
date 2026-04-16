import React from 'react';
import PropTypes from 'prop-types';
import { User, Bot, AlertTriangle } from 'lucide-react';
import {
  MessageWrapper,
  MessageAvatar,
  MessageBubble,
  MessageText,
  MessageTimestamp,
  ErrorBubble,
  ErrorBubbleContent,
  ErrorBubbleText,
  ErrorBubbleIcon,
} from './styles';
import TypingIndicator from '../TypingIndicator';

const MessageList = ({ messages, inlineError }) => {
  return (
    <>
      {messages.map((message) => {
        const text = message.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text)
          .join(' ');
        const isStreamingMessage =
          (message.role === 'assistant' && text === '') || message.isLoading;

        return (
          <MessageWrapper key={message.id} $isUser={message.role === 'user'}>
            <MessageAvatar $isBot={message.role === 'assistant'}>
              {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </MessageAvatar>
            <MessageBubble $isBot={message.role === 'assistant'}>
              <MessageText>{isStreamingMessage ? <TypingIndicator /> : text}</MessageText>
              {!isStreamingMessage && (
                <MessageTimestamp>
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                </MessageTimestamp>
              )}
            </MessageBubble>
          </MessageWrapper>
        );
      })}

      {/* Inline error bubble — shown after messages instead of replacing the screen */}
      {inlineError && (
        <ErrorBubble>
          <ErrorBubbleIcon>
            <AlertTriangle size={16} />
          </ErrorBubbleIcon>
          <ErrorBubbleContent>
            <ErrorBubbleText>{inlineError}</ErrorBubbleText>
          </ErrorBubbleContent>
        </ErrorBubble>
      )}
    </>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      parts: PropTypes.array.isRequired,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      isLoading: PropTypes.bool,
    }),
  ).isRequired,
  inlineError: PropTypes.string,
};

export default MessageList;
