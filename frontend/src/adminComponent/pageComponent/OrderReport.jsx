import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  Trash2, Smartphone, Wallet, CheckCircle, Clock, 
  Truck, Plus, X, Mail, Phone, Package, Minus, Hash 
} from 'lucide-react';
import useApi from '../../hooks/useApi';

const OrdersReport = () => {
  const { get, post} = useApi();

  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const productOptions = [
    { id: 1, name: "Whole Milk", price: 120, unit: "Litre" },
    { id: 2, name: "Skimmed Milk", price: 110, unit: "Litre" },
    { id: 3, name: "Paneer", price: 450, unit: "500g" },
    { id: 4, name: "Curd", price: 150, unit: "Litre" },
    { id: 5, name: "Ghee", price: 800, unit: "500g" },
  ];

  const [newOrder, setNewOrder] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    items: [], 
    order_type: "Physical",
    delivery_fee: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await get('order/listCreate/');
      if (result.success) {
        setOrders(result.data);
      }
    };
    fetchData();
  }, [get]);

  const calculateTotal = () => {
    const itemsTotal = newOrder.items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
    return itemsTotal + Number(newOrder.delivery_fee);
  };

  const handleProductToggle = (product) => {
    const exists = newOrder.items.find(item => item.product === product.id);
    
    if (exists) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.filter(item => item.product !== product.id)
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, {
          product: product.id,
          product_name: product.name,
          quantity: 1,
          unit: product.unit,
          price_at_purchase: product.price
        }]
      });
    }
  };

  const updateQuantity = (productId, delta) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.map(item => 
        item.product === productId 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
          : item
      )
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...newOrder,
      total_amount: calculateTotal(),
    };
    const result = await post('/order/listCreate/',payload)
    if(result.success)
    {
      console.log("Order Success")
    }
    console.log("Sending to Backend:", payload);
    setOrders([{ ...payload,  delivery_status: 'pending' }, ...orders]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewOrder({ full_name: "",
       email: "",
        contact_number: "",
         items: [],
          order_type: "Physical",
           delivery_fee: 0 });
  };

  return (
    <Container className="page-fade-in">
      <TopHeader>
        <FilterBar>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'Physical' ? 'active' : ''} onClick={() => setFilter('Physical')}><Wallet size={14}/> Cash</button>
          <button className={filter === 'eSewa' ? 'active' : ''} onClick={() => setFilter('eSewa')}><Smartphone size={14}/> eSewa</button>
        </FilterBar>

        <CreateBtn onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Order
        </CreateBtn>
      </TopHeader>

      <OrderGrid>
        {orders.filter(o => filter === 'all' || o.order_type === filter).map(order => (
          <OrderCard key={order.id}>
            <div className="card-header">
              <span className="order-id">#{order.id}</span>
              <span className={`status-badge ${order.delivery_status}`}>{order.delivery_status}</span>
            </div>
            
            <div className="order-info">
              <h4>{order.full_name}</h4>
              <p className="contact-details"><Mail size={10}/> {order.email}</p>
              <p className="contact-details"><Phone size={10}/> {order.contact_number}</p>
              
              <ItemsPreview>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span>{item.quantity}x {item.product_name}</span>
                    <span>Rs. {item.price_at_purchase * item.quantity}</span>
                  </div>
                ))}
              </ItemsPreview>
              
              <div className="payment-tag">{order.order_type}</div>
            </div>

            <PriceSection>
              <div className="total-label">Grand Total</div>
              <div className="amount">Rs. {order.total_amount}</div>
            </PriceSection>
          </OrderCard>
        ))}
      </OrderGrid>

      {isModalOpen && (
        <ModalOverlay>
          <ModalCard>
            <ModalHeader>
              <div>
                <h3>Create New Order</h3>
                <p>Add customer details and dairy items</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </ModalHeader>
            <form onSubmit={handleCreateOrder}>
              <FormBody>
                <InputGroup>
                  <label>Customer Name</label>
                  <input type="text" required value={newOrder.full_name} onChange={(e)=>setNewOrder({...newOrder, full_name: e.target.value})} placeholder="Archana ..." />
                </InputGroup>
                
                <Row>
                   <InputGroup>
                    <label>Email</label>
                    <input type="email" required value={newOrder.email} onChange={(e)=>setNewOrder({...newOrder, email: e.target.value})} placeholder="archana@gces.edu.np" />
                  </InputGroup>
                  <InputGroup>
                    <label>Contact</label>
                    <input type="tel" required value={newOrder.contact_number} onChange={(e)=>setNewOrder({...newOrder, contact_number: e.target.value})} placeholder="98XXXXXXXX" />
                  </InputGroup>
                </Row>

                <SectionLabel><Package size={14}/> Select Products</SectionLabel>
                <ProductGrid>
                  {productOptions.map(p => {
                    const selectedItem = newOrder.items.find(item => item.product === p.id);
                    return (
                      <ProductItem key={p.id} $selected={!!selectedItem}>
                        <div className="info" onClick={() => handleProductToggle(p)}>
                          <span className="name">{p.name}</span>
                          <span className="price">Rs.{p.price} / {p.unit}</span>
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

                <Row>
                  <InputGroup>
                    <label>Payment Method</label>
                    <select value={newOrder.order_type} onChange={(e) => setNewOrder({...newOrder, order_type: e.target.value})}>
                      <option value="Physical">Physical (Cash)</option>
                      <option value="eSewa">eSewa</option>
                    </select>
                  </InputGroup>
                  <InputGroup>
                    <label>Delivery Fee (Rs)</label>
                    <input type="number" value={newOrder.delivery_fee} onChange={(e) => setNewOrder({...newOrder, delivery_fee: e.target.value})} />
                  </InputGroup>
                </Row>

                <PriceSummary>
                  <div className="total-row">
                    <span>Final Amount:</span>
                    <strong>Rs. {calculateTotal()}</strong>
                  </div>
                </PriceSummary>
              </FormBody>
              <ModalFooter>
                <button type="submit" className="submit-btn" disabled={newOrder.items.length === 0}>
                  Confirm & Save Order
                </button>
              </ModalFooter>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div` padding: 20px; `;
const Row = styled.div` display: flex; gap: 15px; & > div { flex: 1; } `;

const TopHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
`;

const FilterBar = styled.div`
  display: flex; background: #fff; padding: 5px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  button { padding: 8px 20px; border: none; background: transparent; cursor: pointer; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 6px; color: #636e72;
    &.active { background: #2d3436; color: white; }
  }
`;

const CreateBtn = styled.button`
  background: #7DAACB; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;
`;

const OrderGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 25px; `;

const OrderCard = styled.div`
  background: white; border-radius: 20px; padding: 20px; border: 1px solid #f1f2f6; transition: transform 0.2s;
  &:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
  .card-header { display: flex; justify-content: space-between; margin-bottom: 15px; 
    .order-id { font-weight: 800; color: #b2bec3; font-size: 0.8rem; }
    .status-badge { font-size: 0.65rem; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; font-weight: 700;
      &.pending { background: #fff4e6; color: #d9480f; }
      &.success { background: #ebfbee; color: #2b8a3e; }
    }
  }
  h4 { margin-bottom: 8px; color: #2d3436; }
  .contact-details { font-size: 0.75rem; color: #636e72; display: flex; align-items: center; gap: 5px; margin: 2px 0; }
  .payment-tag { margin-top: 15px; font-size: 0.7rem; font-weight: 800; color: #7DAACB; background: #f0f7fc; padding: 4px 10px; border-radius: 6px; display: inline-block; }
`;

const ItemsPreview = styled.div`
  margin-top: 15px; padding-top: 15px; border-top: 1px dashed #eee;
  .item-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: #2d3436; margin-bottom: 4px; font-weight: 500; }
`;

const PriceSection = styled.div`
  margin-top: 20px; display: flex; justify-content: space-between; align-items: flex-end;
  .total-label { font-size: 0.7rem; font-weight: 700; color: #b2bec3; text-transform: uppercase; }
  .amount { font-size: 1.3rem; font-weight: 900; color: #2d3436; }
`;

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center;
`;

const ModalCard = styled.div`
  background: white; width: 550px; border-radius: 24px; padding: 30px; max-height: 90vh; overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 25px;
  h3 { margin: 0; color: #2d3436; }
  p { font-size: 0.8rem; color: #b2bec3; margin: 0; }
  button { background: none; border: none; cursor: pointer; color: #b2bec3; }
`;

const FormBody = styled.div` display: flex; flex-direction: column; gap: 18px; `;

const SectionLabel = styled.div` font-size: 0.85rem; font-weight: 800; color: #2d3436; margin-top: 10px; display: flex; align-items: center; gap: 8px; `;

const InputGroup = styled.div`
  label { font-size: 0.75rem; font-weight: 700; color: #636e72; margin-bottom: 6px; display: block; }
  input, select { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #f1f2f6; outline: none; font-weight: 600;
    &:focus { border-color: #7DAACB; }
  }
`;

const ProductGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 10px; `;

const ProductItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 12px; border: 2px solid ${props => props.$selected ? '#7DAACB' : '#f8f9fa'};
  background: ${props => props.$selected ? '#f0f7fc' : '#fff'};
  .info { cursor: pointer; flex: 1; 
    .name { display: block; font-size: 0.85rem; font-weight: 700; }
    .price { font-size: 0.7rem; color: #b2bec3; }
  }
`;

const QtyControls = styled.div`
  display: flex; align-items: center; gap: 8px; background: white; padding: 4px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  button { border: none; background: #f1f2f6; border-radius: 4px; padding: 2px; cursor: pointer; display: flex; align-items: center; }
  span { font-size: 0.8rem; font-weight: 800; min-width: 15px; text-align: center; }
`;

const PriceSummary = styled.div`
  background: #2d3436; color: white; padding: 20px; border-radius: 16px; margin-top: 10px;
  .total-row { display: flex; justify-content: space-between; align-items: center; 
    span { font-size: 0.9rem; opacity: 0.8; }
    strong { font-size: 1.4rem; }
  }
`;

const ModalFooter = styled.div`
  margin-top: 25px;
  .submit-btn { width: 100%; padding: 16px; border-radius: 14px; border: none; background: #7DAACB; color: white; font-weight: 800; cursor: pointer; transition: 0.2s;
    &:disabled { background: #b2bec3; cursor: not-allowed; }
    &:hover:not(:disabled) { background: #6b98b9; }
  }
`;

export default OrdersReport;