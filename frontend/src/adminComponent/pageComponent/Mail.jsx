import React, { useState } from 'react';
import styled from 'styled-components';
import { Send, Paperclip, X, User, Type, MessageSquare } from 'lucide-react';
import useApi from '../../hooks/useApi';
const SendMailPage = () => {
  const {post} = useApi()
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = async(e) => {
    e.preventDefault();
    setIsSending(true);
    const result = await post('sendMail/', formData)
    if(result.success)
    {
      console.log("Email Sent")
    }
    setTimeout(() => {
      alert(`Email sent to ${formData.to}!`);
      setIsSending(false);
      setFormData({ to: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="page-fade-in">
      <ComposeWrapper>
        <div className="form-header">
          <h3>Compose New Message</h3>
          <p>Send a direct email to your customers or staff.</p>
        </div>

        <form onSubmit={handleSend}>
          <InputGroup>
            <label><User size={16} /> To:</label>
            <input 
              type="email" 
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="customer@email.com" 
              required 
            />
          </InputGroup>

          <InputGroup>
            <label><Type size={16} /> Subject:</label>
            <input 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="e.g., Morning Delivery Update" 
              required 
            />
          </InputGroup>

          <TextAreaGroup>
            <label><MessageSquare size={16} /> Message:</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your email content here..." 
              required
            />
          </TextAreaGroup>

          <ButtonGroup>
            <button type="button" className="attachment-btn">
              <Paperclip size={18} /> Add Attachment
            </button>
            <button type="submit" className="send-btn" disabled={isSending}>
              {isSending ? "Sending..." : "Send Email"}
              <Send size={18} />
            </button>
          </ButtonGroup>
        </form>
      </ComposeWrapper>
    </div>
  );
};

// --- STYLED COMPONENTS ---

const ComposeWrapper = styled.div`
  max-width: 800px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);

  .form-header {
    margin-bottom: 30px;
    h3 { color: #2d3436; font-size: 1.5rem; margin-bottom: 5px; }
    p { color: #b2bec3; font-size: 0.9rem; }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #2d3436;
    margin-bottom: 8px;
  }
  input {
    width: 100%;
    padding: 14px 18px;
    border-radius: 12px;
    border: 2px solid #f1f2f6;
    outline: none;
    transition: 0.3s;
    font-size: 1rem;
    &:focus { border-color: #7DAACB; background: #fff; }
  }
`;

const TextAreaGroup = styled.div`
  margin-bottom: 25px;
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #2d3436;
    margin-bottom: 8px;
  }
  textarea {
    width: 100%;
    height: 250px;
    padding: 18px;
    border-radius: 12px;
    border: 2px solid #f1f2f6;
    outline: none;
    resize: vertical;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.6;
    &:focus { border-color: #7DAACB; }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .attachment-btn {
    background: none;
    border: none;
    color: #636e72;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    &:hover { color: #2d3436; }
  }

  .send-btn {
    background: #2d3436;
    color: white;
    padding: 14px 30px;
    border-radius: 14px;
    border: none;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background: #7DAACB;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(125, 170, 203, 0.4);
    }

    &:disabled {
      background: #b2bec3;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

export default SendMailPage;