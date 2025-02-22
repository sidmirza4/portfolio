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

const experienceData = [
  {
    company: 'Delhivery Pvt. Ltd.',
    role: 'Software Engineer',
    duration: 'July 2023 - Present',
    bullets: [
      'Led the development of 5 applications, contributing to a 33% revenue increase by delivering scalable and impactful solutions.',
      'Developed and maintained a UI component library used across 30+ applications, reducing development time by 40%.',
      'Implemented 30+ features across 13 applications, including real-time updates using server-sent events (SSE) and an analytics dashboard powered by AWS QuickSight.',
      'Mentored junior developers, improving code quality and reducing software defects.',
    ],
  },
  {
    company: 'Uolo EdTech Pvt. Ltd.',
    role: 'SDE II',
    duration: 'Nov 2022 - Mar 2023',
    bullets: [
      'Developed the Code Garage module, increasing student engagement and revenue by approximately 30%.',
      'Created custom React components, significantly reducing development time and improving team productivity.',
    ],
  },
  {
    company: 'Nawvel',
    role: 'Full Stack Software Engineer',
    duration: 'Apr 2021 - Nov 2022',
    bullets: [
      'Engineered a responsive UI component library using ReactJS and TypeScript, reducing monthly development time.',
      'Developed a high-performance RESTful API using NestJS and MongoDB, optimizing server response times.',
      'Deployed applications on AWS, improving reliability and scalability while reducing deployment costs by 70%.',
    ],
  },
];

const ResumeButton = styled.a`
  ${({ theme }) => theme.mixins.bigButton};
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const Work = () => {
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
      <ResumeButton onClick={handleClickResume}>Full Resume</ResumeButton>
    </section>
  );
};

export default Work;
