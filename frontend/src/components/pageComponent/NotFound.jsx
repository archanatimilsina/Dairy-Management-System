import React from 'react';
import {  Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFound = () => {

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable. 
      </Description>
      
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
  padding: 80px 20px;
  min-height: 60vh;
`;

const ErrorCode = styled.h1`
  font-size: clamp(5rem, 15vw, 8rem);
  font-weight: 800;
  color: #7DAACB; 
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #2d3436;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Description = styled.p`
  color: #636e72;
  max-width: 500px;
  margin: 20px 0 40px;
  line-height: 1.6;
`;
