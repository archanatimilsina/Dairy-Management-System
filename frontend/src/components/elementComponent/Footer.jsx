import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiInstagram, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';

const FooterSection = () => {
  const navigate = useNavigate();
  
  return (
    <FooterWrapper>
      <div className="footer-content">
        {/* Brand Section */}
        <BrandSection>
          <h3 onClick={() => navigate("/")}>Elsa<span>Dairy</span></h3>
          <p>
            Bringing the purity of local dairy directly to your digital doorstep. 
            Quality you can trust, fresh from the farm.
          </p>
          <SocialIcons>
            <FiInstagram title="Instagram" />
            <FiFacebook title="Facebook" />
            <FiTwitter title="Twitter" />
            <FiMail title="Email" />
          </SocialIcons>
        </BrandSection>

        {/* Links Grid */}
        <LinksGrid>
          <div className="link-column">
            <h4>Explore</h4>
            <span onClick={() => navigate("/AboutUs")}>Our Story</span>
            <span onClick={() => navigate("/facescanpage")}>Products</span>
          </div>

          <div className="link-column">
            <h4>Support</h4>
            <span onClick={() => navigate("/brandContact")}>Contact Us</span>
            <span onClick={() => navigate("/feedback")}>Feedback</span>
            <span onClick={() => navigate("/datafillup")}>Services</span>
          </div>
        </LinksGrid>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Elsa Dairy Co. Built for quality.</p>
        <div className="legal">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </FooterWrapper>
  );
};

// --- STYLED COMPONENTS ---

const FooterWrapper = styled.footer`
  /* Dark  Background */
  background: #1a1e21; 
  padding: 80px 8% 40px;
  margin-top: 120px;
  color: #ffffff;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 60px;
    margin-bottom: 60px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 40px;
    }
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #888;
    font-size: 0.85rem;

    .legal span {
      margin-left: 25px;
      cursor: pointer;
      transition: 0.3s;
      &:hover { color: #7DAACB; }
    }

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 20px;
      text-align: center;
      .legal span { margin: 0 12px; }
    }
  }
`;

const BrandSection = styled.div`
  flex: 1.5;
  h3 {
    font-size: 1.8rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 20px;
    cursor: pointer;
    letter-spacing: -0.5px;
    span { color: #7DAACB; }
  }
  p {
    color: #a0a0a0;
    font-size: 1rem;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 25px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 1.3rem;
  svg {
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover { 
      color: #7DAACB; 
      transform: translateY(-5px); 
    }
  }
`;

const LinksGrid = styled.div`
  flex: 2;
  display: flex;
  justify-content: flex-end;
  gap: 100px;

  .link-column {
    display: flex;
    flex-direction: column;
    h4 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #ffffff;
      margin-bottom: 25px;
      font-weight: 800;
      opacity: 0.9;
    }
    span {
      color: #a0a0a0;
      font-size: 0.95rem;
      margin-bottom: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 400;
      &:hover { 
        color: #7DAACB; 
        padding-left: 5px; 
      }
    }
  }

  @media (max-width: 900px) { gap: 60px; }
  @media (max-width: 768px) { justify-content: flex-start; }
`;

export default FooterSection;