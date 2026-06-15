import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import AuthButtons from './Button';
import { useLogout } from '../../hooks/useLogout';
import { ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import logo from '../../../public/logo.png';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  body {
    background-color: #FAF7F2; 
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    color: #2D3436;
  }
`;

const Navbar = () => {
  const logout = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const user = { name: localStorage.getItem("username")
    , isLoggedIn: localStorage.getItem("IsLoggedIn") };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <NavContainer isScrolled={scrolled}>
        <LogoSection href="/">
          <img src={logo} alt="Elsa Premium Dairy" />
        </LogoSection>

        <NavLinks>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/cartPage">Cart</a></li>
          {/* <li><a href="/buyPage">Buy Now</a></li> */}
          <li><a href="/feedback">Feedback</a></li>
          <li><a href="/contactUs">Contact</a></li>

          {user.isLoggedIn ? (
            <li style={{ position: 'relative' }} ref={dropdownRef}>
              <UserProfile onClick={() => setShowDropdown(!showDropdown)}>
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-display">{user.name}</span>
                <ChevronDown size={14} className={showDropdown ? 'rotate' : ''} color="#C5A059" />
              </UserProfile>

              {showDropdown && (
                <DropdownMenu>
                  <div className="user-info-header">
                    <p className="user-name">{user.name}</p>
                  </div>
                  <hr />
                  <a href="/profile"><User size={16} /> My Profile</a>
                  <a href="/adminPanel"><LayoutDashboard size={16} /> Admin Panel</a>
                  <hr />
                  <button onClick={logout} className="logout-item">
                    <LogOut size={16} /> Logout
                  </button>
                </DropdownMenu>
              )}
            </li>
          ) : (
            <div className="auth-group">
              <AuthButtons text="Login" link="/loginPage" />
              <AuthButtons text="Register" link="/registerPage" />
            </div>
          )}
        </NavLinks>
      </NavContainer>
    </>
  );
};


const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.isScrolled ? '8px 5%' : '15px 5%'};
  background: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(10px)' : 'none'};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.isScrolled ? '0 10px 30px rgba(0,0,0,0.04)' : '0 4px 20px rgba(0,0,0,0.02)'};
  border-bottom: 1px solid #E6D5B8;
`;

const LogoSection = styled.a`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  
  img {
    height: 80px; 
    width: auto;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;

  li a {
    text-decoration: none;
    color: #4A4A4A;
    font-weight: 500;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    transition: all 0.3s ease;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: #C5A059;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #C5A059;
      &:after {
        width: 100%;
      }
    }
  }

  .auth-group {
    display: flex;
    gap: 12px;
    margin-left: 10px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 14px 5px 6px;
  border-radius: 50px;
  border: 1.5px solid #E6D5B8;
  background: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);


  &:hover { 
    background: #FAF7F2; 
    border-color: #C5A059;
    box-shadow: 0 4px 12px rgba(197, 160, 89, 0.1);
  }

  .avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #C5A059 0%, #B38E46 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
    box-shadow: 0 2px 6px rgba(197, 160, 89, 0.3);
  }

  .user-name-display {
    font-size: 0.85rem;
    font-weight: 700;
    color: #2D3436;
  }

  .rotate {
    transform: rotate(180deg);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: 240px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(45, 52, 54, 0.12);
  padding: 12px 0;
  border: 1px solid #F1F2F6;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;

  .user-info-header {
    padding: 12px 20px;
    .user-label { 
      font-size: 0.65rem; 
      color: #C5A059; 
      font-weight: 800; 
      text-transform: uppercase; 
      margin: 0 0 4px 0;
      letter-spacing: 0.05em;
    }
    .user-name { font-size: 0.95rem; font-weight: 700; color: #2D3436; margin: 0; }
  }

  hr { 
    border: none; 
    border-top: 1px solid #F1F2F6; 
    margin: 8px 0; 
  }

  a, .logout-item {
    padding: 12px 20px;
    font-size: 0.85rem;
    color: #636E72;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-weight: 500;

    svg {
      opacity: 0.7;
    }

    &:hover {
      
      background: #FAF7F2;
      color: #C5A059;
      svg { opacity: 1; }
    }
  }

  .logout-item {
    color: #E74C3C;
    &:hover { background: #FFF5F5; color: #E74C3C; }
  }
`;

export default Navbar;