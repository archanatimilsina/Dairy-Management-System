import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Edit2, Trash2, ExternalLink, X } from 'lucide-react';
import useApi from '../../hooks/useApi';
const ContactsPage = () => {
  // const [contacts, setContacts] = useState([
  //   { 
  //     id: 1, 
  //     name: "Suman Sharma", 
  //     email: "suman@email.com", 
  //     phone: "9841XXXXXX", 
  //     subject: "Wholesale Inquiry", 
  //     message: "Interested in 20L milk daily for my cafe.",
  //     adminNote: "Follow up on Monday with price list.",
  //     status: "New"
  //   },
  //   { 
  //     id: 2, 
  //     name: "Binita Thapa", 
  //     email: "binita@email.com", 
  //     phone: "9812XXXXXX", 
  //     subject: "Delivery Delay", 
  //     message: "The milk arrived at 8 AM instead of 7 AM today.",
  //     adminNote: "Apology sent. Checking with driver Ram.",
  //     status: "Resolved"
  //   }
  // ]);
  const {get} = useApi()
  const [contacts, setContacts] = useState([
 
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [tempNote, setTempNote] = useState("");

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setTempNote(contact.adminNote);
    setIsModalOpen(true);
  };

  const handleSaveNote = () => {
    setContacts(contacts.map(c => 
      c.id === editingContact.id ? { ...c, adminNote: tempNote } : c
    ));
    setIsModalOpen(false);
  };


useEffect(()=>{
  const fetchData = async ()=>{
    const result = await get('contact/listCreate/')
    if(result.success){
      console.log(result.data)
      setContacts(result.data)

    }
  }
  fetchData()
},[get])


  return (
    <div className="page-fade-in">
      <TableContainer>
        <thead>
          <tr>
            <th>User Info</th>
            <th>Subject & Message</th>
            <th>Admin Note</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>
                <div className="user-info">
                  <span className="name">{contact.name}</span>
                  <span className="email">{contact.email}</span>
                </div>
              </td>
              <td>
                <div className="msg-cell">
                  <strong>{contact.subject}</strong>
                  <p>{contact.message}</p>
                </div>
              </td>
              <td>
                <NoteArea onClick={() => openEditModal(contact)}>
                  {contact.adminNote || "Add a note..."}
                </NoteArea>
              </td>
              <td>
                <StatusBadge $status={contact.status}>{contact.status}</StatusBadge>
              </td>
              <td>
                <ActionGroup>
                  <button className="edit" onClick={() => openEditModal(contact)}><Edit2 size={16} /></button>
                  <button className="mail"><ExternalLink size={16} /></button>
                  <button className="delete"><Trash2 size={16} /></button>
                </ActionGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </TableContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalCard>
            <ModalHeader>
              <h3>Edit Admin Note</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </ModalHeader>
            <ModalBody>
              <p>Adding note for: <strong>{editingContact?.name}</strong></p>
              <textarea 
                value={tempNote} 
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Type your internal notes here..."
              />
            </ModalBody>
            <ModalFooter>
              <button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="save" onClick={handleSaveNote}>Save Changes</button>
            </ModalFooter>
          </ModalCard>
        </ModalOverlay>
      )}
    </div>
  );
};


const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  th { text-align: left; padding: 15px; color: #b2bec3; border-bottom: 2px solid #f1f2f6; font-size: 0.8rem; }
  td { padding: 15px; border-bottom: 1px solid #f1f2f6; }
  .user-info .name { display: block; font-weight: 700; color: #2d3436; }
  .user-info .email { font-size: 0.8rem; color: #636e72; }
`;

const NoteArea = styled.div`
  background: #fff9db;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #856404;
  border-left: 4px solid #f1c40f;
  cursor: pointer;
  max-width: 200px;
  &:hover { background: #fff3bf; }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  background: ${props => props.$status === 'New' ? '#d1f2eb' : '#f1f2f6'};
  color: ${props => props.$status === 'New' ? '#1abc9c' : '#b2bec3'};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  button { background: none; border: none; cursor: pointer; color: #b2bec3; &:hover { color: #7DAACB; } }
`;

/* MODAL STYLES */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  background: white;
  width: 450px;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h3 { margin: 0; color: #2d3436; }
  .close-btn { background: none; border: none; cursor: pointer; color: #b2bec3; &:hover { color: #ff7675; } }
`;

const ModalBody = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
  p { font-size: 0.9rem; color: #636e72; margin-bottom: 10px; }
  textarea {
    width: 90%;
    height: 120px;
    border-radius: 12px;
    border: 2px solid #f1f2f6;
    padding: 15px;
    font-family: inherit;
    resize: none;
    outline: none;
    &:focus { border-color: #7DAACB; }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
  button {
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    font-weight: 700;
    cursor: pointer;
  }
  .cancel { background: #f1f2f6; color: #636e72; }
  .save { background: #2d3436; color: white; &:hover { background: #7DAACB; } }
`;

export default ContactsPage;