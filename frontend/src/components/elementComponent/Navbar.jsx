import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import AuthButtons from './Button';
import { useLogout } from '../../hooks/useLogout';
import { ChevronDown, User, LogOut } from 'lucide-react'; 

const Navbar = () => {
  const logout = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const user = { name: "Archana", isLoggedIn: true }; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <NavContainer>
      <div className="logo">Elsa <span>Dairy</span></div>
      <NavLinks>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/contactUs">Contact Us</a></li>
<li><a href="/cartPage">Cart</a></li>
<li><a href="/buyPage">Buy Now</a></li>
<li><a href="/contactUs">Contact Us</a></li>
<li><a href="/feedback">Feedback</a></li>
<li><a href="/adminPanel">Admin Panel</a></li> 
        
        {user.isLoggedIn ? (
          <li style={{ position: 'relative' }} ref={dropdownRef}>
            <UserProfile onClick={() => setShowDropdown(!showDropdown)}>
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className={showDropdown ? 'rotate' : ''} />
            </UserProfile>

            {showDropdown && (
              <DropdownMenu>
                <div className="user-info">
                  <p className="user-label">Signed in as</p>
                  <p className="user-name">{user.name}</p>
                </div>
                <hr />
                <a href="/profile"><User size={16} /> My Profile</a>
                <a href="/adminPanel"><User size={16} /> Admin Panel</a>
                <hr />
                <button onClick={logout} className="logout-item">
                  <LogOut size={16} /> Logout
                </button>
              </DropdownMenu>
            )}
          </li>
        ) : (
          <div className="auth-group">
            <AuthButtons text="Login" link="/loginPage"/>
            <AuthButtons text="Register" link="/registerPage"/>
          </div>
        )}
      </NavLinks>
    </NavContainer>
  );
};


const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);

  .logo {
    font-size: 1.6rem;
    font-weight: 800;
    color: #525151;
    span { color: #7DAACB; }
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 30px;
  list-style: none;

  li a {
    text-decoration: none;
    color: #525151;
    font-weight: 500;
    transition: 0.3s;
    &:hover { color: #7DAACB; }
  }

  .auth-group {
    display: flex;
    gap: 12px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50px;
  transition: 0.3s;

  &:hover { background: #f1f2f6; }

  .avatar {
    width: 38px;
    height: 38px;
    background: #7DAACB;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
  }

  .rotate {
    transform: rotate(180deg);
    transition: 0.3s;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 10px 0;
  border: 1px solid #f1f2f6;
  display: flex;
  flex-direction: column;

  .user-info {
    padding: 10px 20px;
    .user-label { font-size: 0.7rem; color: #b2bec3; margin: 0; }
    .user-name { font-size: 0.9rem; font-weight: 700; color: #2d3436; margin: 0; }
  }

  hr { border: none; border-top: 1px solid #f1f2f6; margin: 5px 0; }

  a, .logout-item {
    padding: 10px 20px;
    font-size: 0.9rem;
    color: #636e72;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: 0.2s;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: #f8fafb;
      color: #7DAACB;
    }
  }

  .logout-item {
    color: #ff7675;
    &:hover { background: #fff5f5; color: #ff7675; }
  }
`;

export default Navbar;