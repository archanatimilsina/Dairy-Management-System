import Navbar from "../elementComponent/Navbar"
import FooterSection from "../elementComponent/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
  <>
    {/* <Navbar /> */}
    <Outlet />
    {/* <FooterSection /> */}
  </>
  )
}

export default MainLayout