import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  Trash2, Minus, Plus, ShoppingBag, 
  ArrowLeft, Truck, ShieldCheck, Check
} from 'lucide-react';
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LocalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700;800&display=swap');
  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const Cart = () => {
  const { get, del } = useApi();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await get('product/cart/listCreate/');
      if (result.success) {
        console.log(result.data.results)
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
      <LocalStyle />
      <Container>
        <Header>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
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
                    {isAllSelected && <Check size={12} color="white" strokeWidth={3} />}
                  </SelectionCircle>
                  <span>Select All ({cartItems.length} Items)</span>
                </SelectAllBar>

                <AnimatePresence mode="popLayout">
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id} 
                      $isSelected={item.selected}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SelectionCircle onClick={() => toggleSelect(item.id)} $active={item.selected}>
                        {item.selected && <Check size={12} color="white" strokeWidth={3} />}
                      </SelectionCircle>

                      <img src={item.picture_src} alt={item.product_name} />
                      
                      <ItemInfo>
                        <div className="details">
                          <h4>{item.product_name}</h4>
                          <p className="price-tag">Rs. {item.price} <small>/ {item.unit}</small></p>
                        </div>
                        
                        <Controls>
                          <div className="qty-picker">
                            <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">
                              <Minus size={13} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">
                              <Plus size={13} />
                            </button>
                          </div>
                          
                          <button className="delete" onClick={() => removeItem(item.id)} aria-label="Remove item">
                            <Trash2 size={18} />
                          </button>
                        </Controls>
                        
                        <div className="item-total">
                          <small>Rs.</small> {item.price * item.quantity}
                        </div>
                      </ItemInfo>
                    </CartItem>
                  ))}
                </AnimatePresence>
              </ItemsSection>

              <SummarySection>
                <SummaryCard>
                  <h3>Order Summary</h3>
                  <p className="summary-subtitle">
                    {selectedItems.length} items selected for checkout
                  </p>
                  
                  <div className="row">
                    <span>Subtotal</span>
                    <span className="val">Rs. {subtotal}</span>
                  </div>
                  <div className="row">
                    <span>Delivery Fee</span>
                    <span className="val">Rs. {deliveryFee}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="row total">
                    <span>Total Amount</span>
                    <span className="amount_val"><small>Rs.</small> {total}</span>
                  </div>
                  
                  <CheckoutBtn 
                    disabled={selectedItems.length === 0} 
                    onClick={proceedCheckout}
                    whileTap={selectedItems.length > 0 ? { scale: 0.98 } : {}}
                  >
                    <ShoppingBag size={18} /> 
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
            <EmptyState
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="empty-icon-circle">
                <ShoppingBag size={48} color="#B8935A" />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any fresh selections to your bag yet.</p>
              <AddBtn onClick={() => navigate('/products')} whileTap={{ scale: 0.95 }}>
                Explore Products
              </AddBtn>
            </EmptyState>
          )}
        </MainContent>
      </Container>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  background-color: #FAF7F2;
  min-height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 5%;
  
  @media (max-width: 768px) {
    padding-top: 30px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #EAE3D6;
  padding-bottom: 20px;
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #2A1F10; 
    font-weight: 700; 
  }
  
  .count { 
    background: #FFFFFF; 
    border: 1px solid #EAE3D6; 
    padding: 6px 18px; 
    border-radius: 50px; 
    font-weight: 700; 
    color: #6B5C4A;
    font-size: 0.9rem;
  }
  
  .back-btn { 
    background: transparent; 
    border: none; 
    color: #6B5C4A; 
    font-weight: 700; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 8px;
    font-size: 0.95rem;
    transition: color 0.2s ease;
    
    &:hover { color: #B8935A; }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
  
  @media (max-width: 1024px) { 
    grid-template-columns: 1fr; 
    gap: 30px;
  }
`;

const ItemsSection = styled.div` 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
`;

const SelectAllBar = styled.div`
  display: flex; 
  align-items: center; 
  gap: 14px;
  padding: 16px 24px; 
  background: #FFFFFF; 
  border-radius: 16px;
  border: 1px solid #EAE3D6; 
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(42,31,16,0.01);
  transition: border-color 0.2s ease;
  
  span { 
    font-weight: 700; 
    color: #2A1F10; 
    font-size: 0.95rem; 
  }
  
  &:hover { border-color: #B8935A; }
`;

const CartItem = styled(motion.div)` 
  background: #FFFFFF; 
  border-radius: 24px; 
  padding: 20px; 
  border: 1px solid ${props => props.$isSelected ? '#2A1F10' : '#EAE3D6'}; 
  display: flex; 
  gap: 20px; 
  align-items: center; 
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 4px 15px rgba(42,31,16,0.02);
  
  img { 
    width: 100px; 
    height: 100px; 
    border-radius: 16px; 
    object-fit: cover; 
    background: #FAF7F2; 
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    
    img { width: 100%; height: 160px; }
  }
`;

const SelectionCircle = styled.div`
  width: 24px; 
  height: 24px; 
  border-radius: 50%;
  border: 2px solid ${props => props.$active ? '#B8935A' : '#D8CFBE'};
  background: ${props => props.$active ? '#B8935A' : 'transparent'};
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer; 
  transition: all 0.2s ease; 
  flex-shrink: 0;
`;

const ItemInfo = styled.div` 
  flex: 1; 
  display: grid; 
  grid-template-columns: 1fr auto auto; 
  align-items: center; 
  gap: 24px;
  width: 100%;
  
  h4 { 
    font-family: 'Playfair Display', serif;
    margin: 0 0 6px; 
    font-size: 1.25rem; 
    color: #2A1F10; 
    font-weight: 700; 
  }
  
  .price-tag { 
    color: #6B5C4A; 
    font-size: 0.95rem; 
    margin: 0; 
    font-weight: 500;
    
    small { font-size: 0.85rem; color: #8C7A61; }
  }
  
  .item-total { 
    font-weight: 700; 
    font-size: 1.3rem; 
    color: #2A1F10; 
    min-width: 100px; 
    text-align: right; 
    
    small { font-size: 0.85rem; color: #B8935A; font-weight: 600; }
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
    
    .item-total { text-align: left; min-width: auto; }
  }
`;

const Controls = styled.div`
  display: flex; 
  align-items: center; 
  gap: 20px;
  
  .qty-picker {
    display: flex; 
    align-items: center; 
    background: #FAF7F2; 
    padding: 6px; 
    border-radius: 12px; 
    border: 1px solid #EAE3D6;
    
    button { 
      background: #FFFFFF; 
      border: 1px solid #EAE3D6; 
      width: 30px; 
      height: 30px; 
      border-radius: 8px; 
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: #2A1F10;
      transition: background-color 0.2s; 
      
      &:hover { background: #F3EFE6; } 
    }
    
    span { 
      margin: 0 16px; 
      font-weight: 700; 
      color: #2A1F10; 
      font-size: 0.95rem;
    }
  }
  
  .delete { 
    background: transparent; 
    border: none; 
    color: #A89B87; 
    cursor: pointer; 
    transition: color 0.2s ease; 
    display: inline-flex;
    align-items: center;
    
    &:hover { color: #EF4444; } 
  }
`;

const SummarySection = styled.div`
  width: 100%;
`;

const SummaryCard = styled.div`
  background: #FFFFFF; 
  padding: 35px 30px; 
  border-radius: 24px; 
  border: 1px solid #EAE3D6;
  position: sticky; 
  top: 120px; 
  box-shadow: 0 10px 30px rgba(42,31,16,0.03);
  
  h3 { 
    font-family: 'Playfair Display', serif;
    margin: 0 0 6px; 
    font-size: 1.4rem; 
    font-weight: 700; 
    color: #2A1F10;
  }
  
  .summary-subtitle { 
    font-size: 0.85rem; 
    color: #8C7A61; 
    margin-bottom: 28px; 
    font-weight: 500;
  }
  
  .row { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 16px; 
    color: #6B5C4A; 
    font-weight: 500; 
    font-size: 0.98rem;
    
    .val { color: #2A1F10; font-weight: 700; }
  }
  
  .total { 
    margin-top: 18px; 
    color: #2A1F10; 
    font-size: 1.15rem; 
    font-weight: 700; 
    
    .amount_val {
      font-size: 1.5rem;
      color: #2A1F10;
      
      small { font-size: 0.95rem; color: #B8935A; font-weight: 600; }
    }
  }
  
  hr { 
    border: none; 
    border-top: 1px solid #FAF7F2; 
    margin: 24px 0; 
  }
`;

const CheckoutBtn = styled(motion.button)`
  width: 100%; 
  background: ${props => props.disabled ? '#D8CFBE' : '#2A1F10'}; 
  color: #FFFFFF; 
  border: none; 
  padding: 16px; 
  border-radius: 12px; 
  font-weight: 700; 
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px; 
  box-shadow: ${props => props.disabled ? 'none' : '0 8px 20px rgba(42,31,16,0.12)'};
  transition: background-color 0.25s ease;
  
  &:hover { 
    background: ${props => props.disabled ? '#D8CFBE' : '#40301B'}; 
  }
`;

const Badges = styled.div`
  display: flex; 
  justify-content: center; 
  gap: 24px; 
  margin-top: 28px;
  border-top: 1px solid #FAF7F2;
  padding-top: 20px;
  
  .badge { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    font-size: 0.78rem; 
    color: #A89B87; 
    font-weight: 700; 
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const EmptyState = styled(motion.div)`
  grid-column: 1 / -1; 
  text-align: center; 
  padding: 80px 20px;
  background: #FFFFFF;
  border-radius: 32px;
  border: 1px solid #EAE3D6;
  box-shadow: 0 10px 30px rgba(42,31,16,0.02);
  
  .empty-icon-circle { 
    background: #FAF7F2; 
    width: 100px; 
    height: 100px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    margin: 0 auto 24px; 
    border: 1px solid #EAE3D6;
  }
  
  h3 { 
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; 
    color: #2A1F10; 
    margin-bottom: 8px; 
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    margin-bottom: 32px; 
    font-size: 1.05rem;
  }
`;

const AddBtn = styled(motion.button)`
  background: #2A1F10; 
  color: #FFFFFF; 
  border: none; 
  padding: 16px 36px; 
  border-radius: 12px; 
  font-weight: 700; 
  font-size: 1rem;
  cursor: pointer; 
  box-shadow: 0 8px 20px rgba(42,31,16,0.12);
  transition: background-color 0.2s;
  
  &:hover { background: #40301B; }
`;

export default Cart;