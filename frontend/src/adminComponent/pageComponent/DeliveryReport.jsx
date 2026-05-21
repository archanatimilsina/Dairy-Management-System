import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Truck, MapPin, Clock, Calendar, Search, ChevronRight, Phone, Package } from 'lucide-react';
import useApi from '../../hooks/useApi';

const DeliveryReport = () => {
  const { get } = useApi();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      const result = await get('order/listCreate/');
      if (result.success) setOrders(result.data);
      setLoading(false);
    };
    fetchDeliveries();
  }, [get]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id?.toString().includes(searchTerm);
    const matchesStatus = activeFilter === 'all' ? true : order.delivery_status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingWrapper><Truck className="spin" /> Syncing Logistics...</LoadingWrapper>;

  return (
    <Container>
      <Header>
        <h1>Logistics & Delivery</h1>
        <p>Real-time tracking of physical orders and fulfillment.</p>
      </Header>

      <SummaryGrid>
        <StatCard>
          <div className="icon-box"><Package size={20}/></div>
          <div>
            <p>Total Orders</p>
            <h3>{orders.length}</h3>
          </div>
        </StatCard>
        <StatCard>
          <div className="icon-box"><Truck size={20}/></div>
          <div>
            <p>In Transit</p>
            <h3>{orders.filter(o => o.delivery_status === 'delivering').length}</h3>
          </div>
        </StatCard>
        <StatCard>
          <div className="icon-box"><Clock size={20}/></div>
          <div>
            <p>Pending</p>
            <h3>{orders.filter(o => o.delivery_status === 'pending').length}</h3>
          </div>
        </StatCard>
      </SummaryGrid>

      <ControlBar>
        <SearchBox>
          <Search size={16} />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </SearchBox>
        <FilterButtons>
          {['all', 'pending', 'delivering', 'success', 'delayed'].map(f => (
            <button key={f} className={activeFilter === f ? 'active' : ''} onClick={() => setActiveFilter(f)}>
              {f.toUpperCase()}
            </button>
          ))}
        </FilterButtons>
      </ControlBar>

      <TableWrapper>
        <ReportTable>
          <thead>
            <tr>
              <th>Order Details</th>
              <th>Deliverables</th>
              <th>Type</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <CustomerInfo>
                      <strong>{order.full_name}</strong>
                      <span className="sub"><MapPin size={10}/> {order.location}</span>
                    </CustomerInfo>
                  </td>
                  <td>
                    <ItemList>
                      {order.items?.map((item, idx) => <span key={idx}>{item.product_name}</span>)}
                    </ItemList>
                  </td>
                  <td><TypeBadge>{order.order_type}</TypeBadge></td>
                  <td><StatusTag $status={order.delivery_status}>{order.delivery_status}</StatusTag></td>
                  <td className="time">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="empty">No deliveries found.</td></tr>
            )}
          </tbody>
        </ReportTable>
      </TableWrapper>
    </Container>
  );
};

const Container = styled.div` font-family: 'DM Sans', sans-serif; `;
const Header = styled.div` margin-bottom: 30px; h1 { font-size: 1.8rem; color: #2A1F10; } p { color: #8A7B6D; font-size: 0.9rem; } `;
const SummaryGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; `;
const StatCard = styled.div` background: white; padding: 20px; border-radius: 16px; border: 1px solid #EAE3D6; display: flex; align-items: center; gap: 15px; .icon-box { background: #F5F2EE; color: #B8935A; padding: 12px; border-radius: 12px; } p { font-size: 0.75rem; color: #8A7B6D; text-transform: uppercase; margin: 0; } h3 { font-size: 1.5rem; color: #2A1F10; margin: 0; } `;
const ControlBar = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 20px; `;
const SearchBox = styled.div` display: flex; align-items: center; background: white; padding: 10px 15px; border-radius: 12px; border: 1px solid #EAE3D6; gap: 10px; color: #8A7B6D; input { border: none; outline: none; width: 200px; } `;
const FilterButtons = styled.div` display: flex; gap: 5px; button { padding: 8px 15px; border-radius: 10px; border: none; background: #F5F2EE; color: #8A7B6D; font-size: 0.75rem; font-weight: 700; cursor: pointer; &.active { background: #2A1F10; color: white; } } `;
const TableWrapper = styled.div` background: white; border-radius: 20px; border: 1px solid #EAE3D6; overflow: hidden; `;
const ReportTable = styled.table` width: 100%; border-collapse: collapse; th { text-align: left; padding: 20px; color: #8A7B6D; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #F5F2EE; } td { padding: 20px; border-bottom: 1px solid #F5F2EE; } .time { color: #8A7B6D; font-size: 0.85rem; } .empty { text-align: center; padding: 40px; color: #8A7B6D; } `;
const CustomerInfo = styled.div` .name { display: block; font-weight: 700; color: #2A1F10; } .sub { font-size: 0.75rem; color: #B8935A; display: flex; align-items: center; gap: 4px; } `;
const ItemList = styled.div` display: flex; flex-direction: column; gap: 4px; span { font-size: 0.8rem; color: #666; } `;
const TypeBadge = styled.span` padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; background: #F5F2EE; color: #2A1F10; `;
const StatusTag = styled.span` font-weight: 700; font-size: 0.75rem; text-transform: uppercase; color: ${props => props.$status === 'success' ? '#27ae60' : '#B8935A'}; `;
const LoadingWrapper = styled.div` height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: #8A7B6D; @keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; } `;

export default DeliveryReport;