/* eslint-disable max-len */
import Head from 'next/head';
import PropTypes from 'prop-types';

const BaseLayout = ({ children }) => {
  return (
    <div id="main">
      <Head>
        <title>Mohd Shahid | Web & Mobile developer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          key="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sidmirza4" />
        <meta property="og:site_name" content="Mohd Shahid | Web & Mobile developer" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mohd Shahid | Web & Mobile developer" />
        <meta property="og:locale" content="en" />
        <meta property="og:url" content="https://sidmirza.com" />
        <meta
          name="description"
          content="Hi, I'm Mohd Shahid, a Software Engineer passionate about building scalable, high-performance applications for the web and mobile, delivering reliable and seamless user experiences."
        />
        <meta
          name="keywords"
          content="Software Developer, Software Engineer, JavaScript, TypeScript, React, Next.js, NestJS, Node.js, MongoDB, Web Developer, Full-Stack Developer, Freelancer"
        />
        <meta property="og:image" content="https://sidmirza.com/avatar.JPG" />
        <meta property="twitter:image" content="https://sidmirza.com/avatar.JPG" />
      </Head>
      {children}
    </div>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default BaseLayout;
