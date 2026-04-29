import React from 'react'
import styled from 'styled-components'
import AuthButtons from './Button'
import { useLogout } from '../../hooks/useLogout'

const Navbar = () => {
  const logout= useLogout()
  return (
    <NavContainer>
      <div className="logo">Elsa <span>Dairy</span></div>
      <NavLinks>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/cartPage">Cart</a></li>
        <li><a href="/buyPage">Buy Now</a></li>
        <li><a href="/contactUs">Contact Us</a></li>
        <li><a href="/feedback">Feedback</a></li>
        <li><a href="/adminPanel">Admin Panel</a></li>
        <li><a onClick={logout}>Logout</a></li>
        {/* <li><a href="PortfolioHero">Portfolio</a></li> */}
        {/* <li onClick={logout}></li> */}

        <div className="auth-group">
         <AuthButtons text="Register" link="/registerPage"/>
         <AuthButtons text="Login" link="/loginPage"/>
         <AuthButtons text="Forgot password" link="/forgotPassword"/>
         
        
        </div>
      </NavLinks>
    </NavContainer>
  )
}

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);

  .logo {
    font-size: 1.8rem;
    font-weight: 800;
    color: #525151;
    span { color: #7DAACB; }
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 40px;
  list-style: none;
 

  li a {
    text-decoration: none;
    color: #525151;
    font-weight: 500;
    transition: 0.3s;
    &:hover { color: #7DAACB;
    
    }
  }

  .auth-group {
    display: flex;
    gap: 15px;

  }
`;

export default Navbar;