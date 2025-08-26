import { useChat } from '@ai-sdk/react';
import { MinusIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import anime from 'animejs';
import { bool, func } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled, { keyframes, useTheme } from 'styled-components';
import TypingIndicator from '../TypingIndicator';

const openAnim = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.995); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const closeAnim = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(8px) scale(0.995); }
`;

const Side = styled.div`
  width: 420px;
  position: fixed;
  bottom: 20px;
  right: 40px;
  z-index: 1000;
  color: ${(p) => p.theme.bg.reverse};
  &.chat-enter {
    animation: ${openAnim} 180ms ease-out forwards;
  }
  &.chat-exit {
    animation: ${closeAnim} 150ms ease-in forwards;
  }
`;

const ChatWindow = styled.div`
  min-height: 500px;
  background-color: ${(p) => p.theme.bg.gray};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: ${(p) => p.theme.bg.reverse};
  color: ${(p) => p.theme.text?.reverse || '#111'};
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.brand.border};
`;

const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  svg {
    width: 18px;
    height: 18px;
    cursor: pointer;
    color: ${(p) => p.theme.text?.reverse || '#111'};
    opacity: 0.95;
    transition: opacity 0.16s ease, transform 0.12s ease;
    &:hover {
      opacity: 0.7;
      transform: scale(0.96);
    }
  }
`;

const HeaderMessage = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.text.secondary};
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  background: ${(p) => p.theme.chat?.bg || 'transparent'};
`;

const MessageBubble = styled.div`
  max-width: 84%;
  padding: 10px 12px;
  border-radius: ${(p) => (p.$isUser ? '14px 14px 6px 14px' : '14px 14px 14px 6px')};
  align-self: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  background: ${(p) => (p.$isUser ? p.theme.bg.defaultLight : p.theme.chat.bgLight)};
  border: 1px solid ${(p) => (p.$isUser ? undefined : p.theme.chat.border)};
  color: ${(p) => (p.$isUser ? p.theme.text.default : p.theme.text.reverse)};
  font-size: 14px;
  line-height: 1.35;
  word-break: break-word;
`;

const ChatInputForm = styled.form`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-top: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
  background-color: white;
  gap: 8px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  &::placeholder: {
    color: ${(p) => p.theme.text.secondary};
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s;

  svg {
    width: 20px;
    height: 20px;
    color: ${(p) => p.theme.text.reverse};
  }

  &:hover {
    background: ${(p) => p.theme.bg?.gray || '#f3f4f6'};
  }

  &:disabled {
    background: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// const Disclaimer = styled.div`
//   font-size: 11px;
//   color: ${(p) => p.theme.text?.muted || '#6b7280'};
//   text-align: center;
//   padding: 6px 10px;
//   border-top: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
// `;

const FloatingChat = ({ isOpen, setIsOpen }) => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, error, status } = useChat();
  const [showLoader, setShowLoader] = useState(false);
  const messagesRef = useRef(null);
  const chatRef = useRef(null);
  const theme = useTheme();

  const isStreaming = status === 'streaming' || showLoader;

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
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages.length, error]);

  useEffect(() => {
    if (status === 'streaming') {
      setShowLoader(false);
    }
  }, [status]);

  return (
    <CSSTransition in={isOpen} timeout={200} classNames="chat" unmountOnExit>
      <Side ref={chatRef}>
        <ChatWindow>
          <ChatHeader>
            <div>
              <HeaderTitle>Hello, I&apos;m ShAI</HeaderTitle>
              <HeaderMessage>Shahid&apos;s personal AI assistant</HeaderMessage>
            </div>
            <HeaderActions>
              <MinusIcon onClick={() => setIsOpen(false)} />
              <XMarkIcon onClick={() => setIsOpen(false)} />
            </HeaderActions>
          </ChatHeader>
          {/* <Disclaimer> ShAI is an AI assistant and may produce incorrect results.</Disclaimer> */}

          <ChatMessages ref={messagesRef}>
            {messages.map((message) => {
              // const isAssistant = message.role === 'assistant';

              const text = message.parts
                .filter((p) => p.type === 'text')
                .map((p) => p.text)
                .join(' ');
              return (
                <MessageBubble key={message.id} $isUser={message.role === 'user'}>
                  {text === '' ? (
                    <TypingIndicator>
                      <span />
                      <span />
                      <span />
                    </TypingIndicator>
                  ) : (
                    text
                  )}
                </MessageBubble>
              );
            })}

            {/* {showLoader && (
              <MessageBubble $isUser={false}>
                <TypingIndicator>
                  <span />
                  <span />
                  <span />
                </TypingIndicator>
              </MessageBubble>
            )} */}

            {error && (
              <MessageBubble $isUser={false} style={{ background: '#fee2e2', color: '#b91c1c' }}>
                ⚠️ Something went wrong. Please try again later.
              </MessageBubble>
            )}
          </ChatMessages>

          <ChatInputForm
            onSubmit={(e) => {
              e.preventDefault();
              if (isStreaming) return;
              if (input && input.trim()) sendMessage({ text: input });
              setTimeout(() => {
                setShowLoader(true);
              }, 200);
              setInput('');
            }}
          >
            <ChatInput
              placeholder="Ask me anything about Shahid..."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              name="message"
              autoComplete="off"
            />
            <style>
              {`
              .chat-input::placeholder {
                color: ${theme.text.secondary};
                opacity: 1;
              }
            `}
            </style>
            {/* <IconButton type="button">
              <FaceSmileIcon />
            </IconButton> */}
            <IconButton type="submit" disabled={isStreaming}>
              <PaperAirplaneIcon />
            </IconButton>
          </ChatInputForm>
        </ChatWindow>
      </Side>
    </CSSTransition>
  );
};

FloatingChat.propTypes = {
  isOpen: bool,
  setIsOpen: func,
};

export default FloatingChat;
