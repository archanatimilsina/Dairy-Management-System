import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Lock, ArrowRight ,Eye,EyeOff,AlertCircle} from 'lucide-react';
import useApi from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';
const LoginPage = () => {
const {error, loading, post} = useApi()
const [formData, setFormData] = useState({
  emailOrUsername: '',
  password: ''
})
const [showPassword, setShowPassword] = useState(false);
const navigate= useNavigate()

  const handleChange=(e)=>
  {
setFormData({...formData,[e.target.name]:e.target.value});
  }

  const handleSubmit= async (e)=>{
     e.preventDefault()
     const result= await post('login/',formData)
     if(result.success){
localStorage.setItem('access_token',result.data?.access)
localStorage.setItem('refresh_token',result.data.refresh)
navigate('/')
     }

  }
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
      <AuthCard>
        <LogoArea>
          <h2>Welcome Back</h2>
          <p>Fresh dairy is just a login away.</p>
        </LogoArea>

        <FormContainer onSubmit={handleSubmit}>
          {error && (
            <ErrorBanner>
              <AlertCircle size={18} />
              <span>{renderError()}</span>
            </ErrorBanner>
          )}
          <InputGroup>
            <label>Email Address Or Username</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input type="text" placeholder="Enter here" onChange={handleChange} required name="emailOrUsername"/>
            </div>
          </InputGroup>

          <InputGroup>
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input placeholder="••••••••" onChange={handleChange} required type={showPassword?'text':'password'} name="password"/>
                <IconButton type="button" onClick={() => setShowPassword(!showPassword)} >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </div>
          </InputGroup>

          <FlexRow>
            <Link to="/forgotPassword">Forgot Password?</Link>
          </FlexRow>

          <SubmitBtn disabled={loading}>
            {loading ? 'Signing In': <> Sign In <ArrowRight size={18} /></>}
           
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
  background: linear-gradient(135deg, #CFECF3 0%, #ffffff 100%);
  padding: 20px;
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


const AuthCard = styled.div`
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 50px 40px;
  border-radius: 40px;
  box-shadow: 0 20px 60px rgba(125, 170, 203, 0.15);
  text-align: center;
`;

const LogoArea = styled.div`
  margin-bottom: 35px;
  .logo-circle {
    width: 60px; height: 60px;
    background: #CFECF3;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin: 0 auto 15px;
  }
  h2 { font-size: 1.8rem; color: #2d3436; margin-bottom: 8px; }
  p { color: #b2bec3; font-size: 0.95rem; }
`;

const FormContainer = styled.form`
  display: flex; flex-direction: column; gap: 18px;
`;

const InputGroup = styled.div`
  text-align: left;
  label { font-size: 0.85rem; font-weight: 700; color: #2d3436; margin: 0 0 8px 5px; display: block; }
  .input-wrapper {
    display: flex; align-items: center;
    background: #f8f9fa; padding: 14px 18px; border-radius: 16px;
    border: 2px solid transparent; transition: 0.3s;
    &:focus-within { border-color: #7DAACB; background: white; color: #7DAACB; }
    input { border: none; background: transparent; outline: none; width: 100%; margin-left: 10px; font-weight: 500; }
  }
`;

const FlexRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.85rem;
  .checkbox-label { display: flex; align-items: center; gap: 5px; color: #636e72; cursor: pointer; }
  a { color: #7DAACB; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const SubmitBtn = styled.button`
  background: #2d3436; color: white; border: none; padding: 16px;
  border-radius: 16px; font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  cursor: pointer; transition: 0.3s; margin-top: 10px;
  &:hover { background: #7DAACB; transform: translateY(-2px); }
`;

const SwitchText = styled.p`
  margin-top: 25px; font-size: 0.9rem; color: #b2bec3;
  a { color: #7DAACB; font-weight: 700; text-decoration: none; margin-left: 5px; }
`;

const BackButton = styled.a`
  margin-top: 25px; display: flex; align-items: center; justify-content: center;
  gap: 5px; color: #b2bec3; font-size: 0.9rem; text-decoration: none; font-weight: 600;
  &:hover { color: #2d3436; }
`;

const IconButton = styled.button`
  background: none; border: none; color: #b2bec3; cursor: pointer;
  display: flex; align-items: center; padding: 0; margin-left: 5px;
  &:hover { color: #7DAACB; }
`;