/* eslint-disable global-require */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import { useEffect, useRef } from 'react';
import { srConfig } from '@config/sr';
import styled from 'styled-components';
import { NumberedHeading } from '@common/styles'; // Import your numbered heading component
import { handleClickResume } from '../../utils';

const Company = styled.div`
  margin-bottom: 3rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;

    span {
      color: ${(props) => props.theme.text.green};
    }
  }

  h4 {
    font-size: 1.1rem;
    color: #8892b0;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: clamp(12px, 14px, 16px);
    color: ${(props) => props.theme.text.accent};

    &::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: ${(props) => props.theme.brand.primary};
    }
  }
`;



const ResumeButton = styled.a`
  ${({ theme }) => theme.mixins.bigButton};
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const Work = ({ experienceData = [] }) => {
  const revealContainer = useRef(null);

  useEffect(() => {
    const ScrollReveal = require('scrollreveal');
    const sr = ScrollReveal.default();
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <section id="work" ref={revealContainer}>
      <NumberedHeading>Where I&apos;ve Worked</NumberedHeading>
      {experienceData.map((exp, index) => (
        <Company key={index}>
          <h3>
            {exp.role} @ <span>{exp.company}</span>
          </h3>
          <h4>{exp.duration}</h4>
          <ul>
            {exp.bullets.map((bullet, _index) => (
              <li key={_index}>{bullet}</li>
            ))}
          </ul>
        </Company>
      ))}
      <ResumeButton onClick={handleClickResume}>Full resume</ResumeButton>
    </section>
  );
};

export default Work;
