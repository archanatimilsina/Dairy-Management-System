import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';

const LocalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700;800&display=swap');
  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const LoginPage = () => {
  const { error, loading, post } = useApi();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await post('login/', formData);
    if (result.success) {
      localStorage.setItem("email", result.data?.user.email);
      localStorage.setItem("username", result.data?.user.username);
      localStorage.setItem('access_token', result.data?.access);
      localStorage.setItem('refresh_token', result.data?.refresh);
      localStorage.setItem("IsLoggedIn", true);
      navigate('/');
    }
  };

  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
      return Object.values(error).flat().join(' ');
    }
    return 'An unexpected error occurred.';
  };

  return (
    <AuthWrapper>
      <LocalStyle />
      <AuthCard>
        <LogoArea>
          <h2>Welcome Back</h2>
          <p>Fresh dairy is just a login away.</p>
        </LogoArea>

        <FormContainer onSubmit={handleSubmit}>
          {error && (
            <ErrorBanner>
              <AlertCircle size={16} />
              <span>{renderError()}</span>
            </ErrorBanner>
          )}
          
          <InputGroup>
            <label>Email Address Or Username</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Enter here" 
                onChange={handleChange} 
                required 
                name="emailOrUsername"
              />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
                type={showPassword ? 'text' : 'password'} 
                name="password"
              />
              <IconButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </div>
          </InputGroup>

          <FlexRow>
            <Link to="/forgotPassword">Forgot Password?</Link>
          </FlexRow>

          <SubmitBtn disabled={loading}>
            {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </SubmitBtn>
        </FormContainer>

        <SwitchText>
          New to Elsa Diary? <Link to="/registerPage">Create an account</Link>
        </SwitchText>
      </AuthCard>

    </AuthWrapper>
  );
};

export default LoginPage;

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

const FormContainer = styled.form`
  display: flex; 
  flex-direction: column; 
  gap: 20px;
`;

const ErrorBanner = styled.div`
  background: #FFF5F5;
  color: #C53030;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #FEB2B2;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: left;
  line-height: 1.4;

  span {
    flex: 1;
  }
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

const FlexRow = styled.div`
  display: flex; 
  justify-content: flex-end; 
  align-items: center;
  font-size: 0.9rem;
  
  a { 
    color: #B8935A; 
    font-weight: 700; 
    text-decoration: none; 
    transition: color 0.2s;
    
    &:hover { 
      color: #2A1F10;
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
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px;
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
    box-shadow: none;
  }
`;

const SwitchText = styled.p`
  margin-top: 30px; 
  font-size: 0.95rem; 
  color: #6B5C4A;
  font-weight: 500;
  
  a { 
    color: #B8935A; 
    font-weight: 700; 
    text-decoration: none; 
    margin-left: 4px;
    transition: color 0.2s;
    
    &:hover { 
      color: #2A1F10; 
    } 
  }
`;

const IconButton = styled.button`
  background: none; 
  border: none; 
  color: #A89B87; 
  cursor: pointer;
  display: flex; 
  align-items: center; 
  padding: 0; 
  margin-left: 8px;
  transition: color 0.2s;
  
  &:hover { 
    color: #2A1F10; 
  }
`;