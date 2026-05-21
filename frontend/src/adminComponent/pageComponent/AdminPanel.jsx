import React, { useState } from 'react';
import styled from 'styled-components';
import OrderReport from './OrderReport';
import DeliveryReport from './DeliveryReport';
import Products from './Products';
import UsersReport from './Users';
import Contacts from './Contacts';
import MailPage from './Mail';
import Feedbacks from './Feedbacks';
import CompanyDetails from './CompanyDetails';
import Category from './Category';
import logo from '../../../public/logo.png';


import { 
  LayoutDashboard, ShoppingCart, Truck, Mail, Package, Users, 
  ChevronRight, LogOut, Building2, Tag, Star
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');

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

  return (
    <AdminWrapper>
      <Sidebar>
   <LogoSection href="/">
          <img src={logo} alt="Elsa Premium Dairy" />
        </LogoSection>

        <MenuSection>
          {menuOptions.map((item) => (
            <MenuItem 
              key={item.id} 
              $active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeTab === item.id && <div className="active-pill" />}
            </MenuItem>
          ))}
        </MenuSection>

        <FooterSection>
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </FooterSection>
      </Sidebar>

      <MainContent>
        <Header>
          <h2>{menuOptions.find(m => m.id === activeTab)?.label}</h2>
          <div className="user-profile">
            <div className="admin-info">
              <span className="name">Archana</span>
              <span className="role">Administrator</span>
            </div>
            <div className="avatar">A</div>
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
`;

const Sidebar = styled.aside`
  width: 280px; background-color: #FFFFFF;
  border-right: 1px solid #EAE3D6;
  display: flex; flex-direction: column;
  position: fixed; height: 100vh;
`;


const LogoSection = styled.a`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  padding: 20px;
  
  img {
    height: 120px; 
    width: auto;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const MenuSection = styled.div`flex: 1; padding: 0 20px; overflow-y: auto;`;

const MenuItem = styled.div`
  display: flex; align-items: center; gap: 15px;
  padding: 14px 20px; border-radius: 12px; margin-bottom: 4px;
  cursor: pointer; position: relative; transition: all 0.3s ease;
  background: ${props => props.$active ? '#EAE3D6' : 'transparent'};
  color: ${props => props.$active ? '#2A1F10' : '#8A7B6D'};
  font-weight: ${props => props.$active ? '700' : '500'};

  &:hover { background: ${props => props.$active ? '#EAE3D6' : '#F5F2EE'}; color: #2A1F10; }
  .active-pill {
    position: absolute; right: 15px; width: 6px; height: 6px;
    background: #B8935A; border-radius: 50%;
  }
`;

const FooterSection = styled.div`
  padding: 25px;
  .logout-btn {
    width: 100%; padding: 12px; display: flex; align-items: center; gap: 12px;
    border: none; background: #2A1F10; color: #FFF; border-radius: 12px; 
    font-weight: 700; cursor: pointer; transition: 0.3s;
    &:hover { background: #B8935A; }
  }
`;

const MainContent = styled.main`flex: 1; margin-left: 280px; padding: 40px;`; 

const Header = styled.header`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
  h2 { font-family: 'Playfair Display'; font-size: 2rem; color: #2A1F10; }
  .user-profile {
    display: flex; align-items: center; gap: 15px;
    .admin-info { display: flex; flex-direction: column; align-items: flex-end;
      .name { font-weight: 700; color: #2A1F10; }
      .role { font-size: 0.8rem; color: #B8935A; }
    }
    .avatar {
      width: 45px; height: 45px; background: #2A1F10; color: #B8935A; 
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-family: 'Playfair Display';
    }
  }
`;

const ContentBody = styled.div`
  background: white; min-height: 500px; border-radius: 20px;
  padding: 40px; border: 1px solid #EAE3D6;
  box-shadow: 0 4px 20px rgba(42,31,16,0.05);
`;

export default AdminPanel;