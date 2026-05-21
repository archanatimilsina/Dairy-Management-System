import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { Mail, Phone, MapPin, Send, MessageSquare, User, Notebook, ArrowLeft } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { motion } from 'framer-motion';

const LocalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700;800&display=swap');
  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const Contact = () => {
  const { post } = useApi();
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    const result = await post('contact/listCreate/', formData);
    if(result.success) {
      console.log("Contact Detail is sent");
    }
    
    setTimeout(() => {
      setStatus('success');
      setFormData({ full_name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <PageWrapper>
      <LocalStyle />
      <Container className="page-fade-in">
        <SectionTitle>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </BackButton>
          
          <h2>Get in Touch</h2>
          <p>Have questions about our dairy products? We're here to help.</p>
        </SectionTitle>

        <MainGrid>
          <InfoSidebar>
            <InfoCard>
              <div className="icon"><Phone size={22} /></div>
              <div>
                <h4>Call Us</h4>
                <p>+977 980-0000000</p>
              </div>
            </InfoCard>

            <InfoCard>
              <div className="icon"><Mail size={22} /></div>
              <div>
                <h4>Email Us</h4>
                <p>hello@elsadiary.com</p>
              </div>
            </InfoCard>

            <InfoCard>
              <div className="icon"><MapPin size={22} /></div>
              <div>
                <h4>Visit Us</h4>
                <p>Pokhara, Kaski, Nepal</p>
              </div>
            </InfoCard>
          </InfoSidebar>

          <FormCard>
            {status === 'success' ? (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="success-icon-wrap">
                  <Send size={36} color="#B8935A" />
                </div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you shortly.</p>
                <div className="btn-group">
                  <button className="primary" onClick={() => setStatus('idle')}>Send Another</button>
                  <button className="secondary" onClick={() => navigate('/')}>Go to Home</button>
                </div>
              </SuccessMessage>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <label><User size={15}/> Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your Name" 
                    required 
                  />
                </FormGroup>

                <FormGroup>
                  <label><Mail size={15}/> Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com" 
                    required 
                  />
                </FormGroup>

                <FormGroup>
                  <label><Notebook size={15}/> Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?" 
                    required 
                  />
                </FormGroup>

                <FormGroup>
                  <label><MessageSquare size={15}/> Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    placeholder="Tell us more..." 
                    required
                  ></textarea>
                </FormGroup>

                <SubmitBtn type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending Message...' : 'Send Message'}
                </SubmitBtn>
              </form>
            )}
          </FormCard>
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
  max-width: 1140px; 
  margin: 0 auto; 
  padding: 80px 5%;
`;

const SectionTitle = styled.div`
  text-align: center; 
  margin-bottom: 60px; 
  position: relative;
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3rem); 
    color: #2A1F10; 
    margin-bottom: 12px;
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    font-size: 1.1rem; 
    font-weight: 500;
  }
`;

const BackButton = styled.button`
  position: absolute; 
  left: 0; 
  top: 14px;
  display: inline-flex; 
  align-items: center; 
  gap: 8px;
  background: none; 
  border: none; 
  color: #6B5C4A;
  font-weight: 700; 
  font-size: 0.95rem;
  cursor: pointer; 
  transition: color 0.25s ease, transform 0.25s ease;
  
  &:hover { 
    color: #B8935A; 
    transform: translateX(-4px); 
  }
  
  @media (max-width: 850px) { 
    position: relative; 
    top: 0;
    margin-bottom: 30px; 
  }
`;

const MainGrid = styled.div`
  display: grid; 
  grid-template-columns: 360px 1fr; 
  gap: 40px;
  align-items: start;
  
  @media (max-width: 850px) { 
    grid-template-columns: 1fr; 
    gap: 30px;
  }
`;

const InfoSidebar = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 16px;
`;

const InfoCard = styled.div`
  background: #FFFFFF; 
  padding: 28px 24px; 
  border-radius: 24px; 
  border: 1px solid #EAE3D6;
  display: flex; 
  align-items: center; 
  gap: 20px;
  box-shadow: 0 6px 20px rgba(42, 31, 16, 0.02);
  
  .icon { 
    background: #FAF7F2; 
    color: #B8935A; 
    padding: 16px; 
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #FAF7F2;
  }
  
  h4 { 
    font-family: 'Playfair Display', serif;
    margin: 0 0 4px; 
    color: #2A1F10; 
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  p { 
    margin: 0; 
    color: #6B5C4A; 
    font-size: 0.95rem; 
    font-weight: 500;
  }
`;

const FormCard = styled.div`
  background: #FFFFFF; 
  padding: 45px 40px; 
  border-radius: 32px; 
  border: 1px solid #EAE3D6;
  box-shadow: 0 10px 30px rgba(42, 31, 16, 0.03);

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  
  label { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    font-weight: 700; 
    color: #2A1F10; 
    margin-bottom: 10px; 
    font-size: 0.9rem; 
  }
  
  input, textarea {
    width: 100%; 
    padding: 14px 18px; 
    border-radius: 12px; 
    border: 1px solid #D8CFBE;
    background: #FFFFFF; 
    font-family: 'DM Sans', sans-serif;
    font-size: 0.98rem;
    color: #2A1F10;
    transition: all 0.25s ease;
    box-sizing: border-box;
    
    &::placeholder { color: #A89B87; }
    
    &:focus { 
      outline: none; 
      border-color: #2A1F10; 
      box-shadow: 0 0 0 4px rgba(42, 31, 16, 0.05); 
    }
  }

  textarea {
    resize: vertical;
  }
`;

const SubmitBtn = styled.button`
  width: 100%; 
  background: #2A1F10; 
  color: #FFFFFF; 
  border: none; 
  padding: 16px; 
  border-radius: 12px; 
  font-weight: 700; 
  font-size: 1rem;
  cursor: pointer; 
  box-shadow: 0 8px 20px rgba(42, 31, 16, 0.12);
  transition: all 0.25s ease;
  
  &:hover:not(:disabled) { 
    background: #40301B; 
    transform: translateY(-2px); 
    box-shadow: 0 12px 24px rgba(42, 31, 16, 0.16);
  }
  
  &:disabled { 
    background: #D8CFBE; 
    cursor: not-allowed; 
    box-shadow: none;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center; 
  padding: 30px 0;
  
  .success-icon-wrap {
    background: #FAF7F2;
    width: 80px;
    height: 80px;
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
    margin: 0 0 10px; 
    color: #2A1F10; 
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    margin-bottom: 32px;
    font-size: 1.05rem;
  }
  
  .btn-group { 
    display: flex; 
    justify-content: center; 
    gap: 16px; 
    
    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
  
  button { 
    padding: 14px 28px; 
    border-radius: 12px; 
    font-weight: 700; 
    font-size: 0.95rem;
    cursor: pointer; 
    transition: all 0.2s ease; 
    
    @media (max-width: 480px) {
      width: 100%;
    }
  }
  
  .primary { 
    background: #2A1F10; 
    color: #FFFFFF; 
    border: none;
    box-shadow: 0 6px 16px rgba(42, 31, 16, 0.1);
    
    &:hover { background: #40301B; }
  }
  
  .secondary { 
    background: #FFFFFF; 
    border: 1px solid #D8CFBE; 
    color: #2A1F10; 
    
    &:hover { 
      background: #FAF7F2; 
    }
  }
`;

export default Contact;