import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  Trash2, Minus, Plus, ShoppingBag, 
  ArrowLeft, Truck, ShieldCheck, Check
} from 'lucide-react';
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { get, del } = useApi();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await get('product/cart/listCreate/');
      if (result.success) {
        const initialData = result.data.map(item => ({
          ...item,
          selected: true 
        }));
        setCartItems(initialData);
      }
    };
    fetchData();
  }, [get]);

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
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = async (id) => {
    const result = await del(`product/cart/detail/${id}/`);
    if (result.success) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }   
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 100 : 0;
  const total = subtotal + deliveryFee;

  const proceedCheckout = () => {
    if (selectedItems.length > 0) {
      navigate('/buyPage', { 
        state: { 
          selectedItems: selectedItems,
          total: total, 
          deliveryFee: deliveryFee, 
          subtotal: subtotal 
        } 
      });
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2>Shopping Bag</h2>
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

                    <img src={item.picture_src} alt={item.product_name} />
                    
                    <ItemInfo>
                      <div className="details">
                        <h4>{item.product_name}</h4>
                        <p className="price-tag">Rs. {item.price} / {item.unit}</p>
                      </div>
                      <Controls>
                        <div className="qty-picker">
                          <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                        </div>
                        <button className="delete" onClick={() => removeItem(item.id)}>
                          <Trash2 size={18} />
                        </button>
                      </Controls>
                      <div className="item-total">Rs. {item.price * item.quantity}</div>
                    </ItemInfo>
                  </CartItem>
                ))}
              </ItemsSection>

              <SummarySection>
                <SummaryCard>
                  <h3>Order Summary</h3>
                  <p className="summary-subtitle">
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
                    <span>Total Amount</span>
                    <span>Rs. {total}</span>
                  </div>
                  
                  <CheckoutBtn 
                    disabled={selectedItems.length === 0} 
                    onClick={proceedCheckout}
                  >
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
              <div className="empty-icon-circle">
                <ShoppingBag size={60} color="#b2bec3" />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your bag yet.</p>
              <AddBtn onClick={() => navigate('/products')}>Explore Products</AddBtn>
            </EmptyState>
          )}
        </MainContent>
      </Container>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  h2 { font-size: 1.8rem; color: #111827; font-weight: 800; }
  .count { background: #fff; border: 1px solid #e5e7eb; padding: 6px 16px; border-radius: 30px; font-weight: 600; color: #4b5563; }
  .back-btn { 
    background: transparent; border: none; color: #4b5563; font-weight: 600; 
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    transition: color 0.2s;
    &:hover { color: #7DAACB; }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  @media (max-width: 968px) { grid-template-columns: 1fr; }
`;

const ItemsSection = styled.div` display: flex; flex-direction: column; gap: 16px; `;

const SelectAllBar = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 12px 24px; background: #fff; border-radius: 16px;
  border: 1px solid #e5e7eb; cursor: pointer;
  span { font-weight: 700; color: #374151; font-size: 0.95rem; }
  &:hover { border-color: #7DAACB; }
`;

const CartItem = styled.div` 
  background: white; border-radius: 20px; padding: 20px; 
  border: 1px solid ${props => props.$isSelected ? '#7DAACB' : '#e5e7eb'}; 
  display: flex; gap: 20px; align-items: center; transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  img { width: 110px; height: 110px; border-radius: 12px; object-fit: cover; background: #f3f4f6; }
`;

const SelectionCircle = styled.div`
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid ${props => props.$active ? '#7DAACB' : '#d1d5db'};
  background: ${props => props.$active ? '#7DAACB' : 'transparent'};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; flex-shrink: 0;
`;

const ItemInfo = styled.div` 
  flex: 1; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 24px;
  h4 { margin: 0 0 4px; font-size: 1.1rem; color: #111827; font-weight: 700; }
  .price-tag { color: #6b7280; font-size: 0.9rem; margin: 0; }
  .item-total { font-weight: 800; font-size: 1.1rem; color: #111827; min-width: 90px; text-align: right; }
`;

const Controls = styled.div`
  display: flex; align-items: center; gap: 16px;
  .qty-picker {
    display: flex; align-items: center; background: #f9fafb; padding: 4px; border-radius: 10px; border: 1px solid #e5e7eb;
    button { background: white; border: 1px solid #e5e7eb; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; &:hover { background: #f3f4f6; } }
    span { margin: 0 12px; font-weight: 700; color: #111827; }
  }
  .delete { background: transparent; border: none; color: #9ca3af; cursor: pointer; transition: color 0.2s; &:hover { color: #ef4444; } }
`;

const SummarySection = styled.div``;
const SummaryCard = styled.div`
  background: white; padding: 32px; border-radius: 24px; border: 1px solid #e5e7eb;
  position: sticky; top: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  h3 { margin: 0 0 8px; font-size: 1.25rem; font-weight: 800; }
  .summary-subtitle { font-size: 0.85rem; color: #6b7280; margin-bottom: 24px; }
  .row { display: flex; justify-content: space-between; margin-bottom: 16px; color: #4b5563; font-weight: 500; }
  .total { margin-top: 16px; color: #111827; font-size: 1.25rem; font-weight: 900; }
  hr { border: none; border-top: 1px solid #f3f4f6; margin: 20px 0; }
`;

const CheckoutBtn = styled.button`
  width: 100%; background: ${props => props.disabled ? '#d1d5db' : '#111827'}; 
  color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 700; 
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex; align-items: center; justify-content: center; gap: 10px; transition: transform 0.2s, background 0.2s;
  &:active { transform: scale(0.98); }
  &:hover { background: ${props => props.disabled ? '#d1d5db' : '#374151'}; }
`;

const Badges = styled.div`
  display: flex; justify-content: center; gap: 20px; margin-top: 24px;
  .badge { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #9ca3af; font-weight: 600; }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 80px 0;
  .empty-icon-circle { background: #f3f4f6; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
  h3 { font-size: 1.5rem; color: #111827; margin-bottom: 8px; }
  p { color: #6b7280; margin-bottom: 32px; }
`;

const AddBtn = styled.button`
  background: #7DAACB; color: white; border: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

export default Cart;