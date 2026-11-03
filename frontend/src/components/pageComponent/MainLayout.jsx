import Navbar from "../elementComponent/Navbar"
import FooterSection from "../elementComponent/Footer";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const MainLayout = () => {
  return (
  <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <PageMain id="main-content">
      <Outlet />
    </PageMain>
    <FooterSection />
  </>
  )
}

const PageMain = styled.main`
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 60vh;
`;

export default MainLayout
