import React from 'react';
import PropTypes from 'prop-types';
import { User, Bot } from 'lucide-react';
import {
  MessageWrapper,
  MessageAvatar,
  MessageBubble,
  MessageText,
  MessageTimestamp,
} from './styles';
import TypingIndicator from '../TypingIndicator';

const MessageList = ({ messages }) => {
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
};

export default MessageList;
