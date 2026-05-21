import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, CheckCircle, ChevronLeft, Lock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams(); 
  const navigate = useNavigate();
  const { post } = useApi();
  
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
    const url = `reset-password-confirm/${uid}/${token}/`;
    
    try {
      const result = await post(url, { password });
      if (result.success) {
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
              <div className="icon-box"><Lock size={28} color="#7DAACB" /></div>
              <h2>Set New Password</h2>
              <p>Enter your new secure password to regain access.</p>
            </LogoArea>

            <form onSubmit={handleReset}>
              <FormContainer>
                <InputGroup>
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
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
                      placeholder="••••••••"
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
              <CheckCircle size={64} color="#7DAACB" />
            </div>
            <h2>Password Updated!</h2>
            <p>Your password has been changed successfully.</p>
            <p className="small">Redirecting to login...</p>
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


const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f7f6;
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 45px 35px;
  border-radius: 30px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
  text-align: center;
`;

const LogoArea = styled.div`
  margin-bottom: 30px;
  .icon-box {
    width: 65px; height: 65px;
    background: #f0f8ff;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  h2 { font-size: 1.6rem; color: #1a1a1a; margin-bottom: 8px; }
  p { color: #888; font-size: 0.9rem; }
`;

const FormContainer = styled.div`
  display: flex; flex-direction: column; gap: 20px;
`;

const InputGroup = styled.div`
  text-align: left;
  label { font-size: 0.8rem; font-weight: 600; color: #555; margin-bottom: 8px; display: block; }
  .input-wrapper {
    display: flex; align-items: center;
    background: #f8f9fa; padding: 12px 16px; border-radius: 14px;
    border: 1px solid #eee; transition: 0.3s;
    &:focus-within { border-color: #7DAACB; background: white; }
    input { border: none; background: transparent; outline: none; width: 100%; margin-left: 12px; font-weight: 500; }
  }
`;

const ToggleButton = styled.button`
  background: none; border: none; color: #aaa; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  &:hover { color: #7DAACB; }
`;

const SubmitBtn = styled.button`
  background: #2d3436; color: white; border: none; padding: 14px;
  border-radius: 14px; font-weight: 600; font-size: 1rem;
  cursor: pointer; transition: 0.3s; margin-top: 10px;
  &:hover { background: #7DAACB; transform: translateY(-1px); }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const ErrorMessage = styled.p`
  color: #ff7675;
  font-size: 0.8rem;
  margin: -10px 0 0 5px;
  text-align: left;
`;

const SuccessArea = styled.div`
  padding: 20px 0;
  .success-icon { margin-bottom: 20px; }
  h2 { font-size: 1.5rem; color: #2d3436; margin-bottom: 10px; }
  p { color: #636e72; }
  .small { font-size: 0.85rem; color: #aaa; margin-top: 15px; }
`;

const BackButton = styled.button`
  background: none; border: none;
  margin-top: 30px; display: flex; align-items: center; justify-content: center;
  gap: 5px; color: #999; font-size: 0.85rem; font-weight: 600; cursor: pointer;
  &:hover { color: #1a1a1a; }
`;