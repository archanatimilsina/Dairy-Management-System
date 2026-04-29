import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, AtSign, AlertCircle } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const {loading, error, post} = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
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

    if (result.success) {
    localStorage.setItem('access_token',result.data.access)
    localStorage.setItem('refresh_token',result.data.refresh)
      navigate('/');
    }
  };

  const renderError = () => {
    if (!error) return null;
    
    return error;
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <LogoArea>
          <div className="logo-circle">E</div>
          <h2>Create Account</h2>
          <p>Join the Elsa Diary family today.</p>
        </LogoArea>

        <FormContainer onSubmit={handleSubmit}>
          {error && (
            <ErrorBanner>
              <AlertCircle size={18} />
              <span>{renderError()}</span>
            </ErrorBanner>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <InputGroup style={{ flex: 1 }}>
              <label>First Name</label>
              <div className="input-wrapper">
                <User size={18} />
                <input name="first_name" type="text" placeholder="Enter your first name" onChange={handleChange} required />
              </div>
            </InputGroup>
            <InputGroup style={{ flex: 1 }}>
              <label>Last Name</label>
              <div className="input-wrapper">
                <User size={18} />
                <input name="last_name" type="text" placeholder="Enter your last name" onChange={handleChange} required />
              </div>
            </InputGroup>
          </div>

          <InputGroup>
            <label>Username</label>
            <div className="input-wrapper">
              <AtSign size={18} />
              <input name="username" type="text" placeholder="Enter your username here " onChange={handleChange} required />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input name="email" type="email" placeholder="Enter your email here" onChange={handleChange} required />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Phone Number </label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input name="contact" type="tel" placeholder="Enter your contact number here " onChange={handleChange} />
            </div>
          </InputGroup>

          <InputGroup>
            <label>Create Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
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
              <Lock size={18} />
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

// --- STYLED COMPONENTS ---

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #CFECF3 0%, #ffffff 100%);
  padding: 40px 20px;
`;

const AuthCard = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  padding: 50px 40px;
  border-radius: 40px;
  box-shadow: 0 20px 60px rgba(125, 170, 203, 0.15);
  text-align: center;
`;

const ErrorBanner = styled.div`
  background: #fff5f5;
  color: #e74c3c;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #ffcccc;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
`;

const LogoArea = styled.div`
  margin-bottom: 30px;
  .logo-circle {
    width: 60px; height: 60px;
    background: #CFECF3;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800; color: #7DAACB;
    margin: 0 auto 15px;
  }
  h2 { font-size: 1.8rem; color: #2d3436; margin-bottom: 8px; }
  p { color: #b2bec3; font-size: 0.95rem; }
`;

const FormContainer = styled.form`
  display: flex; flex-direction: column; gap: 16px;
`;

const InputGroup = styled.div`
  text-align: left;
  label { font-size: 0.85rem; font-weight: 700; color: #2d3436; margin: 0 0 8px 5px; display: block; }
  .input-wrapper {
    display: flex; align-items: center;
    background: #f8f9fa; padding: 14px 18px; border-radius: 16px;
    border: 2px solid transparent; transition: 0.3s;
    color: #b2bec3;
    &:focus-within { 
      border-color: #7DAACB; 
      background: white; 
      color: #7DAACB; 
      box-shadow: 0 5px 15px rgba(125, 170, 203, 0.1);
    }
    input { 
      border: none; background: transparent; outline: none; 
      width: 100%; margin-left: 10px; font-weight: 500; color: #2d3436;
      &::placeholder { color: #d1d8e0; }
    }
  }
`;

const IconButton = styled.button`
  background: none; border: none; color: #b2bec3; cursor: pointer;
  display: flex; align-items: center; padding: 0; margin-left: 5px;
  &:hover { color: #7DAACB; }
`;

const SubmitBtn = styled.button`
  background: #2d3436; color: white; border: none; padding: 18px;
  border-radius: 18px; font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  cursor: pointer; transition: 0.3s; margin-top: 10px;
  &:hover:not(:disabled) { 
    background: #7DAACB; 
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(125, 170, 203, 0.3);
  }
  &:disabled {
    background: #b2bec3;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SwitchText = styled.p`
  margin-top: 25px; font-size: 0.9rem; color: #b2bec3;
  a { color: #7DAACB; font-weight: 700; text-decoration: none; margin-left: 5px; }
`;