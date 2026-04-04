import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Hero, About, Featured, Projects, Contact } from '@components';
import { resumeDocId } from '@config';
import Work from '../components/Work';
import { fetchResumeData } from '../utils/parseResume';

const StyledMainContainer = styled.section`
  width: 100%;
  max-width: 900px;
  counter-reset: section;
  section {
    margin: 0 auto;
    padding: 100px 0;
  }
`;

const IndexPage = ({ experienceData }) => (
  <StyledMainContainer className="fillHeight">
    <Hero />
    <About />
    <Work experienceData={experienceData} />
    <Featured />
    <Projects />
    <Contact />
  </StyledMainContainer>
);

IndexPage.propTypes = {
  experienceData: PropTypes.arrayOf(PropTypes.shape({})),
};

export async function getStaticProps() {
  // Fetch dynamic experience data using Google Doc ID from the config file
  const experienceData = await fetchResumeData(resumeDocId);

  return {
    props: {
      experienceData,
    },
    // Next.js ISR: Re-fetch and regenerate page every 24 hours automatically!
    revalidate: 86400,
  };
}

export default IndexPage;
