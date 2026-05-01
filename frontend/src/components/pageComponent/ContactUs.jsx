import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { Mail, Phone, MapPin, Send, MessageSquare, User, Notebook, ArrowLeft } from 'lucide-react';
import useApi from '../../hooks/useApi';
const Contact = () => {
  const {post} = useApi()
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
    
    const result = await post('contact/listCreate/',formData)
    if(result.success)
    {
      console.log("Contact Detail is sent")

    }
    setTimeout(() => {
      setStatus('success');
      setFormData({ full_name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <Container className="page-fade-in">
      <SectionTitle>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </BackButton>
        
        <h2>Get in Touch</h2>
        <p>Have questions about our dairy products? We're here to help.</p>
      </SectionTitle>

      <MainGrid>
        <InfoSidebar>
          <InfoCard>
            <div className="icon"><Phone size={24} /></div>
            <div>
              <h4>Call Us</h4>
              <p>+977 980-0000000</p>
            </div>
          </InfoCard>

          <InfoCard>
            <div className="icon"><Mail size={24} /></div>
            <div>
              <h4>Email Us</h4>
              <p>hello@elsadiary.com</p>
            </div>
          </InfoCard>

          <InfoCard>
            <div className="icon"><MapPin size={24} /></div>
            <div>
              <h4>Visit Us</h4>
              <p>Pokhara, Kaski, Nepal</p>
            </div>
          </InfoCard>
        </InfoSidebar>

        <FormCard>
          {status === 'success' ? (
            <SuccessMessage>
              <Send size={48} color="#7DAACB" />
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
                <label><User size={16}/> Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required 
                />
              </FormGroup>

              <FormGroup>
                <label><Mail size={16}/> Email Address</label>
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
                <label><Notebook size={16}/> Subject</label>
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
                <label><MessageSquare size={16}/> Message</label>
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
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </SubmitBtn>
            </form>
          )}
        </FormCard>
      </MainGrid>
    </Container>
  );
};


const Container = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 60px 20px;
`;

const SectionTitle = styled.div`
  text-align: center; margin-bottom: 50px; position: relative;
  h2 { font-size: 2.5rem; color: #2d3436; margin-bottom: 10px; }
  p { color: #636e72; font-size: 1.1rem; }
`;

const BackButton = styled.button`
  position: absolute; left: 0; top: 10px;
  display: flex; align-items: center; gap: 8px;
  background: none; border: none; color: #7DAACB;
  font-weight: 700; cursor: pointer; transition: 0.2s;
  &:hover { color: #2d3436; transform: translateX(-5px); }
  @media (max-width: 850px) { position: static; margin-bottom: 20px; }
`;

const MainGrid = styled.div`
  display: grid; grid-template-columns: 350px 1fr; gap: 40px;
  @media (max-width: 850px) { grid-template-columns: 1fr; }
`;

const InfoSidebar = styled.div`
  display: flex; flex-direction: column; gap: 20px;
`;

const InfoCard = styled.div`
  background: white; padding: 25px; border-radius: 20px; border: 1px solid #f1f2f6;
  display: flex; align-items: center; gap: 20px;
  .icon { background: #f8fbff; color: #7DAACB; padding: 15px; border-radius: 15px; }
  h4 { margin: 0; color: #2d3436; }
  p { margin: 5px 0 0; color: #636e72; font-size: 0.9rem; }
`;

const FormCard = styled.div`
  background: white; padding: 40px; border-radius: 30px; border: 1px solid #f1f2f6;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #2d3436; margin-bottom: 8px; font-size: 0.9rem; }
  input, textarea {
    width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #dfe6e9;
    background: #fdfdfd; font-family: inherit; transition: 0.3s;
    &:focus { outline: none; border-color: #7DAACB; background: white; box-shadow: 0 0 0 4px rgba(125, 170, 203, 0.1); }
  }
`;

const SubmitBtn = styled.button`
  width: 100%; background: #2d3436; color: white; border: none; padding: 16px; 
  border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
  &:hover { background: #7DAACB; transform: translateY(-2px); }
  &:disabled { background: #b2bec3; cursor: not-allowed; }
`;

const SuccessMessage = styled.div`
  text-align: center; padding: 40px 0;
  h3 { margin: 20px 0 10px; color: #2d3436; }
  p { color: #636e72; margin-bottom: 30px; }
  .btn-group { display: flex; justify-content: center; gap: 15px; }
  button { padding: 12px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; }
  .primary { background: #2d3436; color: white; border: none; }
  .secondary { background: none; border: 2px solid #7DAACB; color: #7DAACB; }
  .secondary:hover { background: #f8fbff; }
`;

export default Contact;