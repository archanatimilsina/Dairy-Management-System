import React, { useState } from 'react';
import styled from 'styled-components';
import { Trash2, Smartphone, Wallet, CheckCircle, Clock, Truck, Plus, X, Mail, Phone, Package } from 'lucide-react';

const OrdersReport = () => {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const productOptions = [
    { id: 1, name: "Whole Milk (1L)", price: 120 },
    { id: 2, name: "Skimmed Milk (1L)", price: 110 },
    { id: 3, name: "Paneer (500g)", price: 450 },
    { id: 4, name: "Curd (1L)", price: 150 },
    { id: 5, name: "Ghee (500g)", price: 800 },
  ];

  const [orders, setOrders] = useState([
    { id: "ORD-101", customer: "Ram Prasad", email: "ram@email.com", phone: "9841223344", item: "Whole Milk (1L)", payment: "eSewa", amount: "Rs. 120", status: "taken" },
  ]);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    email: "",
    phone: "",
    selectedProducts: [],
    payment: "Physical"
  });

  const totalPrice = newOrder.selectedProducts.reduce((sum, pName) => {
    const product = productOptions.find(p => p.name === pName);
    return sum + (product ? product.price : 0);
  }, 0);

  const handleProductToggle = (productName) => {
    setNewOrder(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productName)
        ? prev.selectedProducts.filter(p => p !== productName)
        : [...prev.selectedProducts, productName]
    }));
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const orderObj = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customer: newOrder.customer,
      email: newOrder.email,
      phone: newOrder.phone,
      item: newOrder.selectedProducts.join(", "),
      payment: newOrder.payment,
      amount: `Rs. ${totalPrice}`,
      status: "taken"
    };

    setOrders([orderObj, ...orders]);
    setIsModalOpen(false);
    setNewOrder({ customer: "", email: "", phone: "", selectedProducts: [], payment: "Physical" });
  };

  const removeOrder = (id) => setOrders(orders.filter(order => order.id !== id));
  
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.payment.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="page-fade-in">
      <TopHeader>
        <FilterBar>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'esewa' ? 'active' : ''} onClick={() => setFilter('esewa')}><Smartphone size={14}/> eSewa</button>
          <button className={filter === 'physical' ? 'active' : ''} onClick={() => setFilter('physical')}><Wallet size={14}/> Physical</button>
        </FilterBar>

        <CreateBtn onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New Order
        </CreateBtn>
      </TopHeader>

      <OrderGrid>
        {filteredOrders.map(order => (
          <OrderCard key={order.id}>
            <div className="card-header">
              <span className="order-id">{order.id}</span>
              <button className="delete-btn" onClick={() => removeOrder(order.id)}><Trash2 size={18}/></button>
            </div>
            
            <div className="order-info">
              <h4>{order.customer}</h4>
              <p className="contact-details">{order.email} | {order.phone}</p>
              <p className="item">{order.item}</p>
              <div className="payment-tag">{order.payment}</div>
            </div>

            <div className="price-section">
              <span className="amount">{order.amount}</span>
            </div>

            <StatusControl>
              {['taken', 'delivering', 'success'].map(s => (
                <button 
                  key={s}
                  className={order.status === s ? `active ${s}` : ''} 
                  onClick={() => updateStatus(order.id, s)}
                >
                  {s === 'taken' && <Clock size={14}/>}
                  {s === 'delivering' && <Truck size={14}/>}
                  {s === 'success' && <CheckCircle size={14}/>}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </StatusControl>
          </OrderCard>
        ))}
      </OrderGrid>

      {/* CREATE ORDER MODAL */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalCard>
            <ModalHeader>
              <h3>New Dairy Order</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </ModalHeader>
            <form onSubmit={handleCreateOrder}>
              <FormBody>
                <InputGroup>
                  <label><Plus size={14}/> Customer Name</label>
                  <input type="text" required value={newOrder.customer} onChange={(e)=>setNewOrder({...newOrder, customer: e.target.value})} placeholder="Archana ..." />
                </InputGroup>
                
                <div style={{display: 'flex', gap: '15px'}}>
                   <InputGroup style={{flex: 1}}>
                    <label><Mail size={14}/> Email</label>
                    <input type="email" required value={newOrder.email} onChange={(e)=>setNewOrder({...newOrder, email: e.target.value})} placeholder="name@example.com" />
                  </InputGroup>
                  <InputGroup style={{flex: 1}}>
                    <label><Phone size={14}/> Contact</label>
                    <input type="tel" required value={newOrder.phone} onChange={(e)=>setNewOrder({...newOrder, phone: e.target.value})} placeholder="98XXXXXXXX" />
                  </InputGroup>
                </div>

                <InputGroup>
                  <label><Package size={14}/> Select Products (Multi-select)</label>
                  <ProductList>
                    {productOptions.map(p => (
                      <ProductItem 
                        key={p.id} 
                        $selected={newOrder.selectedProducts.includes(p.name)}
                        onClick={() => handleProductToggle(p.name)}
                      >
                        {p.name} <span>Rs.{p.price}</span>
                      </ProductItem>
                    ))}
                  </ProductList>
                </InputGroup>

                <PriceSummary>
                  <span>Total Amount:</span>
                  <strong>Rs. {totalPrice}</strong>
                </PriceSummary>
              </FormBody>
              <ModalFooter>
                <button type="submit" className="submit-btn" disabled={newOrder.selectedProducts.length === 0}>Confirm Order</button>
              </ModalFooter>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </div>
  );
};


const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const CreateBtn = styled.button`
  background: #2d3436;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  &:hover { background: #7DAACB; }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 5px;
`;

const ProductItem = styled.div`
  padding: 10px;
  border: 2px solid ${props => props.$selected ? '#7DAACB' : '#f1f2f6'};
  background: ${props => props.$selected ? '#f0f7fc' : 'white'};
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  span { color: #b2bec3; font-size: 0.75rem; }
`;

const PriceSummary = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  strong { font-size: 1.2rem; color: #2d3436; }
`;

const ModalOverlay = styled.div`
  position: fixed; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalCard = styled.div`
  background: white; width: 500px; border-radius: 24px; padding: 30px;
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 20px;
  button { background: none; border: none; cursor: pointer; color: #b2bec3; }
`;

const FormBody = styled.div` display: flex; flex-direction: column; gap: 15px; `;

const InputGroup = styled.div`
  label { font-size: 0.8rem; font-weight: 700; color: #2d3436; margin-bottom: 5px; display: block; }
  input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #eee; outline: none; }
`;

const ModalFooter = styled.div`
  margin-top: 25px;
  .submit-btn { width: 100%; padding: 14px; background: #2d3436; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.5; }}
`;

const FilterBar = styled.div`
  display: flex; gap: 10px;
  button { padding: 8px 16px; border-radius: 10px; border: 1px solid #eee; background: white; cursor: pointer; font-weight: 600;
    &.active { background: #7DAACB; color: white; border-color: #7DAACB; }
  }
`;

const OrderGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; `;

const OrderCard = styled.div`
  background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  .card-header { display: flex; justify-content: space-between; margin-bottom: 10px; .order-id { font-size: 0.75rem; color: #b2bec3; font-weight: 800; }}
  h4 { margin: 0; color: #2d3436; }
  .contact-details { font-size: 0.75rem; color: #b2bec3; margin: 4px 0; }
  .item { font-size: 0.85rem; color: #636e72; margin: 10px 0; }
  .payment-tag { font-size: 0.7rem; font-weight: 700; color: #7DAACB; background: #f0f7fc; padding: 4px 8px; border-radius: 6px; display: inline-block; }
  .price-section { margin: 15px 0; font-size: 1.2rem; font-weight: 800; }
`;

const StatusControl = styled.div`
  display: flex; background: #f1f2f6; padding: 4px; border-radius: 12px; gap: 4px;
  button { flex: 1; border: none; padding: 6px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer; color: #b2bec3; background: transparent;
    &.active.taken { background: white; color: #f39c12; }
    &.active.delivering { background: white; color: #3498db; }
    &.active.success { background: white; color: #27ae60; }
  }
`;

export default OrdersReport;