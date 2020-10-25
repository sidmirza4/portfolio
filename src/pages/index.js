import styled from 'styled-components';
import { Hero, About, Featured, Projects } from '@components';

const StyledMainContainer = styled.section`
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
    <Featured />
    <Projects />
  </StyledMainContainer>
);

export default IndexPage;
