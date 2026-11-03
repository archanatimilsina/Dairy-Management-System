import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import OrderReport from './OrderReport';
import DeliveryReport from './DeliveryReport';
import Products from './Products';
import UsersReport from './Users';
import Contacts from './Contacts';
import MailPage from './Mail';
import Feedbacks from './Feedbacks';
import CompanyDetails from './CompanyDetails';
import Category from './Category';


import {
  LayoutDashboard, ShoppingCart, Truck, Mail, Package, Users,
  LogOut, Building2, Tag, Star, Menu, X
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [navOpen, setNavOpen] = useState(false);
  const adminName = localStorage.getItem("username") || 'Administrator';
  const logout = useLogout();

  const menuOptions = [
    { id: 'orders', label: 'Order Report', icon: <ShoppingCart size={20} /> },
    { id: 'delivery', label: 'Delivery Report', icon: <Truck size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'contacts', label: 'Contacts', icon: <LayoutDashboard size={20} /> },
    { id: 'mail', label: 'Send Mail', icon: <Mail size={20} /> },
    { id: 'feedbacks', label: 'Feedbacks', icon: <Star size={20} /> },
    { id: 'company_details', label: 'Company Details', icon: <Building2 size={20} /> },
    { id: 'category', label: 'Category', icon: <Tag size={20} /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'orders': return <OrderReport />;
      case 'delivery': return <DeliveryReport />;
      case 'products': return <Products />;
      case 'users': return <UsersReport />;
      case 'contacts': return <Contacts />;
      case 'feedbacks': return <Feedbacks />;
      case 'mail': return <MailPage />;
      case 'company_details': return <CompanyDetails />;
      case 'category': return <Category />;
      default: return <OrderReport />;
    }
  };

  const selectTab = (id) => {
    setActiveTab(id);
    setNavOpen(false);
  };

  return (
    <AdminWrapper>
      {navOpen && <Scrim onClick={() => setNavOpen(false)} aria-hidden="true" />}
      <Sidebar $open={navOpen}>
        <SidebarTop>
          <LogoLink to="/">
            <img src="/logo.png" alt="Elsa Premium Dairy" />
          </LogoLink>
          <CloseButton onClick={() => setNavOpen(false)} aria-label="Close admin menu">
            <X size={20} />
          </CloseButton>
        </SidebarTop>

        <MenuSection>
          {menuOptions.map((item) => (
            <MenuItem
              key={item.id}
              $active={activeTab === item.id}
              onClick={() => selectTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeTab === item.id && <div className="active-pill" />}
            </MenuItem>
          ))}
        </MenuSection>

        <FooterSection>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </FooterSection>
      </Sidebar>

      <MainContent>
        <Header>
          <HeaderLeft>
            <Hamburger onClick={() => setNavOpen(true)} aria-label="Open admin menu">
              <Menu size={20} />
            </Hamburger>
            <h2>{menuOptions.find(m => m.id === activeTab)?.label}</h2>
          </HeaderLeft>
          <div className="user-profile">
            <div className="admin-info">
              <span className="name">{adminName}</span>
              <span className="role">Administrator</span>
            </div>
            <div className="avatar">{adminName.charAt(0).toUpperCase()}</div>
          </div>
        </Header>

        <ContentBody>
          {renderContent()}
        </ContentBody>
      </MainContent>
    </AdminWrapper>
  );
};

const AdminWrapper = styled.div`
  display: flex; min-height: 100vh;
  background-color: #FAF7F2;
  font-family: 'DM Sans', sans-serif;
  min-width: 0;
`;

const Scrim = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(42, 31, 16, 0.45);
    z-index: 998;
  }
`;

const Sidebar = styled.aside`
  width: 280px; background-color: #FFFFFF;
  border-right: 1px solid #EAE3D6;
  display: flex; flex-direction: column;
  position: fixed; height: 100vh; height: 100dvh;
  top: 0; left: 0; z-index: 999;
  transition: transform 0.3s ease;

  @media (max-width: 1024px) {
    transform: ${(props) => (props.$open ? 'translateX(0)' : 'translateX(-100%)')};
    width: min(300px, 84vw);
  }
`;

const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0;
`;

const CloseButton = styled.button`
  display: none;
  width: 44px; height: 44px;
  border-radius: 12px;
  border: 1px solid #EAE3D6;
  background: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    display: inline-flex;
  }
`;


const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  padding: 4px;

  img {
    height: clamp(64px, 8vw, 110px);
    width: auto;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const MenuSection = styled.div`flex: 1; padding: 12px 20px; overflow-y: auto; min-height: 0;`;

const MenuItem = styled.div`
  display: flex; align-items: center; gap: 15px;
  padding: 14px 16px; border-radius: 12px; margin-bottom: 4px;
  cursor: pointer; position: relative; transition: all 0.3s ease;
  background: ${props => props.$active ? '#EAE3D6' : 'transparent'};
  color: ${props => props.$active ? '#2A1F10' : '#8A7B6D'};
  font-weight: ${props => props.$active ? '700' : '500'};
  min-height: 52px;

  &:hover { background: ${props => props.$active ? '#EAE3D6' : '#F5F2EE'}; color: #2A1F10; }
  .active-pill {
    position: absolute; right: 15px; width: 6px; height: 6px;
    background: #B8935A; border-radius: 50%;
  }
`;

const FooterSection = styled.div`
  padding: 20px 25px calc(20px + env(safe-area-inset-bottom));
  .logout-btn {
    width: 100%; padding: 14px 12px; display: flex; align-items: center; justify-content: center; gap: 12px;
    border: none; background: #2A1F10; color: #FFF; border-radius: 12px;
    font-weight: 700; cursor: pointer; transition: 0.3s; min-height: 52px; font-size: 1rem;
    &:hover { background: #B8935A; }
  }
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  margin-left: 280px;
  padding: clamp(20px, 4vw, 40px);

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const Hamburger = styled.button`
  display: none;
  width: 48px; height: 48px;
  border-radius: 12px;
  border: 1px solid #EAE3D6;
  background: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    display: inline-flex;
    flex-shrink: 0;
  }
`;

const Header = styled.header`
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  margin-bottom: clamp(20px, 4vw, 40px); flex-wrap: wrap;
  h2 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.4rem, 3vw, 2rem); color: #2A1F10; margin: 0; }
  .user-profile {
    display: flex; align-items: center; gap: 15px;
    .admin-info { display: flex; flex-direction: column; align-items: flex-end;
      .name { font-weight: 700; color: #2A1F10; max-width: 32vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .role { font-size: 0.8rem; color: #B8935A; }
    }
    .avatar {
      width: 45px; height: 45px; background: #2A1F10; color: #B8935A;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-family: 'Playfair Display', Georgia, serif; flex-shrink: 0;
    }
  }
`;

const ContentBody = styled.div`
  background: white; min-height: 500px; border-radius: 20px;
  padding: clamp(16px, 3vw, 40px); border: 1px solid #EAE3D6;
  box-shadow: 0 4px 20px rgba(42,31,16,0.05);
  min-width: 0;
  overflow-x: auto;
`;

export default AdminPanel;
