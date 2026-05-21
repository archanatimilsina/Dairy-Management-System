import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Edit2, Trash2, X, MessageSquare, Clock, User } from 'lucide-react';
import useApi from '../../hooks/useApi';

const ContactsPage = () => {
  const { get, patch, del } = useApi();
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [tempNote, setTempNote] = useState("");

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setTempNote(contact.admin_note || "");
    setIsModalOpen(true);
  };

  const handleSaveNote = async () => {
    const result = await patch(`contact/detail/${editingContact.id}`, { admin_note: tempNote });
    if (result.success) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, admin_note: tempNote } : c));
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchContact = async () => {
      const result = await get('contact/listCreate/');
      if (result.success) setContacts(result.data);
    };
    fetchContact();
  }, [get]);

  const deleteContact = async (contactId) => {
    const result = await del(`contact/detail/${contactId}`);
    if (result.success) setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  return (
    <Container>
      <PageHeader>
        <h2>Customer Inquiries</h2>
        <p>Manage and track incoming contact requests.</p>
      </PageHeader>

      <TableCard>
        <StyledTable>
          <thead>
            <tr>
              <th>Contact Details</th>
              <th>Message Content</th>
              <th>Admin Note</th>
              <th>Status</th>
              <th className="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <UserInfo>
                    <div className="avatar"><User size={18} /></div>
                    <div>
                      <span className="name">{contact.name}</span>
                      <span className="email">{contact.email}</span>
                    </div>
                  </UserInfo>
                </td>
                <td>
                  <MsgCell>
                    <strong>{contact.subject}</strong>
                    <p>{contact.message}</p>
                  </MsgCell>
                </td>
                <td>
                  <NoteArea onClick={() => openEditModal(contact)}>
                    {contact.admin_note || "Add a note..."}
                  </NoteArea>
                </td>
                <td>
                  <StatusBadge $status={contact.status}>{contact.status}</StatusBadge>
                </td>
                <td className="center">
                  <ActionGroup>
                    <button className="edit" onClick={() => openEditModal(contact)}><Edit2 size={16} /></button>
                    <button className="delete" onClick={() => deleteContact(contact.id)}><Trash2 size={16} /></button>
                  </ActionGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableCard>

      {isModalOpen && (
        <ModalOverlay>
          <ModalCard>
            <ModalHeader>
              <h3>Edit Internal Note</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </ModalHeader>
            <ModalBody>
              <p>For: <strong>{editingContact?.name}</strong></p>
              <textarea value={tempNote} onChange={(e) => setTempNote(e.target.value)} placeholder="Add internal context here..." autoFocus />
            </ModalBody>
            <ModalFooter>
              <button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="save" onClick={handleSaveNote}>Save Changes</button>
            </ModalFooter>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div` font-family: 'DM Sans', sans-serif; `;
const PageHeader = styled.div` margin-bottom: 30px; h2 { color: #2A1F10; font-size: 1.8rem; margin: 0; } p { color: #8A7B6D; margin: 5px 0 0; } `;
const TableCard = styled.div` background: white; border-radius: 20px; border: 1px solid #EAE3D6; overflow: hidden; box-shadow: 0 4px 15px rgba(42,31,16,0.05); `;

const StyledTable = styled.table`
  width: 100%; border-collapse: collapse;
  th { text-align: left; padding: 20px; color: #8A7B6D; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #F5F2EE; }
  td { padding: 20px; border-bottom: 1px solid #F5F2EE; }
  .center { text-align: center; }
`;

const UserInfo = styled.div` display: flex; align-items: center; gap: 12px; .avatar { background: #F5F2EE; padding: 8px; border-radius: 10px; color: #B8935A; } .name { display: block; font-weight: 700; color: #2A1F10; } .email { font-size: 0.8rem; color: #8A7B6D; } `;
const MsgCell = styled.div` max-width: 300px; strong { display: block; font-size: 0.9rem; margin-bottom: 4px; } p { font-size: 0.85rem; color: #666; margin: 0; } `;
const NoteArea = styled.div` background: #F5F2EE; padding: 10px 15px; border-radius: 10px; font-size: 0.85rem; color: #2A1F10; cursor: pointer; transition: 0.3s; &:hover { background: #EAE3D6; } `;
const StatusBadge = styled.span` padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${props => props.$status === 'New' ? '#EAE3D6' : '#F5F2EE'}; color: #2A1F10; `;
const ActionGroup = styled.div` display: flex; gap: 10px; justify-content: center; button { background: none; border: none; cursor: pointer; color: #8A7B6D; transition: 0.3s; &:hover { color: #B8935A; } } `;

const ModalOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(42,31,16,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; `;
const ModalCard = styled.div` background: white; width: 400px; border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); `;
const ModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; h3 { margin: 0; color: #2A1F10; } .close-btn { background: none; border: none; cursor: pointer; color: #8A7B6D; } `;
const ModalBody = styled.div` p { font-size: 0.85rem; color: #8A7B6D; margin-bottom: 10px; } textarea { width: 100%; height: 120px; border-radius: 12px; border: 1px solid #EAE3D6; padding: 15px; box-sizing: border-box; outline: none; &:focus { border-color: #B8935A; } } `;
const ModalFooter = styled.div` display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; button { padding: 10px 20px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; } .cancel { background: #F5F2EE; color: #2A1F10; } .save { background: #2A1F10; color: #FFF; &:hover { background: #B8935A; } } `;

export default ContactsPage;