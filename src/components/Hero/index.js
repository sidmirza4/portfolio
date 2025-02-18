/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NAV_DELAY, LOADER_DELAY } from '@lib/constants';
import { StyledHeroSection, StyledBigTitle, StyledSubTitle } from './styles';

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
      I craft high-performance web & mobile apps that drive results.
    </StyledSubTitle>
  );
  const four = (
    <p>
      I&apos;m a full-stack engineer who builds scalable applications designed to enhance user
      experiences, improve efficiency, and optimize costs—helping businesses grow and operate
      smarter.
    </p>
  );
  const five = (
    <button
      data-cal-namespace="30min"
      data-cal-link="sidmirza4/30min"
      data-cal-config='{"layout":"month_view"}'
      type="button"
      className="email-link"
    >
      Book a Call
    </button>
  );

  const items = [one, two, three, four, five];

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', {
        cssVarsPerTheme: { light: { 'cal-brand': '#0693e3' }, dark: { 'cal-brand': '#f4f4f4' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

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
