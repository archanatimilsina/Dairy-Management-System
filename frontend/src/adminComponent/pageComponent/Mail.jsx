import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Paperclip, User, Type, MessageSquare, Loader2 } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import useApi from '../../hooks/useApi';

const SendMailPage = () => {
  const { get, post } = useApi();
  const [userOptions, setUserOptions] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [formData, setFormData] = useState({ subject: "", message: "" });
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
    const emails = selectedRecipients.map(option => option.value);
    const payload = { to: emails, subject: formData.subject, message: formData.message };
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
    <Container>
      <ComposeWrapper>
        <div className="form-header">
          <h3>Broadcast Message</h3>
          <p>Compose and dispatch communications to selected users.</p>
        </div>

        <form onSubmit={handleSend}>
          <InputGroup>
            <label><User size={16} /> Recipients</label>
            <CreatableSelect
              isMulti
              isLoading={loadingUsers}
              options={userOptions}
              value={selectedRecipients}
              onChange={(newValue) => setSelectedRecipients(newValue)}
              placeholder="Search or type email..."
              styles={customSelectStyles}
            />
          </InputGroup>

          <InputGroup>
            <label><Type size={16} /> Subject</label>
            <input name="subject" value={formData.subject} onChange={handleInputChange} required />
          </InputGroup>

          <TextAreaGroup>
            <label><MessageSquare size={16} /> Message Content</label>
            <textarea name="message" value={formData.message} onChange={handleInputChange} required />
          </TextAreaGroup>

          <ButtonGroup>
            <button type="button" className="attachment-btn">
              <Paperclip size={18} /> Add Attachment
            </button>
            <button type="submit" className="send-btn" disabled={isSending}>
              {isSending ? (
                <>Sending... <Loader2 size={18} className="spin" /></>
              ) : (
                <>Send Broadcast <Send size={18} /></>
              )}
            </button>
          </ButtonGroup>
        </form>
      </ComposeWrapper>
    </Container>
  );
};

const customSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: '12px', padding: '4px', borderColor: state.isFocused ? '#B8935A' : '#EAE3D6',
    boxShadow: 'none', '&:hover': { borderColor: '#B8935A' }
  }),
  multiValue: (base) => ({ ...base, background: '#F5F2EE', borderRadius: '8px' }),
  multiValueLabel: (base) => ({ ...base, color: '#2A1F10', fontWeight: '600', fontSize: '0.85rem' })
};

const Container = styled.div` max-width: 800px; margin: 0 auto; `;
const ComposeWrapper = styled.div` background: white; border-radius: 20px; padding: 40px; border: 1px solid #EAE3D6; box-shadow: 0 4px 15px rgba(42,31,16,0.05); .form-header { margin-bottom: 30px; h3 { color: #2A1F10; font-size: 1.5rem; } p { color: #8A7B6D; font-size: 0.9rem; } } `;
const InputGroup = styled.div` margin-bottom: 20px; label { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: #2A1F10; margin-bottom: 8px; } input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #EAE3D6; outline: none; &:focus { border-color: #B8935A; } } `;
const TextAreaGroup = styled.div` margin-bottom: 25px; label { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: #2A1F10; margin-bottom: 8px; } textarea { width: 100%; height: 200px; padding: 16px; border-radius: 12px; border: 1px solid #EAE3D6; outline: none; resize: vertical; &:focus { border-color: #B8935A; } } `;
const ButtonGroup = styled.div` display: flex; justify-content: space-between; align-items: center; .attachment-btn { background: none; border: none; color: #8A7B6D; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; } .send-btn { background: #2A1F10; color: white; padding: 12px 24px; border-radius: 12px; border: none; font-weight: 700; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; &:hover { background: #B8935A; } &:disabled { opacity: 0.6; } .spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } } `;

export default SendMailPage;