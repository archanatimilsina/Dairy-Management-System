import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  Smartphone, Wallet, MapPin, Plus, X, Mail, Phone, 
  Package, Minus, AlertCircle, Check, Ban, Search, Inbox, RefreshCcw, History
} from 'lucide-react';
import useApi from '../../hooks/useApi';

const OrdersReport = () => {
  const { get, post, patch } = useApi();

  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('pending'); 
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [orderInRequest, setOrderInRequest] = useState([]);

  const [newOrder, setNewOrder] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    location: "", 
    order_type: "Physical",
    delivery_fee: 0,
    admin_note: "",
    items: [], 
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await get('product/listCreate/');
      if (result.success) {
        setProductOptions(result.data);
      }
    };
    if (isModalOpen) fetchProducts();
  }, [isModalOpen, get]);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await get('order/listCreate/');
      if (result.success) {     
        setOrders(result.data);   
        const accepted = result.data.filter(order => order.order_status === "accepted");
        const pendingOrRejected = result.data.filter(order => order.order_status !== "accepted");
        setAcceptedOrders(accepted); 
        setOrderInRequest(pendingOrRejected);
      }
    };
    fetchOrders();
  }, [get]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const payload = { ...newOrder, total_amount: finalTotal };
    const result = await post('order/listCreate/', payload);
    if (result.success) {
      const refresh = await get('order/listCreate/');
      if (refresh.success) {
        setOrders(refresh.data);
      }
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewOrder({
      full_name: "", email: "", contact_number: "", location: "",
      order_type: "Physical", delivery_fee: 0, admin_note: "", items: [], 
    });
  };

  const handleProductToggle = (product) => {
    const exists = newOrder.items.find(item => item.product === product.id);
    if (exists) {
      setNewOrder({ ...newOrder, items: newOrder.items.filter(item => item.product !== product.id) });
    } else {
      setNewOrder({ ...newOrder, items: [...newOrder.items, { product: product.id, product_name: product.product_name, quantity: 1, unit: product.unit, price_at_purchase: product.price }] });
    }
  };

  const updateQuantity = (productId, delta) => {
    setNewOrder({ ...newOrder, items: newOrder.items.map(item => item.product === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item) });
  };

  const acceptOrder = async (orderId) => {
    const result = await patch(`order/detail/${orderId}`, { order_status: "accepted" });
    if (result.success) {
      const refresh = await get('order/listCreate/');
      if (refresh.success) {
        setOrders(refresh.data);
        setAcceptedOrders(refresh.data.filter(o => o.order_status === "accepted"));
        setOrderInRequest(refresh.data.filter(o => o.order_status !== "accepted"));
      }
      setIsRequestDrawerOpen(false);
    }
  };

  const rejectRequest = async (orderId) => {
    const result = await patch(`order/detail/${orderId}`, { order_status: "rejected" });
    if (result.success) {
      const refresh = await get('order/listCreate/');
      if (refresh.success) {
        setOrders(refresh.data);
        setOrderInRequest(refresh.data.filter(o => o.order_status !== "accepted"));
      }
    }
  };

  const resolveOrder = async (orderId) => {
    const result = await patch(`order/detail/${orderId}`, { order_status: "resolved" });
    if (result.success) {
      const refresh = await get('order/listCreate/');
      if (refresh.success) {
        setOrders(refresh.data);
        setOrderInRequest(refresh.data.filter(o => o.order_status !== "accepted"));
      }
    }
  };

  const itemsTotal = newOrder.items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
  const finalTotal = itemsTotal + Number(newOrder.delivery_fee);

  const pendingRequestsCount = orderInRequest.filter(o => o.order_status === 'pending').length;
  const filteredOrders = acceptedOrders.filter(o => {
    if (filter === 'all') return true;
    return o.order_type === filter;
  });

  const displayRequestOrders = orderInRequest.filter(o => 
    drawerTab === 'pending' ? o.order_status === 'pending' : o.order_status === 'rejected'
  );

  return (
    <Container>
      <SectionHeader>
        <div>
          <h1>Order Management</h1>
          <p>Monitor transactions and manage store deliveries.</p>
        </div>
        <ActionButtons>
          <RequestBtn onClick={() => setIsRequestDrawerOpen(true)}>
            <Inbox size={18} /> Order Requests
            {pendingRequestsCount > 0 && <span className="count">{pendingRequestsCount}</span>}
          </RequestBtn>
          <CreateBtn onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Order
          </CreateBtn>
        </ActionButtons>
      </SectionHeader>

      <ControlRow>
        <FilterBar>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Orders</button>
          <button className={filter === 'Physical' ? 'active' : ''} onClick={() => setFilter('Physical')}><Wallet size={14}/> Cash</button>
          <button className={filter === 'eSewa' ? 'active' : ''} onClick={() => setFilter('eSewa')}><Smartphone size={14}/> eSewa</button>
        </FilterBar>
        <SearchBar><Search size={16} /><input type="text" placeholder="Search orders..." /></SearchBar>
      </ControlRow>

      <OrderGrid>
        {filteredOrders.map(order => (
          <OrderCard key={order.id}>
            <div className="card-header">
              <span className="order-id">ORD-{order.id}</span>
              <StatusTag className={order.delivery_status}>{order.delivery_status}</StatusTag>
            </div>
            <div className="order-info">
              <h4>{order.full_name}</h4>
              <div className="details-list">
                <p className="contact-details"><Mail size={12}/> {order.email}</p>
                <p className="contact-details"><Phone size={12}/> {order.contact_number}</p>
                <p className="contact-details"><MapPin size={12}/> {order.location || "Store Pickup"}</p>
              </div>
              <ItemsPreview>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span>{item.quantity}× {item.product_name}</span>
                    <span>Rs. {item.price_at_purchase * item.quantity}</span>
                  </div>
                ))}
              </ItemsPreview>
            </div>
            <PriceSection>
              <div className="payment-block"><span className="method-label">Payment</span><div className="payment-tag">{order.order_type}</div></div>
              <div className="total-block"><span className="total-label">Grand Total</span><div className="amount">Rs. {order.total_amount}</div></div>
            </PriceSection>
          </OrderCard>
        ))}
      </OrderGrid>

      {isRequestDrawerOpen && (
        <DrawerOverlay onClick={() => setIsRequestDrawerOpen(false)}>
          <DrawerContent onClick={(e) => e.stopPropagation()}>
            <DrawerHeader>
              <div>
                <h2>Resolution Center</h2>
                <p>Manage new requests and audit rejected orders</p>
              </div>
              <CloseButton onClick={() => setIsRequestDrawerOpen(false)}><X size={24}/></CloseButton>
            </DrawerHeader>

            <TabSwitcher>
              <TabButton active={drawerTab === 'pending'} onClick={() => setDrawerTab('pending')}>
                <Inbox size={16}/> Pending ({pendingRequestsCount})
              </TabButton>
              <TabButton active={drawerTab === 'rejected'} onClick={() => setDrawerTab('rejected')}>
                <History size={16}/> Rejected Logs
              </TabButton>
            </TabSwitcher>

            <RequestList>
              {displayRequestOrders.length > 0 ? (
                displayRequestOrders.map(order => (
                  <RequestItem key={order.id} isRejected={order.order_status === 'rejected'}>
                    <div className="req-head">
                      <strong>{order.full_name}</strong>
                      <span>#{order.id}</span>
                    </div>
                    <p className="req-sub">Contact: {order.contact_number}</p>
                    <ItemsPreview>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <span>{item.quantity}x {item.product_name}</span>
                        </div>
                      ))}
                    </ItemsPreview>
                    <div className="req-total">Total: Rs. {order.total_amount}</div>
                    
                    <RequestActions>
                      {order.order_status === 'pending' ? (
                        <>
                          <button className="decline" onClick={() => rejectRequest(order.id)}><Ban size={14}/> Reject</button>
                          <button className="accept" onClick={() => acceptOrder(order.id)}><Check size={14}/> Accept Order</button>
                        </>
                      ) : (
                        <button className="resolve" onClick={() => resolveOrder(order.id)}>
                          <RefreshCcw size={14}/> Mark as Resolved
                        </button>
                      )}
                    </RequestActions>
                  </RequestItem>
                ))
              ) : (
                <EmptyRequests>
                  <AlertCircle size={40} />
                  <p>No items in {drawerTab} list</p>
                </EmptyRequests>
              )}
            </RequestList>
          </DrawerContent>
        </DrawerOverlay>
      )}

      {isModalOpen && (
        <ModalOverlay>
          <ModalCard>
            <ModalHeader>
              <div><h3>Create New Order</h3><p>Register a manual transaction</p></div>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </ModalHeader>
            <form onSubmit={handleCreateOrder}>
              <FormBody>
                <InputGroup><label>Customer Name</label><input type="text" required value={newOrder.full_name} onChange={(e)=>setNewOrder({...newOrder, full_name: e.target.value})} /></InputGroup>
                <Row>
                  <InputGroup><label>Email Address</label><input type="email" required value={newOrder.email} onChange={(e)=>setNewOrder({...newOrder, email: e.target.value})} /></InputGroup>
                  <InputGroup><label>Contact Number</label><input type="tel" required value={newOrder.contact_number} onChange={(e)=>setNewOrder({...newOrder, contact_number: e.target.value})} /></InputGroup>
                </Row>
                <InputGroup><label>Delivery Address</label><textarea rows="2" required value={newOrder.location} onChange={(e)=>setNewOrder({...newOrder, location: e.target.value})} /></InputGroup>
                <SectionLabel><Package size={14}/> Select Products</SectionLabel>
                <ProductGrid>
                  {productOptions.map(p => {
                    const selectedItem = newOrder.items.find(item => item.product === p.id);
                    return (
                      <ProductItem key={p.id} $selected={!!selectedItem}>
                        <div className="info" onClick={() => handleProductToggle(p)}>
                          <span className="name">{p.product_name}</span>
                          <span className="price">Rs.{p.price}</span>
                        </div>
                        {selectedItem && (
                          <QtyControls>
                            <button type="button" onClick={() => updateQuantity(p.id, -1)}><Minus size={12}/></button>
                            <span>{selectedItem.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(p.id, 1)}><Plus size={12}/></button>
                          </QtyControls>
                        )}
                      </ProductItem>
                    );
                  })}
                </ProductGrid>
                <PriceSummary><div className="total-row"><span>Grand Total:</span><strong>Rs. {finalTotal}</strong></div></PriceSummary>
              </FormBody>
              <ModalFooter><button type="submit" className="submit-btn" disabled={newOrder.items.length === 0}>Place Order</button></ModalFooter>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
};

// ... Previous styled components ...

const TabSwitcher = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#0f172a' : '#64748b'};
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};
  transition: all 0.2s;
