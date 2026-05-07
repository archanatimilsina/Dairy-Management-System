import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin,
  HiOutlineKey,
  HiPencil,
  HiCheck,
  HiXMark,
  HiOutlineArrowPath
} from "react-icons/hi2";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTiktok 
} from "react-icons/fa6";
import useApi from '../../hooks/useApi';

const CompanyDetails = () => {
  const { get, patch } = useApi();
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null); 
  const [tempValue, setTempValue] = useState(""); 
  const [syncing, setSyncing] = useState(false);
  
  const [details, setDetails] = useState({
    company_name: "",
    support_email: "",
    contact_phone: "",
    office_address: "",
    system_sender_email: "",
    system_password: "", 
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
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

  const startEditing = (key, value) => {
    setEditingField(key);
    setTempValue(value || "");
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveField = async (key) => {
    setSyncing(true);
    const result = await patch('company-info/update/', { [key]: tempValue });
    
    if (result.success) {
      setDetails(prev => ({ ...prev, [key]: tempValue }));
      setEditingField(null);
    }
    setSyncing(false);
  };

  if (loading) return <LoadingWrapper><HiOutlineArrowPath className="spin" /> Syncing Configurations...</LoadingWrapper>;

  return (
    <Container>
      <Header>
        <h1>System Configuration</h1>
        <p>Manage corporate identity and secure communication channels.</p>
      </Header>

      <Grid>
        <Card>
          <CardTitle><HiOutlineBuildingOffice2 /> Corporate Identity</CardTitle>
          <FieldRow 
            label="Company Name" 
            value={details.company_name} 
            isEditing={editingField === 'company_name'}
            onEdit={() => startEditing('company_name', details.company_name)}
            onCancel={cancelEditing}
            onSave={() => saveField('company_name')}
            tempValue={tempValue}
            setTempValue={setTempValue}
            syncing={syncing}
          />
          <FieldRow 
            label="Office Address" 
            value={details.office_address} 
            icon={<HiOutlineMapPin />}
            isEditing={editingField === 'office_address'}
            onEdit={() => startEditing('office_address', details.office_address)}
            onCancel={cancelEditing}
            onSave={() => saveField('office_address')}
            tempValue={tempValue}
            setTempValue={setTempValue}
            syncing={syncing}
          />
          <FieldRow 
            label="Contact Number" 
            value={details.contact_phone} 
            icon={<HiOutlinePhone />}
            isEditing={editingField === 'contact_phone'}
            onEdit={() => startEditing('contact_phone', details.contact_phone)}
            onCancel={cancelEditing}
            onSave={() => saveField('contact_phone')}
            tempValue={tempValue}
            setTempValue={setTempValue}
            syncing={syncing}
          />
        </Card>

        <Card>
          <CardTitle><HiOutlineKey /> System Authentication</CardTitle>
          <FieldRow 
            label="Sender Email" 
            value={details.system_sender_email} 
            icon={<HiOutlineEnvelope />}
            isEditing={editingField === 'system_sender_email'}
            onEdit={() => startEditing('system_sender_email', details.system_sender_email)}
            onCancel={cancelEditing}
            onSave={() => saveField('system_sender_email')}
            tempValue={tempValue}
            setTempValue={setTempValue}
            syncing={syncing}
          />
          <FieldRow 
            label="App Password" 
            value="••••••••••••" 
            icon={<HiOutlineKey />}
            isEditing={editingField === 'system_password'}
            onEdit={() => startEditing('system_password', "")}
            onCancel={cancelEditing}
            onSave={() => saveField('system_password')}
            tempValue={tempValue}
            setTempValue={setTempValue}
            syncing={syncing}
            type="password"
          />
        </Card>

        <Card className="full-width">
          <CardTitle><FaInstagram /> Social & Support Channels</CardTitle>
          <SocialGrid>
            <FieldRow 
              label="Facebook" value={details.facebook_url} icon={<FaFacebookF />}
              isEditing={editingField === 'facebook_url'} onEdit={() => startEditing('facebook_url', details.facebook_url)}
              onCancel={cancelEditing} onSave={() => saveField('facebook_url')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing}
            />
            <FieldRow 
              label="Instagram" value={details.instagram_url} icon={<FaInstagram />}
              isEditing={editingField === 'instagram_url'} onEdit={() => startEditing('instagram_url', details.instagram_url)}
              onCancel={cancelEditing} onSave={() => saveField('instagram_url')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing}
            />
            <FieldRow 
              label="TikTok" value={details.tiktok_url} icon={<FaTiktok />}
              isEditing={editingField === 'tiktok_url'} onEdit={() => startEditing('tiktok_url', details.tiktok_url)}
              onCancel={cancelEditing} onSave={() => saveField('tiktok_url')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing}
            />
            <FieldRow 
              label="Support Email" value={details.support_email} icon={<HiOutlineEnvelope />}
              isEditing={editingField === 'support_email'} onEdit={() => startEditing('support_email', details.support_email)}
              onCancel={cancelEditing} onSave={() => saveField('support_email')} tempValue={tempValue} setTempValue={setTempValue} syncing={syncing}
            />
          </SocialGrid>
        </Card>
      </Grid>
    </Container>
  );
};

const FieldRow = ({ label, value, isEditing, onEdit, onCancel, onSave, tempValue, setTempValue, syncing, icon, type="text" }) => (
  <RowContainer>
    <LabelSection>
      <span className="icon">{icon || <HiPencil size={12}/>}</span>
      <span className="text">{label}</span>
    </LabelSection>
    <ValueSection>
      {isEditing ? (
        <EditGroup>
          <input type={type} value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
          <ActionButtons>
            <button className="tick" onClick={onSave} disabled={syncing}>{syncing ? <HiOutlineArrowPath className="spin" /> : <HiCheck />}</button>
            <button className="cross" onClick={onCancel} disabled={syncing}><HiXMark /></button>
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

const Container = styled.div` padding: 40px; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; `;
const Header = styled.div` margin-bottom: 40px; h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 8px; } p { color: #64748b; font-size: 14px; } `;
const Grid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 30px; `;
const Card = styled.div` background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); &.full-width { grid-column: span 2; } `;
const CardTitle = styled.h2` font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; `;
const RowContainer = styled.div` display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f8fafc; `;
const LabelSection = styled.div` display: flex; align-items: center; gap: 12px; color: #64748b; .icon { color: #94a3b8; display: flex; } .text { font-size: 13px; font-weight: 600; } `;
const ValueSection = styled.div` flex: 1; display: flex; justify-content: flex-end; padding-left: 40px; `;
const DisplayGroup = styled.div` display: flex; align-items: center; gap: 12px; .value-text { font-size: 14px; color: #1e293b; font-weight: 500; } .placeholder { color: #cbd5e1; } .pencil { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 4px; &:hover { background: #f1f5f9; color: #3b82f6; } } `;
const EditGroup = styled.div` display: flex; align-items: center; gap: 10px; width: 100%; max-width: 300px; input { flex: 1; padding: 6px 12px; border-radius: 6px; border: 1px solid #3b82f6; font-size: 14px; outline: none; } `;
const ActionButtons = styled.div` display: flex; gap: 4px; button { border: none; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; &.tick { background: #dcfce7; color: #15803d; } &.cross { background: #fee2e2; color: #b91c1c; } .spin { animation: spin 1s linear infinite; } } `;
const SocialGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 10px 40px; `;
const LoadingWrapper = styled.div` height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: #64748b; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spin { font-size: 24px; animation: spin 1s linear infinite; } `;

export default CompanyDetails;