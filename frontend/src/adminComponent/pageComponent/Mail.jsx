import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Paperclip, User, Type, MessageSquare, Loader2 } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import useApi from '../../hooks/useApi';

const SendMailPage = () => {
  const { get, post } = useApi();
  const [userOptions, setUserOptions] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const result = await get('user/listView/'); 
      if (result.success) {
        const options = result.data.map(user => ({
          label: `${user.full_name} (${user.email})`,
          value: user.email
        }));
        setUserOptions(options);
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, [get]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (selectedRecipients.length === 0) {
      alert("Please select or enter at least one recipient.");
      return;
    }

    setIsSending(true);
    
    // Extract just the email strings from the select objects
    const emails = selectedRecipients.map(option => option.value);
    
    const payload = {
      to: emails, // Sending an array of emails to the backend
      subject: formData.subject,
      message: formData.message
    };

    const result = await post('sendMail/', payload);
    
    if (result.success) {
      alert(`Email successfully sent to ${emails.length} recipient(s)!`);
      setFormData({ subject: "", message: "" });
      setSelectedRecipients([]);
    } else {
      alert("Failed to send email. Please check backend logs.");
    }
    setIsSending(false);
  };

  return (
    <div className="page-fade-in">
      <ComposeWrapper>
        <div className="form-header">
          <h3>Broadcast Message</h3>
          <p>Select multiple users from your database or type custom emails.</p>
        </div>

        <form onSubmit={handleSend}>
          <InputGroup>
            <label><User size={16} /> To (Multiple):</label>
            <CreatableSelect
              isMulti
              isLoading={loadingUsers}
              options={userOptions}
              value={selectedRecipients}
              onChange={(newValue) => setSelectedRecipients(newValue)}
              placeholder="Select users or type email and press Enter..."
              formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
              styles={customSelectStyles}
            />
          </InputGroup>

          <InputGroup>
            <label><Type size={16} /> Subject:</label>
            <input 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="e.g., Important Delivery Update" 
              required 
            />
          </InputGroup>

          <TextAreaGroup>
            <label><MessageSquare size={16} /> Message:</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your professional email content here..." 
              required
            />
          </TextAreaGroup>

          <ButtonGroup>
            <button type="button" className="attachment-btn">
              <Paperclip size={18} /> Add Attachment
            </button>
            <button type="submit" className="send-btn" disabled={isSending}>
              {isSending ? (
                <>Sending... <Loader2 size={18} className="spin" /></>
              ) : (
                <>Send Email <Send size={18} /></>
              )}
            </button>
          </ButtonGroup>
        </form>
      </ComposeWrapper>
    </div>
  );
};

// --- CUSTOM STYLES FOR REACT-SELECT ---
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '12px',
    padding: '6px',
    border: state.isFocused ? '2px solid #7DAACB' : '2px solid #f1f2f6',
    boxShadow: 'none',
    '&:hover': { border: '2px solid #7DAACB' }
  }),
  multiValue: (base) => ({
    ...base,
    background: '#f1f2f6',
    borderRadius: '8px',
    padding: '2px 8px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#2d3436',
    fontWeight: '600',
    fontSize: '0.85rem'
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#b2bec3',
    '&:hover': { background: '#ff7675', color: 'white' }
  })
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
  .attachment-btn { background: none; border: none; color: #636e72; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .send-btn {
    background: #2d3436; color: white; padding: 14px 30px; border-radius: 14px; border: none; font-weight: 700; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
    &:hover { background: #7DAACB; transform: translateY(-2px); }
    &:disabled { background: #b2bec3; cursor: not-allowed; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  }
`;

export default SendMailPage;