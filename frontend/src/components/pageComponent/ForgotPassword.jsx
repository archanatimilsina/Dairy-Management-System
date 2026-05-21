import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Mail, ChevronLeft, CheckCircle } from 'lucide-react';
import useApi from '../../hooks/useApi';

const LocalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700;800&display=swap');
  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { post, error, loading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await post('forgot-password/', { email });
    if (result.success) {
      setSubmitted(true);
    }
  };

  return (
    <AuthWrapper>
      <LocalStyle />
      <AuthCard>
        {!submitted ? (
          <>
            <LogoArea>
              <h2>Reset Password</h2>
              <p>Enter your email and we'll send a reset link.</p>
            </LogoArea>
            <form onSubmit={handleSubmit}>
              <FormContainer>
                <InputGroup>
                  <label>Registered Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </InputGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <SubmitBtn type="submit" disabled={loading}>
                  {loading ? "Sending link..." : "Send Reset Link"}
                </SubmitBtn>
              </FormContainer>
            </form>
          </>
        ) : (
          <SuccessArea>
            <div className="success-icon">
              <CheckCircle size={44} color="#B8935A" strokeWidth={1.5} />
            </div>
            <h2>Check your email</h2>
            <p className="description">We've sent a recovery link to <br/><strong>{email}</strong></p>
            <p className="small">Please check your inbox and follow the instructions to reset your password.</p>
            
            <ResendLink onClick={() => setSubmitted(false)}>
              Didn't get the email? Try again
            </ResendLink>
          </SuccessArea>
        )}
        <BackButton href="/loginPage">
          <ChevronLeft size={16} /> Back to Login
        </BackButton>
      </AuthCard>
    </AuthWrapper>
  );
};

export default ForgotPassword;

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex; 
  align-items: center; 
  justify-content: center;
  background-color: #FAF7F2;
  padding: 24px;
  box-sizing: border-box;
`;

const AuthCard = styled.div`
  background: #FFFFFF; 
  width: 100%; 
  max-width: 460px;
  padding: 50px 40px; 
  border-radius: 32px;
  border: 1px solid #EAE3D6;
  box-shadow: 0 12px 40px rgba(42, 31, 16, 0.03);
  box-sizing: border-box;
  text-align: center;

  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`;

const LogoArea = styled.div`
  margin-bottom: 35px;
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem; 
    color: #2A1F10; 
    margin: 0 0 8px; 
    font-weight: 700;
  }
  
  p { 
    color: #6B5C4A; 
    font-size: 0.98rem;
    font-weight: 500;
  }
`;

const FormContainer = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 20px;
`;

const InputGroup = styled.div`
  text-align: left;
  
  label { 
    font-size: 0.88rem; 
    font-weight: 700; 
    color: #2A1F10; 
    margin: 0 0 8px 2px; 
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .input-wrapper {
    display: flex; 
    align-items: center; 
    background: #FFFFFF;
    padding: 14px 18px; 
    border-radius: 14px; 
    border: 1px solid #D8CFBE;
    transition: all 0.25s ease;
    box-sizing: border-box;
    
    .input-icon {
      color: #8C7A61;
      transition: color 0.25s;
    }
    
    &:focus-within { 
      border-color: #2A1F10; 
      box-shadow: 0 0 0 4px rgba(42, 31, 16, 0.05);
      
      .input-icon {
        color: #B8935A;
      }
    }
    
    input { 
      border: none; 
      background: transparent; 
      outline: none; 
      width: 100%; 
      margin-left: 12px; 
      font-family: 'DM Sans', sans-serif;
      font-size: 0.98rem;
      color: #2A1F10;
      font-weight: 500;
      box-sizing: border-box;

      &::placeholder {
        color: #A89B87;
      }
    }
  }
`;

const SubmitBtn = styled.button`
  background: #2A1F10; 
  color: #FFFFFF; 
  border: none; 
  padding: 16px;
  border-radius: 14px; 
  font-weight: 700; 
  font-size: 1rem;
  cursor: pointer; 
  box-shadow: 0 8px 20px rgba(42, 31, 16, 0.12);
  transition: all 0.25s ease; 
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;
  
  &:hover:not(:disabled) { 
    background: #40301B; 
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(42, 31, 16, 0.16);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled { 
    background: #D8CFBE; 
    color: #FFFFFF;
    cursor: not-allowed; 
    transform: none; 
    box-shadow: none;
  }
`;

const ErrorMessage = styled.p`
  color: #C53030; 
  font-size: 0.88rem; 
  font-weight: 600; 
  margin: -4px 0 0 2px;
  text-align: left;
  line-height: 1.4;
`;

const SuccessArea = styled.div`
  .success-icon { 
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
    font-size: 1.9rem;
    color: #2A1F10; 
    margin: 0 0 12px; 
    font-weight: 700;
  }
  
  .description { 
    color: #6B5C4A; 
    font-size: 1.05rem; 
    margin: 0 0 16px;
    line-height: 1.5;
    
    strong {
      color: #2A1F10;
    }
  }
  
  .small { 
    font-size: 0.9rem; 
    color: #8C7A61; 
    line-height: 1.5;
    margin: 0 0 28px;
  }
`;

const BackButton = styled.a`
  margin-top: 30px; 
  display: inline-flex; 
  align-items: center; 
  justify-content: center;
  gap: 6px; 
  color: #6B5C4A; 
  font-size: 0.95rem; 
  text-decoration: none; 
  font-weight: 700;
  transition: color 0.2s;
  
  &:hover { 
    color: #B8935A; 
  }
`;

const ResendLink = styled.button`
  background: none; 
  border: none; 
  color: #B8935A;
  font-weight: 700; 
  font-size: 0.95rem;
  cursor: pointer; 
  margin-top: 8px;
  text-decoration: underline;
  transition: color 0.2s;
  font-family: 'DM Sans', sans-serif;
  
  &:hover { 
    color: #2A1F10; 
  }
`;