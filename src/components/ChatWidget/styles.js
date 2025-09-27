import styled, { keyframes } from 'styled-components';

export const openAnim = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.995); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const closeAnim = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(8px) scale(0.995); }
`;

export const Side = styled.div`
  width: 420px;
  position: fixed;
  bottom: 20px;
  right: 40px;
  z-index: 1000;
  color: ${(p) => p.theme.bg.reverse};

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    width: 100dvw;
    height: 100dvh;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    border-radius: 0;
  }

  &.chat-enter {
    animation: ${openAnim} 180ms ease-out forwards;
  }
  &.chat-exit {
    animation: ${closeAnim} 150ms ease-in forwards;
  }
`;

export const ChatWindow = styled.div`
  min-height: 500px;
  background-color: ${(p) => p.theme.bg.gray};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    min-height: 100vh;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`;

export const ChatHeader = styled.div`
  background: ${(p) => p.theme.bg.reverse};
  color: ${(p) => p.theme.text?.reverse || '#111'};
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.brand.border};
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
`;

export const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

export const HeaderActions = styled.div`
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

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    gap: 12px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const HeaderMessage = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.text.secondary};
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  background: ${(p) => p.theme.chat?.bg || 'transparent'};

  /* Mobile responsive styles */
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    max-height: calc(100vh - 120px);
    padding: 16px;
  }
`;

export const MessageBubble = styled.div`
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

export const ChatInputForm = styled.form`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-top: 1px solid ${(p) => p.theme.border || '#e5e7eb'};
  background-color: white;
  gap: 8px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.05);

  /* Mobile responsive styles */
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    padding: 12px 16px;
    gap: 12px;
  }
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  &::placeholder: {
    color: ${(p) => p.theme.text.secondary};
  }

  /* Mobile responsive styles */
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    padding: 12px 16px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

export const IconButton = styled.button`
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

  /* Mobile responsive styles */
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    padding: 10px;
    min-width: 44px; /* Minimum touch target size */
    min-height: 44px;

    svg {
      width: 22px;
      height: 22px;
    }
  }
`;
