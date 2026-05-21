import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  HiOutlineBuildingOffice2, HiOutlineEnvelope, HiOutlinePhone, 
  HiOutlineMapPin, HiOutlineKey, HiPencil, HiCheck, HiXMark, HiOutlineArrowPath 
} from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import useApi from '../../hooks/useApi';

const CompanyDetails = () => {
  const { get, patch } = useApi();
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null); 
  const [tempValue, setTempValue] = useState(""); 
  const [syncing, setSyncing] = useState(false);
  
  const [details, setDetails] = useState({
    company_name: "", support_email: "", contact_phone: "",
    office_address: "", system_sender_email: "", system_password: "", 
    facebook_url: "", instagram_url: "", tiktok_url: "",
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      const result = await get('company-info/');
      if (result.success) setDetails(result.data);
      setLoading(false);
    };
    fetchCompanyData();
  }, [get]);

  const startEditing = (key, value) => { setEditingField(key); setTempValue(value || ""); };
  const cancelEditing = () => { setEditingField(null); setTempValue(""); };
  const saveField = async (key) => {
    setSyncing(true);
    const result = await patch('company-info/update/', { [key]: tempValue });
    if (result.success) {
      setDetails(prev => ({ ...prev, [key]: tempValue }));
      setEditingField(null);
    }
    setSyncing(false);
  };

  if (loading) return <LoadingWrapper><HiOutlineArrowPath className="spin" /> Synchronizing...</LoadingWrapper>;

  return (
    <Container>
      <Header>
        <h1>System Configuration</h1>
        <p>Manage corporate identity, authentication, and social channels.</p>
      </Header>

      <Grid>
        <Card>
          <CardTitle><HiOutlineBuildingOffice2 /> Corporate Identity</CardTitle>
          <FieldRow label="Company Name" value={details.company_name} isEditing={editingField === 'company_name'} onEdit={() => startEditing('company_name', details.company_name)} onCancel={cancelEditing} onSave={() => saveField('company_name')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
          <FieldRow label="Office Address" value={details.office_address} icon={<HiOutlineMapPin />} isEditing={editingField === 'office_address'} onEdit={() => startEditing('office_address', details.office_address)} onCancel={cancelEditing} onSave={() => saveField('office_address')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
          <FieldRow label="Contact Number" value={details.contact_phone} icon={<HiOutlinePhone />} isEditing={editingField === 'contact_phone'} onEdit={() => startEditing('contact_phone', details.contact_phone)} onCancel={cancelEditing} onSave={() => saveField('contact_phone')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
        </Card>

        <Card>
          <CardTitle><HiOutlineKey /> System Authentication</CardTitle>
          <FieldRow label="Sender Email" value={details.system_sender_email} icon={<HiOutlineEnvelope />} isEditing={editingField === 'system_sender_email'} onEdit={() => startEditing('system_sender_email', details.system_sender_email)} onCancel={cancelEditing} onSave={() => saveField('system_sender_email')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
          <FieldRow label="App Password" value="••••••••••••" icon={<HiOutlineKey />} isEditing={editingField === 'system_password'} onEdit={() => startEditing('system_password', "")} onCancel={cancelEditing} onSave={() => saveField('system_password')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} type="password" />
        </Card>

        <Card className="full-width">
          <CardTitle><HiOutlineEnvelope /> Social & Support Channels</CardTitle>
          <SocialGrid>
            <FieldRow label="Facebook" value={details.facebook_url} icon={<FaFacebookF />} isEditing={editingField === 'facebook_url'} onEdit={() => startEditing('facebook_url', details.facebook_url)} onCancel={cancelEditing} onSave={() => saveField('facebook_url')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
            <FieldRow label="Instagram" value={details.instagram_url} icon={<FaInstagram />} isEditing={editingField === 'instagram_url'} onEdit={() => startEditing('instagram_url', details.instagram_url)} onCancel={cancelEditing} onSave={() => saveField('instagram_url')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
            <FieldRow label="TikTok" value={details.tiktok_url} icon={<FaTiktok />} isEditing={editingField === 'tiktok_url'} onEdit={() => startEditing('tiktok_url', details.tiktok_url)} onCancel={cancelEditing} onSave={() => saveField('tiktok_url')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
            <FieldRow label="Support Email" value={details.support_email} icon={<HiOutlineEnvelope />} isEditing={editingField === 'support_email'} onEdit={() => startEditing('support_email', details.support_email)} onCancel={cancelEditing} onSave={() => saveField('support_email')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing} />
          </SocialGrid>
        </Card>
      </Grid>
    </Container>
  );
};

const FieldRow = ({ label, value, isEditing, onEdit, onCancel, onSave, tempValue, setTempValue, syncing, icon, type="text" }) => (
  <RowContainer>
    <LabelSection>
      <span className="icon">{icon || <HiPencil size={14}/>}</span>
      <span className="text">{label}</span>
    </LabelSection>
    <ValueSection>
      {isEditing ? (
        <EditGroup>
          <input type={type} value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
          <ActionButtons>
            <button className="tick" onClick={onSave} disabled={syncing}>{syncing ? <HiOutlineArrowPath className="spin" /> : <HiCheck />}</button>
            <button className="cross" onClick={onCancel}><HiXMark /></button>
          </ActionButtons>
        </EditGroup>
      ) : (
        <DisplayGroup>
          <span className="value-text">{value || <em className="placeholder">Not set</em>}</span>
          <button className="pencil" onClick={onEdit}><HiPencil size={14}/></button>
        </DisplayGroup>
      )}
    </ValueSection>
  </RowContainer>
);

const Container = styled.div` padding: 10px; font-family: 'DM Sans', sans-serif; `;
const Header = styled.div` margin-bottom: 30px; h1 { font-size: 1.8rem; font-weight: 700; color: #2A1F10; } p { color: #8A7B6D; font-size: 0.9rem; } `;
const Grid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 20px; `;
const Card = styled.div` background: white; border-radius: 20px; border: 1px solid #EAE3D6; padding: 25px; box-shadow: 0 4px 15px rgba(42,31,16,0.05); &.full-width { grid-column: span 2; } `;
const CardTitle = styled.h2` font-size: 1rem; color: #2A1F10; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; padding-bottom: 15px; border-bottom: 1px solid #F5F2EE; svg { color: #B8935A; } `;
const RowContainer = styled.div` display: flex; align-items: center; justify-content: space-between; padding: 12px 0; `;
const LabelSection = styled.div` display: flex; align-items: center; gap: 12px; color: #8A7B6D; .icon { color: #B8935A; display: flex; } .text { font-size: 0.85rem; font-weight: 600; } `;
const ValueSection = styled.div` flex: 1; display: flex; justify-content: flex-end; `;
const DisplayGroup = styled.div` display: flex; align-items: center; gap: 12px; .value-text { font-size: 0.9rem; color: #2A1F10; font-weight: 600; } .pencil { background: transparent; border: none; color: #EAE3D6; cursor: pointer; transition: 0.3s; &:hover { color: #B8935A; } } `;
const EditGroup = styled.div` display: flex; align-items: center; gap: 10px; width: 100%; max-width: 250px; input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #B8935A; outline: none; font-size: 0.9rem; } `;
const ActionButtons = styled.div` display: flex; gap: 4px; button { border: none; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; &.tick { background: #EAE3D6; color: #2A1F10; } &.cross { background: #F5F2EE; color: #8A7B6D; } } `;
const SocialGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 10px 40px; `;
const LoadingWrapper = styled.div` height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: #8A7B6D; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; } `;

export default CompanyDetails;