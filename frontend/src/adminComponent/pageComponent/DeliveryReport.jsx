import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Users,
  Search,
  ChevronRight
} from 'lucide-react';

const DeliveryReport = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRegularOnly, setShowRegularOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data specifically for Elsa Diary logistics
  const [deliveries] = useState([
    { id: "DLV-901", customer: "Siddharth Rana", address: "Parsyang, Pokhara", type: "Subscription", item: "2L Whole Milk", status: "delivered", time: "06:45 AM" },
    { id: "DLV-902", customer: "Anjali Joshi", address: "Lakeside, Pokhara", type: "One-time", item: "1kg Paneer", status: "in-transit", time: "Pending" },
    { id: "DLV-903", customer: "Kiran KC", address: "Bagar, Pokhara", type: "Subscription", item: "1L Skimmed Milk", status: "delayed", time: "Expected 08:30 AM" },
    { id: "DLV-904", customer: "Archana Timilsina", address: "Bhaktapur", type: "Subscription", item: "500ml Milk", status: "delivered", time: "07:00 AM" },
    { id: "DLV-905", customer: "Bibek Thapa", address: "Chorepatan", type: "One-time", item: "2L Curd", status: "in-transit", time: "Pending" },
  ]);

  // Combined Logic: Search + Status Filter + Regular User Filter
  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch = d.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeFilter === 'all' ? true : d.status === activeFilter;
    const matchesType = showRegularOnly ? d.type === 'Subscription' : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Container className="page-fade-in">
      {/* 1. TOP SUMMARY CARDS */}
      <SummaryGrid>
        <StatCard color="#7DAACB">
          <div className="icon-box"><Truck size={24}/></div>
          <div>
            <p>Today's Total</p>
            <h3>{deliveries.length}</h3>
          </div>
        </StatCard>
        <StatCard color="#27ae60">
          <div className="icon-box"><Users size={24}/></div>
          <div>
            <p>Regular Subs</p>
            <h3>{deliveries.filter(d => d.type === 'Subscription').length}</h3>
          </div>
        </StatCard>
        <StatCard color="#f39c12">
          <div className="icon-box"><Clock size={24}/></div>
          <div>
            <p>Pending</p>
            <h3>{deliveries.filter(d => d.status === 'in-transit').length}</h3>
          </div>
        </StatCard>
      </SummaryGrid>

      {/* 2. ENHANCED CONTROL BAR */}
      <ControlBar>
        <div className="left-group">
          <div className="date-display">
            <Calendar size={18} />
            <span>April 10, 2026</span>
          </div>

          <SearchBox>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          <RegularToggle 
            $active={showRegularOnly} 
            onClick={() => setShowRegularOnly(!showRegularOnly)}
          >
            <Users size={16} />
            {showRegularOnly ? "Regular Users Only" : "All Customers"}
          </RegularToggle>
        </div>

        <FilterButtons>
          {['all', 'delivered', 'in-transit', 'delayed'].map(f => (
            <button 
              key={f} 
              className={activeFilter === f ? 'active' : ''} 
              onClick={() => setActiveFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </FilterButtons>
      </ControlBar>

      {/* 3. DELIVERY LIST TABLE */}
      <TableWrapper>
        <ReportTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Type</th>
              <th>Deliverables</th>
              <th>Status</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map(item => (
                <tr key={item.id}>
                  <td className="id-cell">#{item.id}</td>
                  <td>
                    <CustomerInfo>
                      <strong>{item.customer}</strong>
                      <span><MapPin size={12}/> {item.address}</span>
                    </CustomerInfo>
                  </td>
                  <td>
                    <TypeBadge $isSub={item.type === 'Subscription'}>
                      {item.type}
                    </TypeBadge>
                  </td>
                  <td className="item-cell">{item.item}</td>
                  <td>
                    <StatusTag $status={item.status}>
                      {item.status.replace('-', ' ')}
                    </StatusTag>
                  </td>
                  <td className="time-cell">{item.time}</td>
                  <td><ChevronRight size={18} color="#b2bec3" /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  No deliveries found matching these filters.
                </td>
              </tr>
            )}
          </tbody>
        </ReportTable>
      </TableWrapper>
    </Container>
  );
};

// --- STYLED COMPONENTS ---

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);

  .icon-box {
    background: ${props => props.color}15;
    color: ${props => props.color};
    padding: 14px;
    border-radius: 12px;
  }

  p { font-size: 0.8rem; color: #b2bec3; margin: 0; font-weight: 600; text-transform: uppercase; }
  h3 { font-size: 1.6rem; color: #2d3436; margin: 2px 0 0 0; }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);

  .left-group { display: flex; align-items: center; gap: 15px; }
  
  .date-display {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #2d3436;
    font-size: 0.9rem;
    padding-right: 15px;
    border-right: 2px solid #f1f2f6;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 8px 14px;
  border-radius: 10px;
  gap: 8px;
  width: 240px;
  
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.85rem;
    width: 100%;
    &::placeholder { color: #b2bec3; }
  }
  color: #b2bec3;
`;

const RegularToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 2px solid ${props => props.$active ? '#7DAACB' : '#f1f2f6'};
  background: ${props => props.$active ? '#f0f7fc' : 'white'};
  color: ${props => props.$active ? '#7DAACB' : '#636e72'};
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { border-color: #7DAACB; }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  button {
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid #f1f2f6;
    background: white;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    color: #636e72;
    &.active { background: #2d3436; color: white; border-color: #2d3436; }
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
`;

const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 18px 24px;
    background: #fcfcfd;
    color: #b2bec3;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #f1f2f6;
  }

  td {
    padding: 18px 24px;
    border-bottom: 1px solid #f8f9fa;
    font-size: 0.9rem;
    color: #2d3436;
  }

  .id-cell { font-weight: 800; color: #7DAACB; }
  .item-cell { color: #636e72; font-size: 0.85rem; }
  .time-cell { font-weight: 700; }
  .empty-state { text-align: center; padding: 60px; color: #b2bec3; font-style: italic; }
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-size: 0.75rem;
    color: #b2bec3;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }
`;

const TypeBadge = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  background: ${props => props.$isSub ? '#f0f7fc' : '#f1f2f6'};
  color: ${props => props.$isSub ? '#7DAACB' : '#636e72'};
`;

const StatusTag = styled.span`
  font-weight: 800;
  font-size: 0.7rem;
  padding: 6px 14px;
  border-radius: 20px;
  text-transform: uppercase;
  background: ${props => {
    if (props.$status === 'delivered') return '#d1f2eb';
    if (props.$status === 'in-transit') return '#fff9db';
    if (props.$status === 'delayed') return '#ffd7d7';
    return '#f1f2f6';
  }};
  color: ${props => {
    if (props.$status === 'delivered') return '#1abc9c';
    if (props.$status === 'in-transit') return '#f39c12';
    if (props.$status === 'delayed') return '#e74c3c';
    return '#b2bec3';
  }};
`;

export default DeliveryReport;