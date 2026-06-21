import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { 
  Star, Truck, Package, 
  Lightbulb, HelpCircle, Send, CheckCircle, ArrowLeft 
} from 'lucide-react';
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

const Feedback = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    feedback_topic: 'PRODUCT',
    feedback: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'PRODUCT', label: 'Product Quality', icon: <Package size={18} /> },
    { id: 'DELIVERY', label: 'Delivery Service', icon: <Truck size={18} /> },
    { id: 'PRICE', label: 'Pricing/Value', icon: <Star size={18} /> },
    { id: 'SUGGESTION', label: 'New Suggestion', icon: <Lightbulb size={18} /> },
    { id: 'OTHER', label: 'Other', icon: <HelpCircle size={18} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await post('feedback/listCreate/', feedback);
    if(result.success) {
      console.log("feedback sent");
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageWrapper>
        <LocalStyle />
        <Container>
          <SuccessWrapper
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="success-icon-wrap">
              <CheckCircle size={44} color="#B8935A" strokeWidth={1.5} />
            </div>
            <h2>Thank You!</h2>
            <p>Your feedback helps us make Elsa Diary better for everyone.</p>
            <div className="btn-group">
              <button className="primary" onClick={() => setSubmitted(false)}>Submit Another</button>
              <button className="secondary" onClick={() => navigate(-1)}>Go Back</button>
            </div>
          </SuccessWrapper>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <LocalStyle />
      <Container>
        <HeaderSection>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </BackButton>
          <h1>Share Your Thoughts</h1>
          <p>Select a category and tell us about your experience.</p>
        </HeaderSection>

        <FeedbackForm onSubmit={handleSubmit}>
          <Label>What is your feedback about?</Label>
          <CategoryGrid>
            {categories.map((cat) => (
              <CategoryCard 
                key={cat.id}
                $active={feedback.category === cat.id}
                onClick={() => setFeedback({...feedback, category: cat.id})}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="icon-wrap">{cat.icon}</div>
                <span>{cat.label}</span>
              </CategoryCard>
            ))}
          </CategoryGrid>

          <InputGroup>
            <Label>Your Feedback</Label>
            <textarea 
              rows="5"
              placeholder="Tell us about your experience in detail..."
              required
              value={feedback.feedback}
              onChange={(e) => setFeedback({...feedback, feedback: e.target.value})}
            />
          </InputGroup>

          <ButtonGroup>
            <SubmitButton type="submit">
              <Send size={16} /> Submit Feedback
            </SubmitButton>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              Cancel and Return
            </CancelButton>
          </ButtonGroup>
        </FeedbackForm>
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
  max-width: 840px; 
  margin: 0 auto; 
  padding: 80px 5%;
`;

const HeaderSection = styled.div`
  text-align: center; 
  margin-bottom: 50px; 
  position: relative;
  
  h1 { 
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 2.6rem); 
    color: #2A1F10; 
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    font-size: 1.05rem;
    font-weight: 500;
  }
`;

const BackButton = styled.button`
  position: absolute; 
  left: 0; 
  top: 12px;
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
  
  @media (max-width: 768px) { 
    position: relative; 
    top: 0;
    margin-bottom: 24px; 
  }
`;

const FeedbackForm = styled.form`
  background: #FFFFFF; 
  padding: 45px 40px; 
  border-radius: 32px;
  border: 1px solid #EAE3D6; 
  box-shadow: 0 10px 30px rgba(42, 31, 16, 0.03);

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Label = styled.label`
  display: block; 
  font-weight: 700; 
  color: #2A1F10; 
  margin-bottom: 14px; 
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CategoryGrid = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); 
  gap: 12px; 
  margin-bottom: 36px;
`;

const CategoryCard = styled(motion.button)`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 12px;
  padding: 20px 12px; 
  border-radius: 20px; 
  border: 1px solid ${props => props.$active ? '#2A1F10' : '#EAE3D6'};
  background: ${props => props.$active ? '#FFFFFF' : '#FFFFFF'};
  color: ${props => props.$active ? '#B8935A' : '#6B5C4A'};
  cursor: pointer; 
  transition: border-color 0.25s, color 0.25s, box-shadow 0.25s;
  box-shadow: ${props => props.$active ? '0 6px 16px rgba(42,31,16,0.04)' : 'none'};
  
  .icon-wrap {
    background: #FAF7F2;
    padding: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$active ? '#B8935A' : '#8C7A61'};
    border: 1px solid #FAF7F2;
  }

  span { 
    font-size: 0.85rem; 
    font-weight: 700; 
    text-align: center;
    line-height: 1.2;
  }
  
  &:hover { 
    border-color: ${props => props.$active ? '#2A1F10' : '#B8935A'}; 
  }
`;

const InputGroup = styled.div`
  margin-bottom: 30px;
  
  textarea {
    width: 100%; 
    padding: 16px 18px; 
    border-radius: 14px; 
    border: 1px solid #D8CFBE;
    font-family: 'DM Sans', sans-serif; 
    font-size: 0.98rem;
    color: #2A1F10;
    background: #FFFFFF; 
    transition: all 0.25s ease;
    box-sizing: border-box;
    resize: vertical;
    
    &::placeholder { color: #A89B87; }
    
    &:focus { 
      outline: none; 
      border-color: #2A1F10; 
      box-shadow: 0 0 0 4px rgba(42, 31, 16, 0.05);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 12px;
`;

const SubmitButton = styled.button`
  width: 100%; 
  padding: 16px; 
  background: #2A1F10; 
  color: #FFFFFF;
  border: none; 
  border-radius: 12px; 
  font-weight: 700; 
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px;
  box-shadow: 0 8px 20px rgba(42, 31, 16, 0.12);
  transition: background-color 0.25s ease, transform 0.2s;
  
  &:hover { 
    background: #40301B; 
    transform: translateY(-1px); 
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  width: 100%; 
  padding: 12px; 
  background: none; 
  color: #A89B87;
  border: none; 
  font-weight: 700; 
  font-size: 0.95rem;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover { color: #EF4444; }
`;

const SuccessWrapper = styled(motion.div)`
  text-align: center; 
  background: #FFFFFF;
  padding: 60px 40px;
  border-radius: 32px;
  border: 1px solid #EAE3D6;
  box-shadow: 0 10px 30px rgba(42, 31, 16, 0.03);
  max-width: 540px;
  margin: 0 auto;
  box-sizing: border-box;
  
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
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    margin: 0 0 12px; 
    color: #2A1F10; 
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    margin: 0 0 32px; 
    font-size: 1.05rem;
    line-height: 1.6;
    font-weight: 500;
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

export default Feedback;