import React from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const LocalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const NotFound = () => {
  return (
    <Container>
      <LocalStyle />
      
      <ContentCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }}
      >
        <ErrorCode>404</ErrorCode>
        
        <Title>
          Page <span>Not Found</span>
        </Title>
        
        <Description>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable. Let us guide you back to our fresh selections.
        </Description>
        
   
      </ContentCard>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  min-height: 85vh;
  width: 100%;
  overflow-x: hidden;
`;

const ContentCard = styled(motion.div)`
  background: #FFFFFF;
  padding: 60px 40px;
  border-radius: 32px;
  border: 1px solid #EAE3D6;
  box-shadow: 0 10px 35px rgba(42, 31, 16, 0.03);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 480px) {
    padding: 40px 20px;
    border-radius: 24px;
  }
`;

const ErrorCode = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(6rem, 18vw, 10rem);
  font-weight: 700;
  color: #B8935A; 
  margin: 0;
  line-height: 0.9;
  letter-spacing: -2px;
  user-select: none;
  background: linear-gradient(180deg, #B8935A 0%, #8C7A61 100%);
  -webkit-text-fill-color: transparent;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: #2A1F10;
  margin-top: 16px;
  font-weight: 700;
  
  span {
    color: #B8935A;
    font-style: italic;
    font-weight: 400;
  }
`;

const Description = styled.p`
  font-family: 'DM Sans', sans-serif;
  color: #6B5C4A;
  max-width: 460px;
  margin: 16px 0 36px;
  line-height: 1.65;
  font-size: 1.05rem;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #2A1F10;
  color: #FFFFFF;
  text-decoration: none;
  padding: 16px 36px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 8px 20px rgba(42, 31, 16, 0.12);
  transition: background-color 0.25s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background: #40301B;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(42, 31, 16, 0.18);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(42, 31, 16, 0.1);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(-4px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;