import  { useState } from 'react';
import styled from 'styled-components';
import { 
  Trash2, Minus, Plus, ShoppingBag, 
  ArrowLeft, Truck, ShieldCheck, Check
} from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Fresh Cow Milk", price: 120, unit: "Litre", qty: 2, selected: true, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800" },
    { id: 14, name: "Danfe Pure Cow Ghee", price: 1100, unit: "1 Litre", qty: 1, selected: false, image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=500&auto=format&fit=crop" },
  ]);

  const isAllSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  const toggleSelectAll = () => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: !isAllSelected })));
  };

  const toggleSelect = (id) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 0 ? 100 : 0;
  const total = subtotal + deliveryFee;

  return (
    <Container>
      <Header>
        <button className="back-btn"><ArrowLeft size={20} /> Continue Shopping</button>
        <h2>Your Shopping Bag</h2>
        <div className="count">{cartItems.length} Items</div>
      </Header>

      <MainContent>
        {cartItems.length > 0 ? (
          <>
            <ItemsSection>
              <SelectAllBar onClick={toggleSelectAll}>
                <SelectionCircle $active={isAllSelected}>
                  {isAllSelected && <Check size={14} color="white" strokeWidth={3} />}
                </SelectionCircle>
                <span>Select All ({cartItems.length} Items)</span>
              </SelectAllBar>

              {cartItems.map(item => (
                <CartItem key={item.id} $isSelected={item.selected}>
                  <SelectionCircle onClick={() => toggleSelect(item.id)} $active={item.selected}>
                    {item.selected && <Check size={14} color="white" strokeWidth={3} />}
                  </SelectionCircle>

                  <img src={item.image} alt={item.name} />
                  
                  <ItemInfo $faded={!item.selected}>
                    <div className="details">
                      <h4>{item.name}</h4>
                      <p>Rs. {item.price} / {item.unit}</p>
                    </div>
                    <Controls>
                      <div className="qty-picker">
                        <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                      </div>
                      <button className="delete" onClick={() => removeItem(item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </Controls>
                    <div className="item-total">Rs. {item.price * item.qty}</div>
                  </ItemInfo>
                </CartItem>
              ))}
            </ItemsSection>

            <SummarySection>
              <SummaryCard>
                <h3>Order Summary</h3>
                <p style={{fontSize: '0.8rem', color: '#b2bec3', marginBottom: '15px'}}>
                  {selectedItems.length} items selected for checkout
                </p>
                <div className="row">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="row">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
                <hr />
                <div className="row total">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
                
                <CheckoutBtn disabled={selectedItems.length === 0}>
                  <ShoppingBag size={20} /> 
                  {selectedItems.length === 0 ? "Select items to buy" : "Proceed to Checkout"}
                </CheckoutBtn>

                <Badges>
                  <div className="badge"><Truck size={14}/> Fast Delivery</div>
                  <div className="badge"><ShieldCheck size={14}/> Secure Payment</div>
                </Badges>
              </SummaryCard>
            </SummarySection>
          </>
        ) : (
          <EmptyState>
            <ShoppingBag size={60} color="#dfe6e9" />
            <h3>Your cart is empty</h3>
            <AddBtn>Go to Products</AddBtn>
          </EmptyState>
        )}
      </MainContent>
    </Container>
  );
};


const SelectAllBar = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  background: #f8fbff;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 10px;
  span {
    font-weight: 700;
    color: #2d3436;
    font-size: 0.9rem;
  }
  &:hover {
    background: #f1f7ff;
  }
`;

const SelectionCircle = styled.div`
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid ${props => props.$active ? '#7DAACB' : '#dfe6e9'};
  background: ${props => props.$active ? '#7DAACB' : 'transparent'};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.2s;
  flex-shrink: 0;
`;

const Container = styled.div` max-width: 1200px; margin: 0 auto; padding: 40px 20px; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; h2 { font-size: 2rem; color: #2d3436; } .count { background: #f1f2f6; padding: 6px 15px; border-radius: 20px; font-weight: 700; color: #636e72; } .back-btn { background: none; border: none; color: #7DAACB; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; } `;
const MainContent = styled.div` display: grid; grid-template-columns: 1fr 380px; gap: 40px; @media (max-width: 968px) { grid-template-columns: 1fr; } `;
const ItemsSection = styled.div` display: flex; flex-direction: column; gap: 15px; `;
const CartItem = styled.div` background: white; border-radius: 24px; padding: 20px; border: 1px solid ${props => props.$isSelected ? '#7DAACB' : '#f1f2f6'}; display: flex; gap: 20px; align-items: center; transition: 0.3s; img { width: 100px; height: 100px; border-radius: 16px; object-fit: cover; filter: ${props => props.$isSelected ? 'none' : 'grayscale(100%) opacity(0.6)'}; } `;
const ItemInfo = styled.div` flex: 1; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 30px; opacity: ${props => props.$faded ? 0.5 : 1}; transition: 0.3s; h4 { margin: 0; font-size: 1.1rem; color: #2d3436; } .item-total { font-weight: 800; font-size: 1.1rem; color: #2d3436; min-width: 100px; text-align: right; } `;
const Controls = styled.div` display: flex; align-items: center; gap: 20px; .qty-picker { display: flex; align-items: center; background: #f8fbff; padding: 5px; border-radius: 12px; button { background: white; border: 1px solid #f1f2f6; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; } span { margin: 0 15px; font-weight: 800; color: #2d3436; } } .delete { background: none; border: none; color: #fab1a0; cursor: pointer; &:hover { color: #e74c3c; } } `;
const SummarySection = styled.div``;
const SummaryCard = styled.div` background: white; padding: 30px; border-radius: 24px; border: 1px solid #f1f2f6; position: sticky; top: 20px; h3 { margin: 0 0 5px; font-size: 1.3rem; } .row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #636e72; font-weight: 500; } .total { margin-top: 15px; color: #2d3436; font-size: 1.2rem; font-weight: 800; } hr { border: none; border-top: 1px solid #f1f2f6; margin: 20px 0; } `;
const CheckoutBtn = styled.button` width: 100%; background: ${props => props.disabled ? '#dfe6e9' : '#2d3436'}; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 700; cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; `;
const Badges = styled.div` display: flex; justify-content: center; gap: 20px; margin-top: 25px; .badge { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #b2bec3; font-weight: 600; } `;
const EmptyState = styled.div` grid-column: 1 / -1; text-align: center; padding: 100px 0; h3 { margin: 20px 0 10px; color: #2d3436; } `;
const AddBtn = styled.button` background: #7DAACB; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; `;

export default Cart;