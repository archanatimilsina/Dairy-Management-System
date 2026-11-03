import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import AuthButtons from './Button';
import { useLogout } from '../../hooks/useLogout';
import { ChevronDown, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/cartPage', label: 'Cart' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/contactUs', label: 'Contact' },
];

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const storedName = localStorage.getItem('username') || '';
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const user = { name: storedName, isLoggedIn: Boolean(localStorage.getItem('IsLoggedIn') && storedName) };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Lock body scroll when the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const go = (to) => {
    setMobileOpen(false);
    setShowDropdown(false);
    navigate(to);
  };

  return (
    <NavContainer $scrolled={scrolled}>
      <LogoButton onClick={() => go('/')} aria-label="Elsa Dairy home">
        <img src="/logo.png" alt="Elsa Premium Dairy" />
      </LogoButton>

      <DesktopLinks>
        {NAV_LINKS.map((l) => (
          <li key={l.to}>
            <StyledLink to={l.to}>{l.label}</StyledLink>
          </li>
        ))}
        {user.isLoggedIn ? (
          <li style={{ position: 'relative' }} ref={dropdownRef}>
            <UserProfile
              onClick={() => setShowDropdown((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showDropdown}
            >
              <div className="avatar">{(user.name || '?').charAt(0).toUpperCase()}</div>
              <span className="user-name-display">{user.name}</span>
              <ChevronDown size={14} className={showDropdown ? 'rotate' : ''} color="#C5A059" />
            </UserProfile>

            {showDropdown && (
              <DropdownMenu role="menu">
                <div className="user-info-header">
                  <p className="user-name">{user.name}</p>
                </div>
                <hr />
                <button onClick={() => go('/profile')}><User size={16} /> My Profile</button>
                {isStaff && (
                  <button onClick={() => go('/adminPanel')}><LayoutDashboard size={16} /> Admin Panel</button>
                )}
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
      </DesktopLinks>

      <MenuButton
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </MenuButton>

      {mobileOpen && (
        <MobileSheet role="dialog" aria-label="Site menu">
          {NAV_LINKS.map((l) => (
            <button key={l.to} onClick={() => go(l.to)}>{l.label}</button>
          ))}
          {user.isLoggedIn ? (
            <>
              <button onClick={() => go('/profile')}>My Profile</button>
              {isStaff && <button onClick={() => go('/adminPanel')}>Admin Panel</button>}
              <button onClick={logout} className="logout-item">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => go('/loginPage')}>Login</button>
              <button onClick={() => go('/registerPage')}>Register</button>
            </>
          )}
        </MobileSheet>
      )}
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: ${(props) => (props.$scrolled ? '8px 5%' : '15px 5%')};
  background: ${(props) => (props.$scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white')};
  backdrop-filter: ${(props) => (props.$scrolled ? 'blur(10px)' : 'none')};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => (props.$scrolled ? '0 10px 30px rgba(0,0,0,0.04)' : '0 4px 20px rgba(0,0,0,0.02)')};
  border-bottom: 1px solid #E6D5B8;
`;

const LogoButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease;

  img {
    height: clamp(48px, 6vw, 80px);
    width: auto;
    object-fit: contain;
  }

  &:hover { transform: scale(1.02); }
`;

const StyledLink = styled(Link)`
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
    &:after { width: 100%; }
  }
`;

const DesktopLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;

  .auth-group {
    display: flex;
    gap: 12px;
    margin-left: 10px;
  }

  /* Hamburger takes over on tablet and below. */
  @media (max-width: 900px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #E6D5B8;
  background: #fff;
  color: #2D3436;
  cursor: pointer;

  @media (max-width: 900px) {
    display: inline-flex;
  }
`;

const MobileSheet = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 0;
    top: 0;
    padding: calc(76px + env(safe-area-inset-top)) 20px 24px;
    background: rgba(250, 247, 242, 0.98);
    backdrop-filter: blur(8px);
    z-index: 999;
    overflow-y: auto;
  }

  button {
    text-align: left;
    background: #fff;
    border: 1px solid #EAE3D6;
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: 10px;
    font-size: 1rem;
    font-weight: 700;
    color: #2D3436;
    cursor: pointer;
    min-height: 52px;
  }

  .logout-item { color: #E74C3C; }
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
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rotate { transform: rotate(180deg); }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: min(240px, 70vw);
  background: white;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(45, 52, 54, 0.12);
  padding: 12px 0;
  border: 1px solid #F1F2F6;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;
  z-index: 1001;

  .user-info-header {
    padding: 12px 20px;
    .user-name { font-size: 0.95rem; font-weight: 700; color: #2D3436; margin: 0; overflow: hidden; text-overflow: ellipsis; }
  }

  hr {
    border: none;
    border-top: 1px solid #F1F2F6;
    margin: 8px 0;
  }

  button {
    padding: 12px 20px;
    font-size: 0.85rem;
    color: #636E72;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-weight: 500;
    min-height: 44px;
    width: 100%;
    font-family: inherit;

    svg { opacity: 0.7; }

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
