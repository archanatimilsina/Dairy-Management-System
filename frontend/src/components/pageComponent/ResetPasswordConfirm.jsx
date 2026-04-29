import React, { useState } from 'react';
import styled from 'styled-components';
import {  Eye, EyeOff, CheckCircle, ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
const ResetPasswordConfirm = () => {
  const { uid, token } = useParams(); 
  const navigate = useNavigate();
  const {post} = useApi()
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    
    setLoading(true);
    setError('');
const url = `reset-password-confirm/${uid}/${token}/`
   try {
    const result= await post(url,{password})
if(result.success)
{
  setCompleted(true);
  setTimeout(() => navigate('/loginPage'), 3000);
}
      
    } catch (err) {
      console.error(err);
      setError("This link is invalid or has expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        {!completed ? (
          <>
            <LogoArea>
              <h2>Set New Password</h2>
              <p>Please enter your new secure password below.</p>
            </LogoArea>

            <form onSubmit={handleReset}>
              <FormContainer>
                <InputGroup>
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Minimum 8 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </ToggleButton>
                  </div>
                </InputGroup>

                <InputGroup>
                  <label>Confirm New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      placeholder="Repeat new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </InputGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <SubmitBtn type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </SubmitBtn>
              </FormContainer>
            </form>
          </>
        ) : (
          <SuccessArea>
            <div className="success-icon">
              <CheckCircle size={60} color="#7DAACB" />
            </div>
            <h2>Password Updated!</h2>
            <p>Your password has been changed successfully.</p>
            <p className="small">Redirecting you to login page...</p>
          </SuccessArea>
        )}

        {!completed && (
            <BackButton onClick={() => navigate('/loginPage')}>
                <ChevronLeft size={18} /> Back to Login
            </BackButton>
        )}
      </AuthCard>
    </AuthWrapper>
  );
};

export default ResetPasswordConfirm;

// --- STYLED COMPONENTS ---

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #CFECF3 0%, #ffffff 100%);
  padding: 20px;
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

const FormContainer = styled.div`
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
    input { border: none; background: transparent; outline: none; width: 100%; margin-left: 10px; font-weight: 500; color: #2d3436; }
  }
`;

const ToggleButton = styled.button`
  background: none; border: none; color: #b2bec3; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
  &:hover { color: #7DAACB; }
`;

const SubmitBtn = styled.button`
  background: #2d3436; color: white; border: none; padding: 16px;
  border-radius: 16px; font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  cursor: pointer; transition: 0.3s; margin-top: 10px;
  &:hover { background: #7DAACB; transform: translateY(-2px); }
  &:disabled { background: #b2bec3; cursor: not-allowed; transform: none; }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 600;
  margin: -5px 0 0 5px;
  text-align: left;
`;

const SuccessArea = styled.div`
  .success-icon { margin-bottom: 20px; }
  h2 { font-size: 1.8rem; color: #2d3436; margin-bottom: 15px; }
  p { color: #636e72; font-size: 1rem; line-height: 1.5; }
  .small { font-size: 0.85rem; color: #b2bec3; margin-top: 10px; }
`;

const BackButton = styled.button`
  background: none; border: none;
  margin-top: 25px; display: flex; align-items: center; justify-content: center;
  gap: 5px; color: #b2bec3; font-size: 0.9rem; text-decoration: none; font-weight: 600;
  cursor: pointer; width: 100%;
  &:hover { color: #2d3436; }
`;