import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  ArrowLeft, Phone, Mail, CheckCircle2, 
  QrCode, Landmark, Wallet, Copy, ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Checkout = () => {
  const [method, setMethod] = useState('esewa'); 
  const [isOrdered, setIsOrdered] = useState(false);
const navigate = useNavigate()
  const orderDetails = {
    id: "ED-10294",
    amount: 1340,
  };

  const handlePlaceOrder = () => {

    setIsOrdered(true);
  };

  if (isOrdered) {
    return (
      <SuccessScreen className="page-fade-in">
        <CheckCircle2 size={80} color="#7DAACB" strokeWidth={1} />
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: <strong>{orderDetails.id}</strong></p>
        <p>Your payment method ({method}) has been recorded for transparency.</p>
        <button onClick={() => window.location.href = '/'}>Back to Home</button>
      </SuccessScreen>
    );
  }

  return (
    <Container>
      <Header>
        <button className="back-btn"><ArrowLeft size={20} onClick={()=>navigate(-1)}/> Back</button>
        <h2>Select Payment Method</h2>
        <p>Total Amount: <strong>Rs. {orderDetails.amount}</strong></p>
      </Header>

      <MainGrid>
        <MethodsSection>
          <MethodCard 
            $active={method === 'esewa'} 
            onClick={() => setMethod('esewa')}
          >
            <div className="icon-box"><Wallet size={24} /></div>
            <div className="text">
              <h4>eSewa / QR Scan</h4>
              <p>Scan to pay instantly</p>
            </div>
            <div className="radio"></div>
          </MethodCard>

          <MethodCard 
            active={method === 'bank'} 
            onClick={() => setMethod('bank')}
          >
            <div className="icon-box"><Landmark size={24} /></div>
            <div className="text">
              <h4>Bank Transfer</h4>
              <p>Direct deposit to Elsa Diary account</p>
            </div>
            <div className="radio"></div>
          </MethodCard>

          <MethodCard 
            active={method === 'manual'} 
            onClick={() => setMethod('manual')}
          >
            <div className="icon-box"><Phone size={24} /></div>
            <div className="text">
              <h4>Physical / Direct Contact</h4>
              <p>Order via Phone or Email</p>
            </div>
            <div className="radio"></div>
          </MethodCard>
        </MethodsSection>

        {/* RIGHT: Dynamic  */}
        <InstructionSection>
          {method === 'esewa' && (
            <DetailView>
              <h3>Scan QR Code</h3>
              <QRPlaceholder>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ESewa_Payment_For_Elsa_Diary" alt="eSewa QR" />
                <span>@elsadiary.official</span>
              </QRPlaceholder>
              <p className="hint">Please include Order ID <b>{orderDetails.id}</b> in the remarks.</p>
            </DetailView>
          )}

          {method === 'bank' && (
            <DetailView>
              <h3>Bank Details</h3>
              <BankInfo>
                <div className="info-row"><span>Bank:</span> <strong>Global IME Bank</strong></div>
                <div className="info-row"><span>Account Name:</span> <strong>Elsa Diary Pvt. Ltd.</strong></div>
                <div className="info-row"><span>Account No:</span> <strong>012345678910 <Copy size={14} className="copy"/></strong></div>
              </BankInfo>
              <p className="hint">Transfer the amount and keep the screenshot.</p>
            </DetailView>
          )}

          {method === 'manual' && (
            <DetailView>
              <h3>Contact for Order</h3>
              <ContactBox>
                <a href="tel:+9779800000000"><Phone size={18}/> +977 980-0000000</a>
                <a href="mailto:order@elsadiary.com"><Mail size={18}/> order@elsadiary.com</a>
              </ContactBox>
              <p className="hint">Once you contact us, we will manually verify and record this order in our business transparent ledger.</p>
            </DetailView>
          )}

          <ConfirmBtn onClick={handlePlaceOrder}>
            Place Order (Rs. {orderDetails.amount})
          </ConfirmBtn>
        </InstructionSection>
      </MainGrid>
    </Container>
  );
};


const Container = styled.div` max-width: 1000px; margin: 0 auto; padding: 40px 20px; `;

const Header = styled.div`
  margin-bottom: 40px;
  .back-btn { background: none; border: none; color: #7DAACB; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  h2 { font-size: 2rem; color: #2d3436; margin-bottom: 5px; }
  p { color: #636e72; }
`;

const MainGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const MethodsSection = styled.div` display: flex; flex-direction: column; gap: 15px; `;

const MethodCard = styled.div`
  display: flex; align-items: center; padding: 20px; border-radius: 20px; cursor: pointer;
  background: ${props => props.active ? '#f8fbff' : 'white'};
  border: 2px solid ${props => props.active ? '#7DAACB' : '#f1f2f6'};
  transition: 0.3s;
  .icon-box { background: #fff; padding: 12px; border-radius: 12px; margin-right: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
  .text { flex: 1; h4 { margin: 0; color: #2d3436; } p { margin: 0; font-size: 0.85rem; color: #b2bec3; } }
  .radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #dfe6e9; position: relative;
    &::after { content: ''; position: absolute; width: 10px; height: 10px; background: #7DAACB; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(${props => props.active ? 1 : 0}); transition: 0.2s; }
  }
`;

const InstructionSection = styled.div`
  background: white; padding: 40px; border-radius: 30px; border: 1px solid #f1f2f6;
  display: flex; flex-direction: column; justify-content: space-between;
`;

const DetailView = styled.div`
  text-align: center;
  h3 { margin-bottom: 25px; color: #2d3436; }
  .hint { font-size: 0.9rem; color: #636e72; margin-top: 25px; line-height: 1.6; }
`;

const QRPlaceholder = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  img { width: 200px; height: 200px; padding: 10px; border: 1px solid #f1f2f6; border-radius: 15px; }
  span { font-family: monospace; font-weight: 700; color: #7DAACB; }
`;

const BankInfo = styled.div`
  text-align: left; background: #f8fbff; padding: 20px; border-radius: 15px;
  .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem; 
    .copy { color: #7DAACB; cursor: pointer; }
  }
`;

const ContactBox = styled.div`
  display: flex; flex-direction: column; gap: 15px;
  a { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px; 
      background: #f1f2f6; border-radius: 12px; text-decoration: none; color: #2d3436; font-weight: 700; }
`;

const ConfirmBtn = styled.button`
  width: 100%; background: #2d3436; color: white; border: none; padding: 20px; border-radius: 16px;
  font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 30px;
  &:hover { background: #7DAACB; }
`;

const SuccessScreen = styled.div`
  text-align: center; padding: 100px 20px;
  h2 { margin: 20px 0 10px; }
  p { color: #636e72; margin-bottom: 30px; }
  button { background: #2d3436; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; }
`;

export default Checkout;