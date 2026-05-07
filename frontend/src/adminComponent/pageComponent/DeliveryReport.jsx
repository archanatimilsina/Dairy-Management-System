import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Calendar,
  Search,
  ChevronRight,
  Phone,
  Package
} from 'lucide-react';
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
      console.log(result)
      if (result.success) setOrders(result.data);
      setLoading(false);
    };
    fetchDeliveries();
  }, [get]);


  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toString().includes(searchTerm);
    const matchesStatus = activeFilter === 'all' ? true : order.delivery_status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingWrapper><Truck className="spin" /> Syncing Logistics...</LoadingWrapper>;

  return (
    <Container className="page-fade-in">
      <Header>
        <h1>Logistics & Delivery Updates</h1>
        <p>Real-time tracking of physical orders and subscription fulfillments.</p>
      </Header>

    
      <SummaryGrid>
        <StatCard color="#7DAACB">
          <div className="icon-box"><Package size={24}/></div>
          <div>
            <p>Total Orders</p>
            <h3>{orders.length}</h3>
          </div>
        </StatCard>
        <StatCard color="#27ae60">
          <div className="icon-box"><Truck size={24}/></div>
          <div>
            <p>In Transit</p>
            <h3>{orders.filter(o => o.delivery_status === 'delivering').length}</h3>
          </div>
        </StatCard>
        <StatCard color="#f39c12">
          <div className="icon-box"><Clock size={24}/></div>
          <div>
            <p>Pending Pickup</p>
            <h3>{orders.filter(o => o.delivery_status === 'pending').length}</h3>
          </div>
        </StatCard>
      </SummaryGrid>

    
      <ControlBar>
        <div className="left-group">
          <div className="date-display">
            <Calendar size={18} />
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <SearchBox>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
        </div>

        <FilterButtons>
          {['all', 'pending', 'delivering', 'success', 'delayed'].map(f => (
            <button 
              key={f} 
              className={activeFilter === f ? 'active' : ''} 
              onClick={() => setActiveFilter(f)}
            >
              {f === 'success' ? 'Delivered' : f.replace('delivering', 'In Transit').toUpperCase()}
            </button>
          ))}
        </FilterButtons>
      </ControlBar>

   
      <TableWrapper>
        <ReportTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer & Location</th>
              <th>Deliverables</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="id-cell">{order.id}</td>
                  <td>
                    <CustomerInfo>
                      <strong>{order.full_name}</strong>
                      <span className="sub-text"><MapPin size={12}/> {order.location}</span>
                      <span className="sub-text"><Phone size={12}/> {order.contact_number}</span>
                    </CustomerInfo>
                  </td>
                  <td>
                    <ItemList>
                      {order.items?.map((item, idx) => (
                        <span key={idx}>{item.quantity}{item.unit} {item.product_name}</span>
                      ))}
                    </ItemList>
                  </td>
                  <td>
                    <TypeBadge $type={order.order_type}>
                      {order.order_type}
                    </TypeBadge>
                  </td>
                  <td>
                    <StatusTag $status={order.delivery_status}>
                      {order.delivery_status.replace('success', 'delivered').replace('delivering', 'in transit')}
                    </StatusTag>
                  </td>
                  <td className="time-cell">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td><ChevronRight size={18} color="#b2bec3" /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">No orders found.</td>
              </tr>
            )}
          </tbody>
        </ReportTable>
      </TableWrapper>
    </Container>
  );
};



const Container = styled.div` max-width: 1200px; margin: 0 auto; padding: 20px; `;
const Header = styled.div` margin-bottom: 30px; h1 { font-size: 24px; color: #2d3436; margin-bottom: 5px; } p { color: #636e72; font-size: 14px; } `;
const SummaryGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; `;
const StatCard = styled.div` background: white; padding: 20px; border-radius: 16px; display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); .icon-box { background: ${props => props.color}15; color: ${props => props.color}; padding: 12px; border-radius: 10px; } p { font-size: 12px; color: #b2bec3; margin: 0; text-transform: uppercase; font-weight: 700; } h3 { font-size: 22px; color: #2d3436; margin: 0; } `;
const ControlBar = styled.div` display: flex; justify-content: space-between; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px; .left-group { display: flex; gap: 20px; align-items: center; } .date-display { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; border-right: 2px solid #f1f2f6; padding-right: 20px; } `;
const SearchBox = styled.div` display: flex; align-items: center; background: #f8f9fa; padding: 8px 12px; border-radius: 8px; gap: 8px; input { border: none; background: transparent; outline: none; font-size: 14px; width: 180px; } color: #b2bec3; `;
const FilterButtons = styled.div` display: flex; gap: 5px; button { padding: 6px 12px; border-radius: 8px; border: 1px solid #f1f2f6; background: white; font-size: 11px; font-weight: 700; cursor: pointer; &.active { background: #2d3436; color: white; } } `;
const TableWrapper = styled.div` background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); `;
const ReportTable = styled.table` width: 100%; border-collapse: collapse; th { text-align: left; padding: 15px 20px; background: #fcfcfd; color: #b2bec3; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #f1f2f6; } td { padding: 15px 20px; border-bottom: 1px solid #f8f9fa; font-size: 14px; } .id-cell { font-weight: 700; color: #7DAACB; } .time-cell { font-size: 12px; color: #636e72; } .empty-state { text-align: center; padding: 40px; color: #b2bec3; } `;
const CustomerInfo = styled.div` display: flex; flex-direction: column; .sub-text { font-size: 11px; color: #b2bec3; display: flex; align-items: center; gap: 4px; margin-top: 2px; } `;
const ItemList = styled.div` display: flex; flex-direction: column; gap: 2px; span { font-size: 12px; background: #f8f9fa; padding: 2px 8px; border-radius: 4px; width: fit-content; } `;
const TypeBadge = styled.span` padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; background: ${props => props.$type === 'Subscription' ? '#e3f2fd' : '#f1f2f6'}; color: ${props => props.$type === 'Subscription' ? '#1976d2' : '#636e72'}; `;
const StatusTag = styled.span` font-weight: 700; font-size: 10px; padding: 5px 12px; border-radius: 12px; text-transform: uppercase; background: ${props => {
    if (props.$status === 'success') return '#d1f2eb';
    if (props.$status === 'delivering') return '#fff9db';
    if (props.$status === 'delayed') return '#ffd7d7';
    if (props.$status === 'taken') return '#e8f4fd';
    return '#f1f2f6';
  }}; color: ${props => {
    if (props.$status === 'success') return '#1abc9c';
    if (props.$status === 'delivering') return '#f39c12';
    if (props.$status === 'delayed') return '#e74c3c';
    if (props.$status === 'taken') return '#3498db';
    return '#b2bec3';
  }}; `;
const LoadingWrapper = styled.div` height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #636e72; .spin { animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `;

export default DeliveryReport;