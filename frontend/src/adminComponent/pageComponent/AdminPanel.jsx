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

import { 
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  Mail, 
  Package, 
  Users, 
  ChevronRight,
  LogOut,
  MessageSquare,

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
    { id: 'feedbacks', label: 'Feedbacks',icon:<MessageSquare size={20}/>},
    { id: 'company_details', label: 'Company Details',icon:<MessageSquare size={20}/>},

  ];

  const renderContent =()=>
  {
    switch(activeTab){
      case 'orders':
        return <OrderReport />
      case 'delivery':
        return <DeliveryReport />
      case 'products':
        return <Products />
      case 'users':
        return <UsersReport />
      case 'contacts':
        return <Contacts />
      case 'feedbacks':
        return <Feedbacks />
      case 'mail':
        return <MailPage />
      case 'company_details':
        return <CompanyDetails />
      
    }

  }
  return (
    <AdminWrapper>
      <Sidebar>
        <LogoSection>
          <div className="logo-icon">🥛</div>
          <div className="logo-text">
            Elsa<span>Admin</span>
          </div>
        </LogoSection>

        <MenuSection>
          <p className="menu-label">Main Menu</p>
          {menuOptions.map((item) => (
            <MenuItem 
              key={item.id} 
              $active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="icon-label">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} className="arrow" />
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
            <span>Archana (Admin)</span>
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
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
`;

const LogoSection = styled.div`
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  .logo-icon {
    font-size: 1.5rem;
    background: #CFECF3;
    padding: 8px;
    border-radius: 12px;
  }
  .logo-text {
    font-size: 1.4rem;
    font-weight: 800;
    color: #2d3436;
    span { color: #7DAACB; }
  }
`;

const MenuSection = styled.div`
  flex: 1;
  padding: 0 20px;
  .menu-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #b2bec3;
    font-weight: 700;
    margin-bottom: 20px;
    padding-left: 10px;
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 14px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
 
  background: ${props => props.$active ? '#7DAACB' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#636e72'};

  .icon-label {
    display: flex;
    align-items: center;
    gap: 12px;
    span { font-weight: 600; font-size: 0.95rem; }
  }

  .arrow {
    opacity: ${props => props.$active ? 1 : 0};
    transform: translateX(${props => props.$active ? '0' : '-10px'});
    transition: 0.3s;
  }

  &:hover {
    background: ${props => props.$active ? '#7DAACB' : '#f1f2f6'};
    color: ${props => props.$active ? 'white' : '#2d3436'};
  }
`;

const FooterSection = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  .logout-btn {
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: #fff5f5;
    color: #ff7675;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    &:hover { background: #ffeaea; }
  }
 `;

 const MainContent = styled.main`
  flex: 1;
  margin-left: 280px; 
  padding: 30px;
`; 

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  h2 { font-size: 1.8rem; color: #2d3436; }
  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    span { font-weight: 600; color: #636e72; }
    .avatar {
      width: 40px; height: 40px;
      background: #7DAACB;
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800;
    }
  }
`;

const ContentBody = styled.div`
  background: white;
  min-height: 400px;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
`;


export default AdminPanel;