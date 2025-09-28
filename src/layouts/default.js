import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader, Social, Side } from '@components';
import { SkipToContentLink } from './styles';
import Main from './main';
import BaseLayout from './base';
import Navbar from './navbar';
import FloatingChatButton from '../components/ChatButton';
import ChatWidget from '../components/ChatWidget';

const DefaultLayout = ({ children }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const isBrowser = typeof window !== `undefined`;
  const [isLoading, setIsLoading] = useState(isHome);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  useEffect(() => {
    if (isLoading || !isBrowser) {
      return;
    }
    // eslint-disable-next-line global-require
    require('smooth-scroll')('a[href*="#"]');

    if (window.location.hash) {
      const id = window.location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }
  }, [isLoading]);

  const handleFinish = () => setIsLoading(false);

  const handleChatButtonClick = () => {
    setIsChatWidgetOpen((prev) => !prev);
  };

  return (
    <BaseLayout>
      <>
        <SkipToContentLink href="#content">Skip to Content</SkipToContentLink>
        {isLoading && isHome ? (
          <Loader onFinish={handleFinish} />
        ) : (
          <>
            <Navbar isHome={isHome} />
            <Social isHome={isHome} />
            {/* <Email isHome={isHome} /> */}
            <Side isHome={isHome} orientation="right">
              <FloatingChatButton isOpen={isChatWidgetOpen} onClick={handleChatButtonClick} />
            </Side>
            <ChatWidget
              isOpen={isChatWidgetOpen}
              onClose={() => setIsChatWidgetOpen(false)}
              onMinimize={() => setIsChatWidgetOpen(false)}
            />
            <Main id="content" className={isHome ? 'fillHeight' : ''}>
              {children}
            </Main>
            {/* <Footer /> */}
          </>
        )}
      </>
    </BaseLayout>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default DefaultLayout;
