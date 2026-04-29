import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const FooterSection = () => {
  const navigate = useNavigate()
  return (
  
      <Footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>Elsa Dairy</h3>
            <p>Dairy products inside your device</p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <a onClick={() => navigate("/AboutUs")} style={{cursor: 'pointer'}}>About Us</a>
            </div>

            <div className="link-group">
              <h4>Support</h4>
              <a onClick={() => navigate("/brandContact")} style={{cursor: 'pointer'}}>Contact</a>
              <a onClick={() => navigate("/feedback")} style={{cursor: 'pointer'}}>Feedback</a>
            </div>

            <div className="link-group">
              <h4>Services</h4>
              <a onClick={() => navigate("/facescanpage")} style={{cursor: 'pointer'}}>Dairy Products</a>
              <a onClick={() => navigate("/datafillup")} style={{cursor: 'pointer'}}>Customer service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>©️ 2026 Elsa Dairy. All rights reserved.</p>
        </div>
      </Footer>
  )
}
const Footer = styled.footer`
  background: #f9f9f9;
  padding: 80px 10% 40px;
  margin-top: 100px;

  .footer-container {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 50px;
  }

  .footer-brand h3 {
    font-size: 2rem;
    color: #7DAACB;
    margin-bottom: 15px;
  }

  .link-group h4 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.1rem;
  }

  .link-group a {
    display: block;
    color: #777;
    text-decoration: none;
    margin-bottom: 12px;
    font-size: 0.9rem;
    transition: 0.3s;
    &:hover { color: #7DAACB; transform: translateX(5px); }
  }

  .footer-bottom {
    border-top: 1px solid #eee;
    padding-top: 30px;
    text-align: center;
    color: #aaa;
    font-size: 0.8rem;
  }
`;

export default FooterSection