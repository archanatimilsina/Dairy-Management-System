import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, AtSign } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';

const LocalStyle = createGlobalStyle`  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const RegisterPage = () => {
  const { loading, error, post } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    contact: '',
    password: '',
    confirm_password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    const result = await post('register/', formData);
    console.log(result);
    if (!result.success) {
      console.error("Registration error:", error);
    }
    if (result.success) {
      localStorage.setItem('access_token', result.data.access);
      localStorage.setItem('refresh_token', result.data.refresh);
      localStorage.setItem('username', result.data.user.username);
      localStorage.setItem('IsLoggedIn', 'true');
      navigate('/');
    }
  };

  return (
    <AuthWrapper>
      <LocalStyle />
      <AuthCard>
        <LogoArea>
          <div className="logo-circle">E</div>
          <h2>Create Account</h2>
          <p>Join the Elsa Diary family today.</p>
        </LogoArea>

        <FormContainer onSubmit={handleSubmit}>
          <FormRow>
            <InputGroup>
              <label>First Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  name="first_name" 
                  type="text" 
                  placeholder="First name" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </InputGroup>
            
            <InputGroup>
              <label>Last Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  name="last_name" 
                  type="text" 
                  placeholder="Last name" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </InputGroup>
          </FormRow>

          <InputGroup>
            <label>Username</label>
            <div className="input-wrapper">
              <AtSign size={18} className="input-icon" />
              <input 
                name="username" 
                type="text" 
                placeholder="Enter your username here" 
                onChange={handleChange} 
                required 
              />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                name="email" 
                type="email" 
                placeholder="Enter your email here" 
                onChange={handleChange} 
                required 
              />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input 
                name="contact" 
                type="tel" 
                placeholder="Enter your contact number here" 
                onChange={handleChange} 
              />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Create Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
              />
              <IconButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </div>
          </InputGroup>

          <InputGroup>
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                name="confirm_password" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
              />
              <IconButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </div>
          </InputGroup>

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? "Processing..." : <>Get Started <ArrowRight size={18} /></>}
          </SubmitBtn>
        </FormContainer>

        <SwitchText>
          Already have an account? <Link to="/loginPage">Login here</Link>
        </SwitchText>
      </AuthCard>
    </AuthWrapper>
  );
};

export default RegisterPage;

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FAF7F2;
  padding: 60px 24px;
  box-sizing: border-box;
`;

const AuthCard = styled.div`
  background: #FFFFFF;
  width: 100%;
  max-width: 520px;
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
  
  .logo-circle {
    width: 64px; 
    height: 64px;
    background: #2A1F10;
    border-radius: 20px;
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; 
    font-weight: 800; 
    color: #FAF7F2;
    margin: 0 auto 16px;
  }
  
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

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const InputGroup = styled.div`
  text-align: left;
  flex: 1;
  
  label { 
    font-size: 0.85rem; 
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
    opacity: 1;
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