import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, ChevronLeft, CheckCircle } from 'lucide-react';
import useApi from '../../hooks/useApi';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
const {post, error, loading} = useApi()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result= await post('forgot-password/',{email})
    if(result.success)
    {
      setSubmitted(true);
    }
  
  };

  return (
    <AuthWrapper>
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
                    <Mail size={18} />
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
    <CheckCircle size={50} color="#7DAACB" />
  </div>
  <h2>Check your email</h2>
  <p>We've sent a recovery link to <br/><strong>{email}</strong></p>
  <p className="small">Please check your inbox and follow the instructions to reset your password.</p>
  
  {/* Add this "Resend" option */}
  <ResendLink onClick={() => setSubmitted(false)}>
    Didn't get the email? Try again
  </ResendLink>
</SuccessArea>
        )}

        <BackButton href="/loginPage">
          <ChevronLeft size={18} /> Back to Login
        </BackButton>
      </AuthCard>
    </AuthWrapper>
  );
};

export default ForgotPassword;


const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #CFECF3 0%, #ffffff 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white; width: 100%; max-width: 450px;
  padding: 50px 40px; border-radius: 40px;
  box-shadow: 0 20px 60px rgba(125, 170, 203, 0.15);
  text-align: center;
`;

const LogoArea = styled.div`
  margin-bottom: 35px;
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
    display: flex; align-items: center; background: #f8f9fa;
    padding: 14px 18px; border-radius: 16px; border: 2px solid transparent;
    transition: 0.3s;
    &:focus-within { border-color: #7DAACB; background: white; }
    input { border: none; background: transparent; outline: none; width: 100%; margin-left: 10px; font-weight: 500; }
  }
`;

const SubmitBtn = styled.button`
  background: #2d3436; color: white; border: none; padding: 16px;
  border-radius: 16px; font-weight: 700; font-size: 1rem;
  cursor: pointer; transition: 0.3s; margin-top: 10px;
  &:hover { background: #7DAACB; transform: translateY(-2px); }
  &:disabled { background: #b2bec3; cursor: not-allowed; transform: none; }
`;

const ErrorMessage = styled.p`
  color: #e74c3c; font-size: 0.85rem; font-weight: 500; margin-top: -5px;
`;

const SuccessArea = styled.div`
  .success-icon { margin-bottom: 20px; }
  h2 { color: #2d3436; margin-bottom: 10px; }
  p { color: #636e72; font-size: 1rem; margin-bottom: 15px; }
  .small { font-size: 0.85rem; color: #b2bec3; }
`;

const BackButton = styled.a`
  margin-top: 25px; display: flex; align-items: center; justify-content: center;
  gap: 5px; color: #b2bec3; font-size: 0.9rem; text-decoration: none; font-weight: 600;
  &:hover { color: #2d3436; }
`;

const ResendLink = styled.button`
  background: none; border: none; color: #7DAACB;
  font-weight: 600; cursor: pointer; margin-top: 20px;
  text-decoration: underline;
  &:hover { color: #2d3436; }
`;