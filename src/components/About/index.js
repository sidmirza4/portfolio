/* eslint-disable global-require */
/* eslint-disable react/jsx-one-expression-per-line */
import { useEffect, useRef } from 'react';
import { NumberedHeading } from '@common/styles';
import { skills } from '@config';
import { srConfig } from '@config/sr';
import { StyledAboutSection, StyledText } from './styles';
import { Column } from '../../common/styles';

const About = () => {
  const revealContainer = useRef(null);

  useEffect(() => {
    const ScrollReveal = require('scrollreveal');
    const sr = ScrollReveal.default();
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const startDate = new Date('2021-04-01');
  const diffInMs = new Date() - startDate;
  const experienceYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <NumberedHeading>About Me</NumberedHeading>
      {/* <div className="inner"> */}
      <StyledText>
        <Column gap={6}>
          <p>
            Hello! I&apos;m Shahid, a Frontend-focused Software Engineer with {experienceYears}+
            years of experience building production-grade web applications and AI-powered systems.
          </p>
          <p>
            I have deep expertise in TypeScript, React, and Next.js, with hands-on experience
            designing and shipping AI agents, automation workflows, and backend APIs. My work
            involves owning end-to-end development, from config-driven dynamic forms to deploying AI
            agents that reduce manual effort.
          </p>
          <p>
            Whether it&apos;s building reusable UI component libraries, integrating LLMs to perform
            automated PR reviews, or architecting scalable cloud solutions, I love delivering
            tailored applications that have a high impact.
          </p>
          <br />
          <p>Here are a few technologies I&apos;ve been working with recently:</p>
        </Column>

        <ul className="skills-list">
          {skills && skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </StyledText>

      {/* <StyledPic>
          <div className="wrapper">
            <Image width={300} height={300} blu src="/avatar.JPG" alt="Avatar" className="img" />
          </div>
        </StyledPic> */}
      {/* </div> */}
    </StyledAboutSection>
  );
};

export default About;
