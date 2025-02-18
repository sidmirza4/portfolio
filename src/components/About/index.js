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

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <NumberedHeading>About Me</NumberedHeading>
      {/* <div className="inner"> */}
      <StyledText>
        <Column gap={6}>
          <p>
            Hello! I&apos;m Shahid, a Full Stack Software Engineer with 4+ years of experience
            building scalable, high-impact web applications that drive business growth.
          </p>
          <p>
            I specialize in crafting performant, user-centric solutions using modern technologies
            like React, Next.js, Node.js, and AWS. My work has directly contributed to a 30%+
            revenue increase for Delhivery by delivering scalable applications tailored to client
            needs.
          </p>
          <p>
            Whether it&apos;s building reusable UI component libraries, optimizing server response
            times, or deploying cost-effective cloud solutions, I thrive on solving complex problems
            and delivering results that matter.
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
