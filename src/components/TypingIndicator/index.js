import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import anime from 'animejs';

// const IndicatorWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 6px;
//   padding: 10px 12px;
//   border-radius: 14px 14px 14px 6px;
//   background: ${(p) => p.theme.chat.bgLight};
//   border: 1px solid ${(p) => p.theme.chat.border};
//   align-self: flex-start;
//   width: fit-content;
// `;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: ${(p) => p.theme.text.reverse};
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
`;

const TypingIndicator = () => {
  const dotsRef = useRef([]);

  useEffect(() => {
    if (dotsRef.current.length) {
      anime({
        targets: dotsRef.current,
        scale: [
          { value: 0.3, duration: 300 },
          { value: 1, duration: 300 },
        ],
        easing: 'easeInOutSine',
        delay: anime.stagger(200), // each dot jumps in sequence
        loop: true,
      });
    }
  }, []);

  return (
    <div>
      {[0, 1, 2].map((i) => (
        <Dot key={i} ref={(el) => (dotsRef.current[i] = el)} />
      ))}
    </div>
  );
};

export default TypingIndicator;
