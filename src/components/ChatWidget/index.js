import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Send, Bot } from 'lucide-react';
import { bool, func } from 'prop-types';
import { useTheme } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useChat } from '@ai-sdk/react';
import anime from 'animejs';
import PropTypes from 'prop-types';
import { BOT_NAME } from '../../lib/constants';
import ChatStates from '../ChatStates';
import MessageList from './MessageList';
import {
  ChatWidgetContainer,
  ChatHeader,
  Avatar,
  HeaderInfo,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  ActionButton,
  MessagesContainer,
  ComposerContainer,
  ComposerRow,
  InputContainer,
  MessageInput,
  SendButton,
} from './styles';

// Main Component
const ChatWidget = ({ isOpen, onClose, onMinimize, className }) => {
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState('empty');
  const [tempLoadingMessage, setTempLoadingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);
  const theme = useTheme();

  // AI Chat integration
  const { messages, sendMessage, error, status, regenerate } = useChat();
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
      setTempLoadingMessage(null);
    } else if (status === 'loading' && messages.length === 0) {
      setChatState('loading');
    } else if (messages.length === 0) {
      setChatState('empty');
    } else {
      setChatState('chat');
    }
  }, [error, status, messages.length]);

  useEffect(() => {
    if (tempLoadingMessage && messages.some((msg) => msg.role === 'assistant')) {
      setTempLoadingMessage(null);
    }
  }, [messages, tempLoadingMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    // Create temporary loading message immediately
    setTempLoadingMessage({
      id: 'temp-loading',
      role: 'assistant',
      parts: [{ type: 'text', text: '' }],
      isLoading: true,
    });

    sendMessage({ text: inputValue });
    setInputValue('');
  };

  const handleChipClick = (action) => {
    setInputValue(action);
    inputRef.current?.focus();
  };

  const handleRetry = () => {
    if (messages.length === 0) {
      setChatState('empty');
    } else {
      if (regenerate) {
        regenerate();
      }

      setChatState('chat');
    }
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
          {chatState === 'chat' && (
            <MessageList
              messages={tempLoadingMessage ? [...messages, tempLoadingMessage] : messages}
            />
          )}

          {(chatState === 'empty' || chatState === 'loading' || chatState === 'error') && (
            <ChatStates
              state={chatState}
              onRetry={handleRetry}
              onChipClick={handleChipClick}
              error={error}
            />
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

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
              disabled={!inputValue.trim() || isStreaming || tempLoadingMessage !== null}
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
