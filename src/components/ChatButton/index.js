import styled from 'styled-components';
import { bool, func } from 'prop-types';
import Side from '../Side';

const CircularButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  }
`;

const AssistantIcon = styled.svg`
  width: 28px;
  height: 28px;
  fill: black;
`;

const FloatingButton = ({ isHome, onClick }) => {
  return (
    <Side isHome={isHome} orientation="right">
      <CircularButton onClick={onClick}>
        <AssistantIcon viewBox="0 0 24 24">
          <path
            d={`M12 2C6.48 2 2 5.58 2 10c0 2.65 1.72 4.98 4.41 6.39L5 22l5.16-3.11C10.76 18.96 11.37 19 12 19c5.52 
                    0 10-3.58 10-8s-4.48-9-10-9zM7 10h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z`}
          />
        </AssistantIcon>
      </CircularButton>
    </Side>
  );
};

FloatingButton.propTypes = {
  isHome: bool,
  onClick: func,
};

export default FloatingButton;
