import { useChat } from '@ai-sdk/react';
import { bool, func } from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const ChatWindow = styled.div`
  width: 320px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background-color: #2563eb;
  color: white;
  padding: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  max-height: 400px;
`;

const ChatInputForm = styled.form`
  display: flex;
  padding: 8px;
  border-top: 1px solid #ccc;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
  margin-left: 8px;
  background-color: #2563eb;
  color: white;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const Side = styled.div`
  width: 280px;
  position: fixed;
  bottom: 0;
  left: ${(props) => (props.orientation === 'left' ? '40px' : 'auto')};
  right: ${(props) => (props.orientation === 'left' ? 'auto' : '40px')};
  z-index: 10;
  color: ${(props) => props.theme.bg.reverse};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    left: ${(props) => (props.orientation === 'left' ? '20px' : 'auto')};
    right: ${(props) => (props.orientation === 'left' ? 'auto' : '20px')};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const FloatingChat = ({ isOpen, setIsOpen }) => {
  const { messages, sendMessage, input, setInput } = useChat();

  return (
    <>
      {isOpen && (
        <Draggable handle=".chat-header">
          <Side>
            <ChatWindow>
              <ChatHeader className="chat-header">
                <span>ShAI</span>
                <div>
                  <button type="button" onClick={() => setIsOpen(false)}>
                    _
                  </button>
                  <button type="button" onClick={() => setIsOpen(false)}>
                    ×
                  </button>
                </div>
              </ChatHeader>

              <ChatMessages>
                {messages.map((message) => (
                  <div key={message.id}>
                    <strong>{message.role === 'user' ? 'You: ' : 'ShAI: '}</strong>
                    {message.parts.map((part) =>
                      part.type === 'text' ? <span key={message.id}>{part.text}</span> : null,
                    )}
                  </div>
                ))}
              </ChatMessages>

              <ChatInputForm
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage({ text: input });
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
        </Draggable>
      )}
    </>
  );
};

FloatingChat.propTypes = {
  isOpen: bool,
  setIsOpen: func,
};

export default FloatingChat;
