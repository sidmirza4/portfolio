import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Send, Paperclip, MoreHorizontal, User, Bot } from 'lucide-react';
import { bool, func } from 'prop-types';
import styled, { keyframes, useTheme } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useChat } from '@ai-sdk/react';
import anime from 'animejs';
import TypingIndicator from '../TypingIndicator';
import ChatStates from '../ChatStates';
import PropTypes from 'prop-types';
import { BOT_NAME } from '../../lib/constants';

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const openAnim = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.995); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const closeAnim = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(8px) scale(0.995); }
`;

// Styled Components
const ChatWidgetContainer = styled.div`
  position: fixed !important;
  bottom: 9rem;
  right: 2rem;
  z-index: 50;
  width: 42rem !important;
  height: 60rem !important;
  min-width: 42rem;
  min-height: 60rem;
  max-width: 42rem;
  max-height: 60rem;
  background-color: ${(p) => p.theme.bg.chatWidget};
  box-shadow: 0 2rem 6rem rgba(6, 147, 227, 0.15), 0 0 0 1px rgba(6, 147, 227, 0.1);
  border: 1px solid color-mix(in oklab, ${(p) => p.theme.brand.primary} 20%, transparent);
  border-radius: 1.2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Mobile responsive styles */
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    width: 100vw !important;
    height: 100vh !important;
    min-width: 100vw;
    min-height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    border-radius: 0;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid color-mix(in oklab, ${(p) => p.theme.brand.primary} 20%, transparent);
  background-color: ${(p) => p.theme.bg.chatHeader};
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.brand.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h3`
  color: ${(p) => p.theme.text.default};
  font-weight: 500;
  margin: 0;
  font-size: ${(p) => p.theme.fontSize.large};
`;

const HeaderSubtitle = styled.p`
  color: ${(p) => p.theme.text.secondary};
  font-size: ${(p) => p.theme.fontSize.md};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.text.secondary};
  cursor: pointer;
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${(p) => p.theme.text.default};
    background-color: ${(p) => p.theme.bg.default};
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;

  ${(p) =>
    p.$isUser &&
    `
    flex-direction: row-reverse;
  `}
`;

const MessageAvatar = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background-color: ${(p) => (p.$isBot ? p.theme.brand.primary : p.theme.text.secondary)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => (p.$isBot ? 'white' : p.theme.text.default)};
  flex-shrink: 0;

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  border-radius: 1.2rem;
  padding: 0.75rem;
  word-break: break-word;
  background-color: ${(p) => (p.$isBot ? p.theme.bg.chatBotMessage : 'transparent')};
  color: ${(p) => p.theme.text.default};
  border: ${(p) =>
    p.$isBot
      ? `1px solid color-mix(in oklab, ${p.theme.text.secondary} 20%, transparent)`
      : `1px solid ${p.theme.brand.primary}`};
  animation: ${slideIn} 0.3s ease-out;
`;

const MessageText = styled.p`
  font-size: ${(p) => p.theme.fontSize.body};
  margin: 0;
  line-height: 1.4;
`;

const MessageTimestamp = styled.div`
  font-size: ${(p) => p.theme.fontSize.small};
  color: ${(p) => p.theme.text.secondary};
  margin-top: 0.25rem;
`;

const ActionChipsContainer = styled.div`
  padding: 0 1rem 0.5rem;
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
  padding: 1rem;
  border-radius: 1.6rem;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  transition: all 0.2s ease;
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

const ComposerContainer = styled.div`
  padding: 1.6rem;
  border-top: 1px solid ${(p) => p.theme.brand.primary}20;
  background-color: ${(p) => p.theme.bg.chatHeader};
`;

const ComposerRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
`;

const AttachButton = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.text.secondary};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    color: ${(p) => p.theme.text.default};
    background-color: ${(p) => p.theme.bg.default};
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const InputContainer = styled.div`
  flex: 1;
`;

const MessageInput = styled.input`
  width: 100%;
  height: 4rem;
  padding: 0 1.2rem;
  background-color: ${(p) => p.theme.bg.default};
  border: 1px solid ${(p) => p.theme.brand.border};
  border-radius: 1.2rem;
  color: ${(p) => p.theme.text.default};
  font-size: ${(p) => p.theme.fontSize.body};
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(p) => p.theme.text.secondary};
  }

  &:focus {
    border-color: ${(p) => p.theme.brand.primary};
    box-shadow: 0 0 0 2px ${(p) => p.theme.brand.primary}20;
  }

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    font-size: ${(p) => p.theme.fontSize.large}; /* Prevents zoom on iOS */
  }
