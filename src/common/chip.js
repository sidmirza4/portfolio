import styled from 'styled-components';

export const Chip = styled.div`
  width: max-content;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadiusFull};
  background-color: ${({ theme }) => theme.bg.chip};
  color: ${({ theme }) => theme.text.reverse};
  // box-shadow: ${({ theme }) => theme.shadows.chip};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;
