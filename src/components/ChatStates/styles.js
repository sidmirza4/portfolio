import styled from 'styled-components';

export const ChatStatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.2rem;
  text-align: center;
  height: 100%;
  width: 100%;
  min-height: 40rem;
`;

export const Avatar = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.bg.chatBotMessage};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.6rem;
  position: relative;
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  top: -0.8rem;
  left: -0.8rem;
  width: 8rem;
  height: 8rem;
  border: 2px solid ${(p) => p.theme.brand.primary};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorIcon = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.6rem;
`;

export const Title = styled.h3`
  color: ${(p) => p.theme.text.default};
  font-size: ${(p) => p.theme.fontSize.large};
  font-weight: 600;
  margin: 0 0 0.8rem 0;
`;

export const Description = styled.p`
  color: ${(p) => p.theme.text.secondary};
  font-size: ${(p) => p.theme.fontSize.small};
  margin: 0 0 2.4rem 0;
  max-width: 28rem;
  line-height: 1.4;
`;

export const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  background-color: ${(p) => p.theme.brand.primary};
  color: white;
  border: none;
  border-radius: 0.8rem;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0578c7;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

export const ActionChipsContainer = styled.div`
  width: 100%;
  max-width: 32rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ActionChipsWrapper = styled.div`
  display: flex;
  gap: 0.8rem;
  padding-bottom: 0.8rem;
  min-width: max-content;
`;

export const ActionChip = styled.button`
  padding: 0.75rem 1.2rem;
  border-radius: 9rem;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 4.4rem;
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
