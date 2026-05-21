import Navbar from "../elementComponent/Navbar"
import FooterSection from "../elementComponent/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
  <>
    
    <Outlet />

  </>
  )
}

export default MainLayout