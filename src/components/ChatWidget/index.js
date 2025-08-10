import { useChat } from '@ai-sdk/react';
import { MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { bool, func } from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import anime from 'animejs';

const openAnim = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.995); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const closeAnim = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(8px) scale(0.995); }
`;

const Side = styled.div`
  width: 320px;
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
  min-height: 450px;
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
  background: ${(p) => (p.$isUser ? p.theme.bg.defaultLight : p.theme.bg.reverse)};
  color: ${(p) => (p.$isUser ? p.theme.text.default : p.theme.text.reverse)};
  font-size: 14px;
  line-height: 1.35;
  word-break: break-word;
`;

const ChatInputForm = styled.form`
  display: flex;
  padding: 10px;
  border-top: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
  background: ${(p) => p.theme.bg.reverse};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
  font-size: 14px;
  outline: none;
`;

const SendButton = styled.button`
  margin-left: 8px;
  background-color: ${(p) => p.theme.primary || p.theme.colors?.primary || '#2563eb'};
  color: ${(p) => p.theme.button?.text || '#fff'};
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

const FloatingChat = ({ isOpen, setIsOpen }) => {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  const messagesRef = useRef(null);
  const chatRef = useRef(null);

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
  }, [messages.length]);

  return (
    <CSSTransition in={isOpen} timeout={200} classNames="chat" unmountOnExit>
      <Side ref={chatRef}>
        <ChatWindow>
          <ChatHeader>
            <HeaderTitle>Hello, I&apos;m ShAI</HeaderTitle>
            <HeaderActions>
              <MinusIcon onClick={() => setIsOpen(false)} />
              <XMarkIcon onClick={() => setIsOpen(false)} />
            </HeaderActions>
          </ChatHeader>

          <ChatMessages ref={messagesRef}>
            {messages.map((message) => {
              const text = message.parts
                .filter((p) => p.type === 'text')
                .map((p) => p.text)
                .join(' ');
              return (
                <MessageBubble key={message.id} $isUser={message.role === 'user'}>
                  {text}
                </MessageBubble>
              );
            })}
          </ChatMessages>

          <ChatInputForm
            onSubmit={(e) => {
              e.preventDefault();
              if (input && input.trim()) sendMessage({ text: input });
              setInput('');
            }}
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me..."
            />
            <SendButton type="submit">Send</SendButton>
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
