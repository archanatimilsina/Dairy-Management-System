import Navbar from "../elementComponent/Navbar"
import FooterSection from "../elementComponent/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
  <>
    <Navbar />
    <Outlet />
    {/* FooterSection was imported here but never rendered, so the footer (and its
        company-info/ fetch) only appeared on Home and Product. Rendering it once
        at layout level covers every page; the per-page copies in Home.jsx and
        Product.jsx were removed so it does not appear twice. */}
    <FooterSection />
  </>
  )
}

export default MainLayout