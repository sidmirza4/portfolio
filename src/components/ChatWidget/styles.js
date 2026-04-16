import styled, { keyframes } from 'styled-components';

// Keyframe animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

// Main Container
export const ChatWidgetContainer = styled.div`
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
  transform-origin: bottom right;

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw !important;
    height: 100vh !important;
    min-width: 100vw;
    min-height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    transform-origin: center;
  }
`;

// Header Components
export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.6rem;
  background-color: ${(p) => p.theme.bg.chatHeader};
  border-bottom: 1px solid ${(p) => p.theme.brand.primary}20;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
`;

export const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.brand.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

export const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HeaderTitle = styled.h3`
  color: ${(p) => p.theme.text.default};
  font-size: ${(p) => p.theme.fontSize.lg};
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
`;

export const HeaderSubtitle = styled.p`
  color: ${(p) => p.theme.text.secondary};
  font-size: ${(p) => p.theme.fontSize.md};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
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

// Messages Components
export const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MessageWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;

  ${(p) =>
    p.$isUser &&
    `
    flex-direction: row-reverse;
  `}
`;

export const MessageAvatar = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background-color: ${(p) => (p.$isBot ? p.theme.brand.primary : p.theme.bg.userAvatar)};
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

export const MessageBubble = styled.div`
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

export const MessageText = styled.p`
  font-size: ${(p) => p.theme.fontSize.body};
  margin: 0;
  line-height: 1.4;
`;

export const MessageTimestamp = styled.div`
  font-size: ${(p) => p.theme.fontSize.small};
  color: ${(p) => p.theme.text.secondary};
  margin-top: 0.25rem;
`;

export const ErrorBubble = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 0.1rem 0;
`;

export const ErrorBubbleContent = styled.div`
  max-width: 70%;
  border-radius: 1.2rem;
  padding: 0.75rem 1rem;
  word-break: break-word;
  background-color: ${(p) => p.theme.bg.chatBotMessage};
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-left: 3px solid rgba(239, 68, 68, 0.6);
  animation: ${slideIn} 0.3s ease-out;
`;

export const ErrorBubbleText = styled.p`
  font-size: ${(p) => p.theme.fontSize.body};
  color: rgba(252, 165, 165, 0.9);
  margin: 0;
  line-height: 1.4;
`;

export const ErrorBubbleIcon = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(252, 165, 165, 0.85);
  flex-shrink: 0;

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

// Composer Components
export const ComposerContainer = styled.div`
  padding: 1.6rem;
  border-top: 1px solid ${(p) => p.theme.brand.primary}20;
  background-color: ${(p) => p.theme.bg.chatHeader};
`;

export const ComposerRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
`;

export const InputContainer = styled.div`
  flex: 1;
  position: relative;
`;

export const MessageInput = styled.input`
  width: 100%;
  height: 4rem;
  padding: 0 1.2rem;
  border: 1px solid ${(p) => p.theme.text.secondary}30;
  border-radius: 1.2rem;
  background-color: ${(p) => p.theme.bg.default};
  color: ${(p) => p.theme.text.default};
  font-family: ${(p) => p.theme.fontFamily.fontSans};
  font-size: ${(p) => p.theme.fontSize.body};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(p) => p.theme.brand.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.brand.primary}20;
  }

  &::placeholder {
    color: ${(p) => p.theme.text.secondary};
  }
`;

export const SendButton = styled.button`
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