`;

const SendButton = styled.button`
  background-color: ${(p) => p.theme.brand.primary};
  color: white;
  border: none;
  border-radius: 1.2rem;
  width: 4rem;
  height: 4rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${(p) => p.theme.brand.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

// Chip data
const chipData = [
  { id: '1', label: 'Show projects', action: "Tell me about Shahid's projects" },
  { id: '2', label: 'Skills', action: "What are Shahid's technical skills?" },
  { id: '3', label: 'Contact', action: 'How can I contact Shahid?' },
  { id: '4', label: 'Resume', action: "Can I see Shahid's resume?", variant: 'primary' },
];

// Main Component
const ChatWidget = ({ isOpen, onClose, onMinimize, className }) => {
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState('empty');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);
  const theme = useTheme();

  // AI Chat integration
  const { messages, sendMessage, error, status } = useChat();
  const isStreaming = status === 'streaming';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, error]);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      anime({
        targets: chatRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.95, 1],
        duration: 250,
        easing: 'easeOutQuad',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) {
      setChatState('error');
    } else if (status === 'loading' && messages.length === 0) {
      // Only show loading on initial load, not on every message
      setChatState('loading');
    } else if (messages.length === 0) {
      setChatState('empty');
    } else {
      setChatState('chat');
    }
  }, [error, status, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    sendMessage({ text: inputValue });
    setInputValue('');
  };

  const handleChipClick = (action) => {
    setInputValue(action);
    inputRef.current?.focus();
  };

  const handleRetry = () => {
    setChatState('empty');
    // Reset error state if needed
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <CSSTransition in={isOpen} timeout={200} classNames="chat" unmountOnExit>
      <ChatWidgetContainer ref={chatRef} className={className}>
        {/* Header */}
        <ChatHeader>
          <Avatar>
            <Bot size={20} />
          </Avatar>
          <HeaderInfo>
            <HeaderTitle>Hello, I'm {BOT_NAME}</HeaderTitle>
            <HeaderSubtitle>Shahid's personal AI assistant</HeaderSubtitle>
          </HeaderInfo>
          <HeaderActions>
            <ActionButton onClick={onMinimize} aria-label="Minimize chat">
              <Minimize2 size={16} />
            </ActionButton>
            <ActionButton onClick={onClose} aria-label="Close chat">
              <X size={16} />
            </ActionButton>
          </HeaderActions>
        </ChatHeader>

        {/* Messages */}
        <MessagesContainer>
          {chatState === 'chat' &&
            messages.map((message) => {
              const text = message.parts
                .filter((p) => p.type === 'text')
                .map((p) => p.text)
                .join(' ');
              const isStreamingMessage = message.role === 'assistant' && text === '';

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

          {(chatState === 'empty' || chatState === 'loading' || chatState === 'error') && (
            <ChatStates state={chatState} onRetry={handleRetry} onChipClick={handleChipClick} />
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {/* Action Chips - Only show when in chat mode and no user messages yet */}
        {chatState === 'chat' && !messages.some((msg) => msg.role === 'user') && (
          <ActionChipsContainer>
            <ActionChipsWrapper>
              {chipData.map((chip) => (
                <ActionChip
                  key={chip.id}
                  onClick={() => handleChipClick(chip.action)}
                  $variant={chip.variant}
                  aria-label={`Suggested message: ${chip.label}`}
                >
                  {chip.label}
                </ActionChip>
              ))}
            </ActionChipsWrapper>
          </ActionChipsContainer>
        )}

        {/* Composer */}
        <ComposerContainer>
          <ComposerRow>
            <InputContainer>
              <MessageInput
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
            </InputContainer>
            <SendButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isStreaming}
              aria-label="Send message"
            >
              <Send size={16} />
            </SendButton>
          </ComposerRow>
        </ComposerContainer>
      </ChatWidgetContainer>
    </CSSTransition>
  );
};

ChatWidget.propTypes = {
  isOpen: bool,
  onClose: func,
  onMinimize: func,
  className: PropTypes.string,
};

export default ChatWidget;
