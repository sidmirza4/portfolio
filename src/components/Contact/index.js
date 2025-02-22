/* eslint-disable global-require */
import { useEffect, useRef } from 'react';
import { email } from '@config';
import { srConfig } from '@config/sr';
import { NumberedHeading } from '@common/styles';
import { StyledContactSection } from './styles';
import BookACall from '../../common/book-call';
import theme from '../../themes/common';

const Contact = () => {
  const revealContainer = useRef(null);
  useEffect(() => {
    const ScrollReveal = require('scrollreveal');
    const sr = ScrollReveal.default();
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <NumberedHeading overline>What&apos;s Next?</NumberedHeading>

      <h2 className="title">Get In Touch</h2>

      <p>
        If you&apos;re looking for someone who can add real value to your team, book a call at your
        convenience. If the available times don&apos;t work for you, feel free to drop me an&nbsp;
        <a href={`mailto:${email}`} style={{ color: theme.brand.primary }}>
          email
        </a>
        —we&apos;ll make it happen!
      </p>

      <BookACall />
    </StyledContactSection>
  );
};

export default Contact;
