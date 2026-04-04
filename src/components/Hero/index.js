/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NAV_DELAY, LOADER_DELAY } from '@lib/constants';
import { StyledHeroSection, StyledBigTitle, StyledSubTitle } from './styles';
import BookACall from '../../common/book-call';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), NAV_DELAY);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Welcome, I&apos;m</h1>;
  const two = <StyledBigTitle>Mohd Shahid.</StyledBigTitle>;
  const three = (
    <StyledSubTitle slate>
      I build production-grade web apps and AI-powered systems that solve real problems.
    </StyledSubTitle>
  );
  const four = (
    <p>
      Frontend-focused engineer shipping React, Next.js, and TypeScript at scale — recently going
      deep on AI agents and automation workflows. Looking to build something or need an extra pair
      of hands? Let&apos;s talk.
    </p>
  );
  const five = <BookACall />;

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={LOADER_DELAY}>
              <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </StyledHeroSection>
  );
};

export default Hero;
