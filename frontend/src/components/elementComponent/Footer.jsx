import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FiInstagram, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa6';
import useApi from '../../hooks/useApi';

const LocalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700;800&display=swap');
`;

const FooterSection = () => {
  const navigate = useNavigate();
  const { get } = useApi();

  const [company, setCompany] = useState({
    facebook_url: null,
    instagram_url: null,
    tiktok_url: null,
    support_email: null,
  });

  useEffect(() => {
    const fetchCompany = async () => {
      const result = await get('company-info/');
      if (result.success) setCompany(result.data);
    };
    fetchCompany();
  }, [get]);

  const openLink = (url) => {
    if (url) window.open(url, '_blank', 'noopener noreferrer');
  };

  const openMail = (email) => {
    if (email) window.location.href = `mailto:${email}`;
  };

  return (
    <FooterWrapper>
      <LocalStyle />
      <div className="footer-content">
        <BrandSection>
          <h3 onClick={() => navigate("/")}>Elsa<span>Diary</span></h3>
          <p>
            Bringing the purity of local dairy directly to your digital doorstep. 
            Quality you can trust, fresh from the farm.
          </p>
          <SocialIcons>
            <SocialIcon 
              $active={!!company.instagram_url} 
              onClick={() => openLink(company.instagram_url)} 
              title="Instagram"
            >
              <FiInstagram />
            </SocialIcon>
            <SocialIcon 
              $active={!!company.facebook_url} 
              onClick={() => openLink(company.facebook_url)} 
              title="Facebook"
            >
              <FiFacebook />
            </SocialIcon>
            <SocialIcon 
              $active={!!company.tiktok_url} 
              onClick={() => openLink(company.tiktok_url)} 
              title="TikTok"
            >
              <FaTiktok />
            </SocialIcon>
            <SocialIcon 
              $active={!!company.support_email} 
              onClick={() => openMail(company.support_email)} 
              title={company.support_email || "Email"}
            >
              <FiMail />
            </SocialIcon>
          </SocialIcons>
        </BrandSection>

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

const FooterWrapper = styled.footer`
  background: #1E160C; 
  padding: 80px 8% 40px;
  margin-top: 120px;
  color: #FAF7F2;
  font-family: 'DM Sans', sans-serif;
  border-top: 1px solid #2A1F10;

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
    border-top: 1px solid rgba(234, 227, 214, 0.1);
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #A89B87;
    font-size: 0.88rem;
    font-weight: 500;

    .legal span {
      margin-left: 25px;
      cursor: pointer;
      transition: color 0.25s ease;
      &:hover { color: #B8935A; }
    }

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 16px;
      text-align: center;
      .legal span { margin: 0 12px; }
    }
  }
`;

const BrandSection = styled.div`
  flex: 1.5;
  
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 20px;
    cursor: pointer;
    letter-spacing: -0.5px;
    span { color: #B8935A; }
  }
  
  p {
    color: #D8CFBE;
    font-size: 0.98rem;
    line-height: 1.7;
    max-width: 360px;
    margin: 0 0 30px;
    font-weight: 400;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 16px;
  font-size: 1.25rem;
`;

const SocialIcon = styled.div`
  color: ${p => p.$active ? '#A89B87' : '#4A3F35'};
  cursor: ${p => p.$active ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: ${p => p.$active ? 1 : 0.35};

  svg {
    &:hover {
      color: ${p => p.$active ? '#B8935A' : 'inherit'};
      transform: ${p => p.$active ? 'translateY(-4px)' : 'none'};
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
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      margin-bottom: 25px;
      font-weight: 700;
    }
    
    span {
      color: #D8CFBE;
      font-size: 0.95rem;
      margin-bottom: 14px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      position: relative;
      
      &:hover { 
        color: #B8935A; 
        transform: translateX(4px);
      }
    }
  }

  @media (max-width: 900px) { gap: 60px; }
  @media (max-width: 768px) { justify-content: flex-start; }
`;

export default FooterSection;