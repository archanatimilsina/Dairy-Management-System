import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { 
  ArrowLeft, Phone, Mail, CheckCircle2, 
  Landmark, Wallet, Copy 
} from 'lucide-react';
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

const Checkout = () => {
  const [method, setMethod] = useState('esewa'); 
  const [isOrdered, setIsOrdered] = useState(false);
  const navigate = useNavigate();

  const orderDetails = {
    id: "ED-10294",
    amount: 1340,
  };

  const handlePlaceOrder = () => {
    setIsOrdered(true);
  };

  if (isOrdered) {
    return (
      <SuccessWrapper>
        <LocalStyle />
        <SuccessScreen
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="icon-ring">
            <CheckCircle2 size={56} color="#B8935A" strokeWidth={1.5} />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p className="order-id">Order ID: <strong>{orderDetails.id}</strong></p>
          <p className="desc">Your payment method ({method.toUpperCase()}) has been recorded for transparency.</p>
          <button onClick={() => window.location.href = '/'}>Back to Home</button>
        </SuccessScreen>
      </SuccessWrapper>
    );
  }

  return (
    <PageWrapper>
      <LocalStyle />
      <Container>
        <Header>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <h2>Select Payment Method</h2>
          <p>Total Amount: <strong>Rs. {orderDetails.amount}</strong></p>
        </Header>

        <MainGrid>
          <MethodsSection>
            <MethodCard 
              $active={method === 'esewa'} 
              onClick={() => setMethod('esewa')}
            >
              <div className="icon-box"><Wallet size={20} /></div>
              <div className="text">
                <h4>eSewa / QR Scan</h4>
                <p>Scan to pay instantly</p>
              </div>
              <div className="radio"></div>
            </MethodCard>

            <MethodCard 
              $active={method === 'bank'} 
              onClick={() => setMethod('bank')}
            >
              <div className="icon-box"><Landmark size={20} /></div>
              <div className="text">
                <h4>Bank Transfer</h4>
                <p>Direct deposit to Elsa Diary account</p>
              </div>
              <div className="radio"></div>
            </MethodCard>

            <MethodCard 
              $active={method === 'manual'} 
              onClick={() => setMethod('manual')}
            >
              <div className="icon-box"><Phone size={20} /></div>
              <div className="text">
                <h4>Physical / Direct Contact</h4>
                <p>Order via Phone or Email</p>
              </div>
              <div className="radio"></div>
            </MethodCard>
          </MethodsSection>

          <InstructionSection>
            <AnimatePresence mode="wait">
              {method === 'esewa' && (
                <DetailView
                  key="esewa"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>Scan QR Code</h3>
                  <QRPlaceholder>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ESewa_Payment_For_Elsa_Diary" alt="eSewa QR" />
                    <span>@elsadiary.official</span>
                  </QRPlaceholder>
                  <p className="hint">Please include Order ID <b>{orderDetails.id}</b> in the remarks.</p>
                </DetailView>
              )}

              {method === 'bank' && (
                <DetailView
                  key="bank"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>Bank Details</h3>
                  <BankInfo>
                    <div className="info-row">
                      <span>Bank:</span> <strong>Global IME Bank</strong>
                    </div>
                    <div className="info-row">
                      <span>Account Name:</span> <strong>Elsa Diary Pvt. Ltd.</strong>
                    </div>
                    <div className="info-row">
                      <span>Account No:</span> 
                      <strong className="acc-num">
                        012345678910 <Copy size={13} className="copy" onClick={() => navigator.clipboard.writeText('012345678910')}/>
                      </strong>
                    </div>
                  </BankInfo>
                  <p className="hint">Transfer the exact amount via your banking application and keep the screenshot safe.</p>
                </DetailView>
              )}

              {method === 'manual' && (
                <DetailView
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>Contact for Order</h3>
                  <ContactBox>
                    <a href="tel:+9779800000000"><Phone size={16}/> +977 980-0000000</a>
                    <a href="mailto:order@elsadiary.com"><Mail size={16}/> order@elsadiary.com</a>
                  </ContactBox>
                  <p className="hint">Once you contact us, we will manually verify and record this order in our business transparent ledger.</p>
                </DetailView>
              )}
            </AnimatePresence>

            <ConfirmBtn onClick={handlePlaceOrder}>
              Place Order (Rs. {orderDetails.amount})
            </ConfirmBtn>
          </InstructionSection>
        </MainGrid>
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
  max-width: 1080px; 
  margin: 0 auto; 
  padding: 60px 5%; 
`;

const Header = styled.div`
  margin-bottom: 40px;
  border-bottom: 1px solid #EAE3D6;
  padding-bottom: 20px;
  
  .back-btn { 
    background: none; 
    border: none; 
    color: #6B5C4A; 
    font-weight: 700; 
    cursor: pointer; 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    margin-bottom: 12px;
    font-size: 0.95rem;
    transition: color 0.2s;
    
    &:hover { color: #B8935A; }
  }
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #2A1F10; 
    margin: 0 0 6px;
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    font-size: 1.05rem;
    margin: 0;
    
    strong { color: #2A1F10; font-weight: 700; }
  }
`;

const MainGrid = styled.div`
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 40px;
  align-items: start;
  
  @media (max-width: 850px) { grid-template-columns: 1fr; gap: 30px; }
`;

const MethodsSection = styled.div` 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
`;

const MethodCard = styled.div`
  display: flex; 
  align-items: center; 
  padding: 24px; 
  border-radius: 24px; 
  cursor: pointer;
  background: ${props => props.$active ? '#FFFFFF' : '#FFFFFF'};
  border: 1px solid ${props => props.$active ? '#2A1F10' : '#EAE3D6'};
  box-shadow: ${props => props.$active ? '0 8px 25px rgba(42,31,16,0.04)' : '0 4px 12px rgba(42,31,16,0.01)'};
  transition: all 0.25s ease;
  
  .icon-box { 
    background: #FAF7F2; 
    color: #B8935A;
    padding: 14px; 
    border-radius: 14px; 
    margin-right: 20px; 
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #FAF7F2;
  }
  
  .text { 
    flex: 1; 
    
    h4 { 
      font-family: 'Playfair Display', serif;
      margin: 0 0 4px; 
      color: #2A1F10; 
      font-size: 1.2rem;
      font-weight: 700;
    } 
    
    p { 
      margin: 0; 
      font-size: 0.88rem; 
      color: #6B5C4A; 
      font-weight: 500;
    } 
  }
  
  .radio { 
    width: 22px; 
    height: 22px; 
    border-radius: 50%; 
    border: 2px solid ${props => props.$active ? '#B8935A' : '#D8CFBE'}; 
    position: relative;
    transition: all 0.2s ease;
    
    &::after { 
      content: ''; 
      position: absolute; 
      width: 10px; 
      height: 10px; 
      background: #B8935A; 
      border-radius: 50%; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%) scale(${props => props.$active ? 1 : 0}); 
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    }
  }
  
  &:hover {
    border-color: ${props => props.$active ? '#2A1F10' : '#B8935A'};
  }
`;

const InstructionSection = styled.div`
  background: #FFFFFF; 
  padding: 40px; 
  border-radius: 32px; 
  border: 1px solid #EAE3D6;
  box-shadow: 0 10px 30px rgba(42, 31, 16, 0.03);
  display: flex; 
  flex-direction: column; 
  justify-content: space-between;
  min-height: 420px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const DetailView = styled(motion.div)`
  text-align: center;
  width: 100%;
  
  h3 { 
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    margin: 0 0 24px; 
    color: #2A1F10; 
    font-weight: 700;
  }
  
  .hint { 
    font-size: 0.95rem; 
    color: #6B5C4A; 
    margin-top: 24px; 
    line-height: 1.6; 
    font-weight: 500;
    
    b { color: #2A1F10; font-weight: 700; }
  }
`;

const QRPlaceholder = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 12px;
  
  img { 
    width: 180px; 
    height: 180px; 
    padding: 12px; 
    background: #FFFFFF;
    border: 1px solid #EAE3D6; 
    border-radius: 20px; 
  }
  
  span { 
    font-family: monospace; 
    font-weight: 700; 
    color: #B8935A; 
    font-size: 0.95rem;
  }
`;

const BankInfo = styled.div`
  text-align: left; 
  background: #FAF7F2; 
  padding: 24px; 
  border-radius: 20px;
  border: 1px solid #EAE3D6;
  
  .info-row { 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    margin-bottom: 14px; 
    font-size: 0.98rem; 
    color: #6B5C4A;
    font-weight: 500;
    
    &:last-child { margin-bottom: 0; }
    
    strong { color: #2A1F10; font-weight: 700; }
    
    .acc-num {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .copy { 
      color: #B8935A; 
      cursor: pointer; 
      transition: color 0.2s;
      
      &:hover { color: #2A1F10; }
    }
  }
`;

const ContactBox = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 12px;
  
  a { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 10px; 
    padding: 16px; 
    background: #FAF7F2; 
    border-radius: 14px; 
    border: 1px solid #EAE3D6;
    text-decoration: none; 
    color: #2A1F10; 
    font-weight: 700; 
    font-size: 0.98rem;
    transition: all 0.2s ease;
    
    &:hover {
      background: #FFFFFF;
      border-color: #2A1F10;
    }
  }
`;

const ConfirmBtn = styled.button`
  width: 100%; 
  background: #2A1F10; 
  color: #FFFFFF; 
  border: none; 
  padding: 18px; 
  border-radius: 14px;
  font-weight: 700; 
  font-size: 1rem; 
  cursor: pointer; 
  margin-top: 30px;
  box-shadow: 0 8px 20px rgba(42, 31, 16, 0.12);
  transition: background-color 0.25s ease, transform 0.2s;
  
  &:hover { background: #40301B; }
  &:active { transform: scale(0.99); }
`;

const SuccessWrapper = styled.div`
  background-color: #FAF7F2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SuccessScreen = styled(motion.div)`
  text-align: center; 
  background: #FFFFFF;
  padding: 60px 40px;
  border-radius: 32px;
  border: 1px solid #EAE3D6;
  box-shadow: 0 10px 30px rgba(42, 31, 16, 0.03);
  max-width: 540px;
  width: 100%;
  box-sizing: border-box;
  
  .icon-ring {
    background: #FAF7F2;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    border: 1px solid #EAE3D6;
  }
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: #2A1F10;
    margin: 0 0 12px; 
    font-weight: 700;
  }
  
  .order-id {
    font-size: 1.05rem;
    color: #2A1F10;
    margin: 0 0 8px;
    
    strong { color: #B8935A; font-weight: 700; }
  }
  
  .desc { 
    color: #6B5C4A; 
    margin: 0 0 36px; 
    font-size: 0.98rem;
    line-height: 1.6;
    font-weight: 500;
  }
  
  button { 
    background: #2A1F10; 
    color: #FFFFFF; 
    border: none; 
    padding: 14px 36px; 
    border-radius: 12px; 
    font-weight: 700; 
    font-size: 0.98rem;
    cursor: pointer; 
    box-shadow: 0 8px 20px rgba(42, 31, 16, 0.12);
    transition: background-color 0.2s;
    
    &:hover { background: #40301B; }
  }
`;

export default Checkout;