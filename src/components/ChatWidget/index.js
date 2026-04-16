import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Send, Bot } from 'lucide-react';
import PropTypes, { bool, func } from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { useChat } from '@ai-sdk/react';
import anime from 'animejs';
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

// ── Error parser ─────────────────────────────────────────────────────────────
// The AI SDK surfaces errors in inconsistent ways depending on the status code.
// error.status may exist on APICallError, or the status text is embedded in error.message.
// We check all three signals: .status, message text, and response JSON body.
function parseApiError(error) {
  if (!error) return null;

  const status = error?.status;
  const msg = (error?.message || '').toLowerCase();

  // Try to extract a JSON error body (AI SDK sometimes puts it in responseBody or message)
  let bodyError = '';
  try {
    const raw = error?.responseBody || (msg.startsWith('{') ? error.message : '');
    bodyError = (JSON.parse(raw)?.error || '').toLowerCase();
  } catch {
    /* ignore */
  }

  const combined = `${msg} ${bodyError}`;

  // 429 — rate limit
  if (
    status === 429 ||
    combined.includes('429') ||
    combined.includes('too many') ||
    combined.includes('rate limit') ||
    combined.includes('slow down') ||
    combined.includes('limit reached') ||
    combined.includes('daily limit') ||
    combined.includes('hourly limit')
  ) {
    return "You're sending messages too quickly. Please wait a moment before trying again.";
  }

  // 403 — forbidden
  if (status === 403 || combined.includes('403') || combined.includes('forbidden')) {
    return 'This request was blocked. Please refresh the page and try again.';
  }

  // 503 — service unavailable
  if (
    status === 503 ||
    combined.includes('503') ||
    combined.includes('unavailable') ||
    combined.includes('service temporarily')
  ) {
    return 'The assistant is temporarily unavailable. Please try again shortly.';
  }

  // 400 — bad request
  if (
    status === 400 ||
    combined.includes('400') ||
    combined.includes('invalid') ||
    combined.includes('too long') ||
    combined.includes("couldn't be processed")
  ) {
    return "Your message couldn't be processed. Please try rephrasing or shortening it.";
  }

  return 'Something went wrong. Please try again.';
}

// Main Component
const ChatWidget = ({ isOpen, onClose, onMinimize, className }) => {
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState('empty');
  const [tempLoadingMessage, setTempLoadingMessage] = useState(null);
  const [inlineError, setInlineError] = useState(null);
  const assistantCountAtSend = useRef(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  // AI Chat integration
  const { messages, sendMessage, error, status, regenerate } = useChat();
  // In v6, status is: 'ready' | 'submitted' | 'streaming' | 'error'
  const isLoading = status === 'submitted' || status === 'streaming';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, error, inlineError]);

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
      setTempLoadingMessage(null);

      if (messages.length > 0) {
        // ── Inline error: conversation exists — show error bubble, stay in chat
        setChatState('chat');
        setInlineError(parseApiError(error));
      } else {
        // ── Full-screen error: no messages yet — show the error state screen
        setChatState('error');
        setInlineError(null);
      }
    } else if (messages.length === 0) {
      setChatState('empty');
      setInlineError(null);
    } else {
      setChatState('chat');
    }
  }, [error, status, messages.length]);

  // Clear temp loading message once a NEW assistant message appears
  useEffect(() => {
    if (!tempLoadingMessage) return;

    const currentAssistantCount = messages.filter((msg) => msg.role === 'assistant').length;
    // A new assistant message has appeared since we started loading
    if (currentAssistantCount > assistantCountAtSend.current) {
      setTempLoadingMessage(null);
    }
  }, [messages, tempLoadingMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Clear any previous inline error when user sends a new message
    setInlineError(null);

    // Remember how many assistant messages exist right now
    assistantCountAtSend.current = messages.filter((msg) => msg.role === 'assistant').length;

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
      setInlineError(null);
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
            <HeaderTitle>{BOT_NAME}</HeaderTitle>
            <HeaderSubtitle>Shahid&apos;s personal AI assistant</HeaderSubtitle>
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
              inlineError={inlineError}
            />
          )}

          {(chatState === 'empty' || chatState === 'error') && (
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
              disabled={!inputValue.trim() || isLoading || tempLoadingMessage !== null}
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
