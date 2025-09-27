import { useChat } from '@ai-sdk/react';
import { MinusIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import anime from 'animejs';
import { bool, func } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTheme } from 'styled-components';
import {
  Side,
  ChatWindow,
  ChatHeader,
  HeaderTitle,
  HeaderMessage,
  HeaderActions,
  ChatMessages,
  MessageBubble,
  ChatInputForm,
  ChatInput,
  IconButton,
} from './styles';
import TypingIndicator from '../TypingIndicator';
import { Chip } from '../../common/chip';
import styled from 'styled-components';

const ChipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
`;

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
                Oh no! I'm having a lot more requests than usual. Please try again later.
              </MessageBubble>
            )}
          </ChatMessages>

          {messages.length === 0 && (
            <ChipsContainer>
              <Chip>Tell me about your skills...</Chip>
              <Chip>Show me your projects...</Chip>
              <Chip>How can I contact you...</Chip>
            </ChipsContainer>
          )}

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
