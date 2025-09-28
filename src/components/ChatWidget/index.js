import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Send, Paperclip, MoreHorizontal, User, Bot } from 'lucide-react';
import { bool, func } from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import TypingIndicator from '../TypingIndicator';
import PropTypes from 'prop-types';

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
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
  max-width: 80%;
  border-radius: 0.5rem;
  padding: 0.75rem;
  word-break: break-word;
  background-color: ${(p) => (p.$isBot ? p.theme.bg.chatHeader : 'transparent')};
  color: ${(p) => p.theme.text.default};
  border: ${(p) => (p.$isBot ? 'none' : `1px solid ${p.theme.brand.primary}`)};
  animation: ${slideIn} 0.3s ease-out;
`;

const MessageText = styled.p`
  font-size: ${(p) => p.theme.fontSize.body};
  margin: 0;
  line-height: 1.4;
`;

const MessageActions = styled.div`
  margin-top: 0.25rem;
`;

const ShowMoreButton = styled.button`
  color: ${(p) => p.theme.brand.primary};
  font-size: ${(p) => p.theme.fontSize.small};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    text-decoration: none;
  }
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
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  min-width: max-content;
`;

const ActionChip = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  transition: all 0.15s ease;
  min-height: 3rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  transform: scale(1);
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.brand.primary}20;
  }

  &:active {
    transform: scale(0.95);
  }

  ${(p) =>
    p.$variant === 'primary'
      ? `
    background-color: ${p.theme.brand.primary};
    color: ${p.theme.text.default};
    
    &:hover {
      background-color: #0578c7;
      box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      background-color: #0568b3;
    }
  `
      : `
    background-color: ${p.theme.bg.chip};
    color: ${p.theme.text.reverse};
    
    &:hover {
      background-color: #d1d8de;
      box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      background-color: #c6cdd3;
    }
  `}
`;

const ComposerContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${(p) => p.theme.brand.primary}20;
  background-color: ${(p) => p.theme.bg.chatHeader};
`;

const ComposerRow = styled.div`
  display: flex;
  align-items: flex-end;
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
  padding: 0.75rem;
  background-color: ${(p) => p.theme.bg.default};
  border: 1px solid ${(p) => p.theme.brand.border};
  border-radius: 0.5rem;
  color: ${(p) => p.theme.text.default};
  font-size: ${(p) => p.theme.fontSize.small};
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
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0578c7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
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
  const [messages, setMessages] = useState([
    {
      id: '1',
      content:
        "Hi there! I'm ShAI, Shahid's personal AI assistant. I can help you learn about his projects, skills, experience, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMore, setShowMore] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Thanks for your message! I'm here to help you learn more about Shahid's work and experience.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleChipClick = (action) => {
    setInputValue(action);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const truncateMessage = (content, maxLength = 280) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (!isOpen) return null;

  return (
    <CSSTransition in={isOpen} timeout={200} classNames="chat" unmountOnExit>
      <ChatWidgetContainer className={className}>
        {/* Header */}
        <ChatHeader>
          <Avatar>
            <Bot size={20} />
          </Avatar>
          <HeaderInfo>
            <HeaderTitle>Hello, I'm ShAI</HeaderTitle>
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
          {messages.map((message) => (
            <MessageWrapper key={message.id} $isUser={!message.isBot}>
              <MessageAvatar $isBot={message.isBot}>
                {message.isBot ? <Bot size={16} /> : <User size={16} />}
              </MessageAvatar>
              <MessageBubble $isBot={message.isBot}>
                <MessageText>
                  {showMore === message.id ? message.content : truncateMessage(message.content)}
                </MessageText>
                {message.content.length > 280 && (
                  <MessageActions>
                    <ShowMoreButton
                      onClick={() => setShowMore(showMore === message.id ? null : message.id)}
                    >
                      {showMore === message.id ? 'Show less' : 'Show more'}
                    </ShowMoreButton>
                  </MessageActions>
                )}
                <MessageTimestamp>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </MessageTimestamp>
              </MessageBubble>
            </MessageWrapper>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {/* Action Chips */}
        <ActionChipsContainer>
          <ActionChipsWrapper>
            {chipData.map((chip) => (
              <ActionChip
                key={chip.id}
                onClick={() => handleChipClick(chip.action)}
                $variant={chip.variant}
                aria-label={`Quick action: ${chip.label}`}
              >
                {chip.label}
              </ActionChip>
            ))}
          </ActionChipsWrapper>
        </ActionChipsContainer>

        {/* Composer */}
        <ComposerContainer>
          <ComposerRow>
            <AttachButton aria-label="Attach file">
              <Paperclip size={16} />
            </AttachButton>
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
              disabled={!inputValue.trim()}
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
