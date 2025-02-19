import styled from 'styled-components';
import { Hero, About, Featured, Projects, Contact } from '@components';
import Work from '../components/Work';

const StyledMainContainer = styled.section`
  width: 100%;
  max-width: 900px;
  counter-reset: section;
  section {
    margin: 0 auto;
    padding: 100px 0;
  }
`;

const IndexPage = () => (
  <StyledMainContainer className="fillHeight">
    <Hero />
    <About />
    <Work />
    <Featured />
    <Projects />
    <Contact />
  </StyledMainContainer>
);

export default IndexPage;
