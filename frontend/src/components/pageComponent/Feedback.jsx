import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { 
  Star, Truck, Package, 
  Lightbulb, HelpCircle, Send, CheckCircle, ArrowLeft 
} from 'lucide-react';
import useApi from '../../hooks/useApi';
const Feedback = () => {
  const {post} = useApi()
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    full_name: localStorage.getItem('first_name')+ " "+ localStorage.getItem("last_name"),
    email : localStorage.getItem('email'),
    category: 'product',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'product', label: 'Product Quality', icon: <Package size={20} /> },
    { id: 'delivery', label: 'Delivery Service', icon: <Truck size={20} /> },
    { id: 'price', label: 'Pricing/Value', icon: <Star size={20} /> },
    { id: 'suggestion', label: 'New Suggestion', icon: <Lightbulb size={20} /> },
    { id: 'other', label: 'Other', icon: <HelpCircle size={20} /> },
  ];

  const handleSubmit =async (e) => {
    e.preventDefault();
    const result= await post('feedback/listCreate/' , feedback)
    if(result.success)
    {
      console.log("feedback sent")
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SuccessWrapper className="page-fade-in">
        <CheckCircle size={80} color="#7DAACB" />
        <h2>Thank You!</h2>
        <p>Your feedback helps us make Elsa Diary better for everyone.</p>
        <div className="btn-group">
          <button className="primary" onClick={() => setSubmitted(false)}>Submit Another</button>
          <button className="secondary" onClick={() => navigate(-1)}>Go to Home</button>
        </div>
      </SuccessWrapper>
    );
  }

  return (
    <Container>
      <HeaderSection>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
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
            >
              {cat.icon}
              <span>{cat.label}</span>
            </CategoryCard>
          ))}
        </CategoryGrid>

        <InputGroup>
          <Label>Your Feedback</Label>
          <textarea 
            rows="5"
            placeholder={`Tell us about your experience...`}
            required
            value={feedback.message}
            onChange={(e) => setFeedback({...feedback, message: e.target.value})}
          />
        </InputGroup>

        <ButtonGroup>
          <SubmitButton type="submit">
            <Send size={18} /> Submit Feedback
          </SubmitButton>
          <CancelButton type="button" onClick={() => navigate(-1)}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </FeedbackForm>
    </Container>
  );
};


const Container = styled.div`
  max-width: 800px; margin: 0 auto; padding: 60px 20px;
`;

const HeaderSection = styled.div`
  text-align: center; margin-bottom: 40px; position: relative;
  h1 { font-size: 2.2rem; color: #2d3436; margin-bottom: 8px; }
  p { color: #636e72; }
`;

const BackButton = styled.button`
  position: absolute; left: 0; top: 0;
  display: flex; align-items: center; gap: 8px;
  background: none; border: none; color: #7DAACB;
  font-weight: 700; cursor: pointer;
  &:hover { color: #2d3436; }
  @media (max-width: 768px) { position: static; margin-bottom: 20px; }
`;

const FeedbackForm = styled.form`
  background: white; padding: 40px; border-radius: 30px;
  border: 1px solid #f1f2f6; box-shadow: 0 10px 40px rgba(0,0,0,0.03);
`;

const Label = styled.label`
  display: block; font-weight: 700; color: #2d3436; margin-bottom: 12px; font-size: 0.95rem;
`;

const CategoryGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 30px;
`;

const CategoryCard = styled.button`
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 15px; border-radius: 16px; border: 2px solid ${props => props.$active ? '#7DAACB' : '#f1f2f6'};
  background: ${props => props.$active ? '#f8fbff' : 'white'};
  color: ${props => props.$active ? '#7DAACB' : '#636e72'};
  cursor: pointer; transition: 0.2s;
  span { font-size: 0.8rem; font-weight: 600; }
  &:hover { border-color: #7DAACB; }
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
  textarea {
    width: 100%; padding: 15px; border-radius: 12px; border: 1px solid #dfe6e9;
    font-family: inherit; background: #fdfdfd; transition: 0.2s;
    &:focus { outline: none; border-color: #7DAACB; background: white; }
  }
`;

const ButtonGroup = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const SubmitButton = styled.button`
  width: 100%; padding: 18px; background: #2d3436; color: white;
  border: none; border-radius: 16px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: 0.3s;
  &:hover { background: #7DAACB; transform: translateY(-2px); }
`;

const CancelButton = styled.button`
  width: 100%; padding: 14px; background: none; color: #b2bec3;
  border: none; font-weight: 600; cursor: pointer;
  &:hover { color: #e74c3c; }
`;

const SuccessWrapper = styled.div`
  text-align: center; padding: 100px 20px;
  h2 { margin: 20px 0 10px; color: #2d3436; }
  p { color: #636e72; margin-bottom: 30px; }
  .btn-group { display: flex; justify-content: center; gap: 15px; }
  button { padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
  .primary { background: #7DAACB; color: white; border: none; }
  .secondary { background: white; color: #7DAACB; border: 2px solid #7DAACB; }
  .secondary:hover { background: #f8fbff; }
`;

export default Feedback;