`;

const RequestItem = styled.div`
  border: 1px solid ${props => props.isRejected ? '#fee2e2' : '#e2e8f0'};
  background: ${props => props.isRejected ? '#fffafb' : 'white'};
  padding: 20px;
  border-radius: 20px;
  .req-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .req-sub { font-size: 0.85rem; color: #64748b; margin-bottom: 12px; }
  .req-total { margin-top: 15px; font-weight: 800; text-align: right; font-size: 1.1rem; }
`;

const RequestActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 15px;
  
  button {
    padding: 12px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    &.accept { background: #0f172a; color: white; }
    &.decline { background: #f1f5f9; color: #ef4444; }
    &.resolve {
      grid-column: span 2;
      background: #3b82f6;
      color: white;
    }
  }
`;

// Remaining original styles
const Container = styled.div` padding: 30px; background: #f8fafc; min-height: 100vh; `;
const SectionHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; h1 { font-size: 1.8rem; color: #0f172a; margin: 0; } p { color: #64748b; margin-top: 4px; } `;
const ActionButtons = styled.div` display: flex; gap: 15px; `;
const CreateBtn = styled.button` background: #3b82f6; color: white; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; &:hover { background: #2563eb; transform: translateY(-2px); } `;
const RequestBtn = styled.button` background: #fff; color: #0f172a; border: 1px solid #e2e8f0; padding: 14px 28px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; position: relative; transition: all 0.2s; &:hover { background: #f1f5f9; } .count { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; font-size: 0.7rem; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid #f8fafc; } `;
const ControlRow = styled.div` display: flex; justify-content: space-between; margin-bottom: 30px; gap: 20px; `;
const FilterBar = styled.div` display: flex; background: #fff; padding: 6px; border-radius: 14px; border: 1px solid #e2e8f0; button { padding: 10px 20px; border: none; background: transparent; cursor: pointer; border-radius: 10px; font-weight: 600; color: #64748b; transition: all 0.2s; &.active { background: #0f172a; color: #fff; } } `;
const SearchBar = styled.div` display: flex; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0 15px; flex: 1; max-width: 400px; input { border: none; outline: none; width: 100%; padding-left: 10px; height: 48px; } svg { color: #94a3b8; } `;
const OrderGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; `;
const OrderCard = styled.div` background: white; border-radius: 24px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; .order-id { font-weight: 700; color: #94a3b8; font-size: 0.85rem; } } h4 { margin: 0 0 15px 0; font-size: 1.2rem; color: #0f172a; } .contact-details { font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; margin: 4px 0; } `;
const StatusTag = styled.span` font-size: 0.7rem; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; font-weight: 800; &.pending { background: #fef3c7; color: #92400e; } &.success { background: #dcfce7; color: #166534; } &.cancelled { background: #fee2e2; color: #991b1b; } `;
const ItemsPreview = styled.div` background: #f8fafc; padding: 12px; border-radius: 12px; margin-top: 15px; .item-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #1e293b; font-weight: 600; margin-bottom: 4px; } `;
const PriceSection = styled.div` margin-top: 24px; display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 20px; .method-label, .total-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 4px; } .payment-tag { font-size: 0.8rem; font-weight: 800; color: #3b82f6; } .amount { font-size: 1.4rem; font-weight: 900; } `;
const DrawerOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); z-index: 1100; display: flex; justify-content: flex-end; `;
const DrawerContent = styled.div` width: 450px; height: 100%; background: white; padding: 40px; display: flex; flex-direction: column; animation: slideIn 0.3s ease-out; @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } `;
const DrawerHeader = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; h2 { margin: 0; font-size: 1.6rem; color: #0f172a; } p { color: #64748b; font-size: 0.9rem; margin: 5px 0 0 0; } `;
const CloseButton = styled.button` background: #f1f5f9; border: none; cursor: pointer; border-radius: 12px; padding: 8px; color: #64748b; `;
const RequestList = styled.div` flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; `;
const EmptyRequests = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; color: #94a3b8; font-weight: 600; `;
const ModalOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; `;
const ModalCard = styled.div` background: white; width: 600px; border-radius: 32px; padding: 40px; max-height: 85vh; overflow-y: auto; `;
const ModalHeader = styled.div` display: flex; justify-content: space-between; margin-bottom: 30px; h3 { margin: 0; } button { background: #f1f5f9; border: none; border-radius: 12px; padding: 8px; } `;
const FormBody = styled.div` display: flex; flex-direction: column; gap: 20px; `;
const Row = styled.div` display: flex; gap: 20px; & > div { flex: 1; } `;
const InputGroup = styled.div` label { font-size: 0.8rem; font-weight: 700; margin-bottom: 8px; display: block; } input, textarea, select { width: 100%; padding: 14px; border-radius: 14px; border: 1px solid #e2e8f0; } `;
const SectionLabel = styled.div` font-size: 0.9rem; font-weight: 800; margin-top: 10px; display: flex; align-items: center; gap: 10px; `;
const ProductGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 12px; `;
const ProductItem = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 14px; border-radius: 16px; border: 2px solid ${props => props.$selected ? '#3b82f6' : '#f1f5f9'}; .info { cursor: pointer; .name { display: block; font-weight: 700; } .price { font-size: 0.75rem; color: #64748b; } } `;
const QtyControls = styled.div` display: flex; align-items: center; gap: 10px; button { border: none; background: #f8fafc; border-radius: 6px; padding: 4px; } span { font-weight: 800; } `;
const PriceSummary = styled.div` background: #0f172a; color: white; padding: 24px; border-radius: 20px; .total-row { display: flex; justify-content: space-between; align-items: center; strong { font-size: 1.6rem; } } `;
const ModalFooter = styled.div` margin-top: 30px; .submit-btn { width: 100%; padding: 18px; border-radius: 16px; border: none; background: #3b82f6; color: white; font-weight: 800; } `;

export default OrdersReport;