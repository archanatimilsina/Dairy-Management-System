import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Mail, History, Package, Loader2, Phone, Award, Pencil, Save, X, RefreshCw, CheckCircle2, AtSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';

const USER_TYPES = ['visitor', 'occasional', 'regular'];

const emptyForm = { first_name: '', last_name: '', contact: '', user_type: 'visitor' };

function clientValidate(f) {
  const errors = {};
  const first = (f.first_name || '').trim();
  const last = (f.last_name || '').trim();
  const contact = (f.contact || '').trim();
  if (first.length > 150) errors.first_name = 'Too long (max 150).';
  if (last.length > 150) errors.last_name = 'Too long (max 150).';
  if (contact) {
    if (contact.length > 20) errors.contact = 'Too long (max 20).';
    else if (!/^[0-9+\-\s()]+$/.test(contact)) errors.contact = 'Use digits, spaces, +, - or ().';
  }
  if (f.user_type && !USER_TYPES.includes(f.user_type)) errors.user_type = 'Pick visitor, occasional or regular.';
  return errors;
}

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [baseline, setBaseline] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const { get, patch } = useApi();
  const navigate = useNavigate();
  const successTimer = useRef(null);

  useEffect(() => () => { if (successTimer.current) clearTimeout(successTimer.current); }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      // Self-service endpoint: any authenticated customer reads their own
      // record. The old user/profile/<username>/ route is admin-only.
      const [uRes, oRes] = await Promise.all([
        get('user/me/'),
        get('user/history/')
      ]);
      if (!uRes?.success) {
        const err = uRes?.error;
        setLoadError(typeof err === 'object' ? Object.values(err).flat().join(' ') : (err || 'Could not load profile.'));
        return;
      }
      const u = uRes.data;
      setUser(u);
      const f = {
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        contact: u.contact || '',
        user_type: u.user_type || 'visitor',
      };
      setForm(f);
      setBaseline(f);
      setOrders(oRes?.success ? (oRes.data?.data || []) : []);
    } catch (err) {
      setLoadError('Network error. Check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSaveError('');
  };

  const applyServerErrors = (err) => {
    if (err && typeof err === 'object' && !Array.isArray(err)) {
      const fields = {};
      const rest = [];
      for (const [k, v] of Object.entries(err)) {
        const msg = Array.isArray(v) ? v.join(' ') : String(v);
        if (['first_name', 'last_name', 'contact', 'user_type'].includes(k)) fields[k] = msg;
        else rest.push(msg);
      }
      if (Object.keys(fields).length) setFieldErrors(fields);
      return rest.join(' ') || (Object.keys(fields).length ? '' : 'Save failed.');
    }
    return typeof err === 'string' ? err : 'Save failed.';
  };

  const handleSave = async () => {
    if (saving) return;
    const trimmed = {
      first_name: (form.first_name || '').trim(),
      last_name: (form.last_name || '').trim(),
      contact: (form.contact || '').trim(),
      user_type: form.user_type || 'visitor',
    };
    const errors = clientValidate(trimmed);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    if (!dirty) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    const result = await patch('user/me/', trimmed);
    setSaving(false);
    if (result.success) {
      const u = result.data;
      setUser(u);
      const f = {
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        contact: u.contact || '',
        user_type: u.user_type || 'visitor',
      };
      setForm(f);
      setBaseline(f);
      setFieldErrors({});
      setIsEditing(false);
      setSaveSuccess('Profile updated.');
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSaveSuccess(''), 4000);
    } else {
      if (result.error === 'An error has occurred' || result.error === undefined) {
        setSaveError('Network error. Please retry.');
      } else {
        setSaveError(applyServerErrors(result.error));
      }
    }
  };

  const handleCancel = () => {
    setForm(baseline);
    setFieldErrors({});
    setSaveError('');
    setIsEditing(false);
  };

  const memberSince = user?.date_joined ? new Date(user.date_joined).getFullYear() : '—';

  if (isLoading) return <Container><Loader2 className="animate-spin" size={32} /></Container>;
  if (!user) {
    return (
      <Container>
        <ErrorCard role="alert">
          <p>{loadError || 'Error loading profile.'}</p>
          <ErrorRow>
            <RetryBtn onClick={fetchAll}><RefreshCw size={15} /> Retry</RetryBtn>
            <RetryBtn $ghost onClick={() => navigate('/loginPage')}>Go to login</RetryBtn>
          </ErrorRow>
        </ErrorCard>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileLayout>
        <SidebarCard>
          <Avatar aria-hidden="true">{user.username?.charAt(0).toUpperCase()}</Avatar>
          <h2>{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}</h2>
          <Badge>{user.user_type || 'Visitor'}</Badge>

          <DetailGroup>
            <DetailItem><AtSign size={16} /> {user.username}</DetailItem>
            <DetailItem><Mail size={16} /> {user.email}</DetailItem>
            <DetailItem><Phone size={16} /> {user.contact || 'No contact provided'}</DetailItem>
            <DetailItem><Award size={16} /> Member Since: {memberSince}</DetailItem>
          </DetailGroup>

          <StatusLive aria-live="polite">
            {saveSuccess && <SuccessNote><CheckCircle2 size={15} /> {saveSuccess}</SuccessNote>}
            {saveError && !isEditing && <SaveError>{saveError}</SaveError>}
          </StatusLive>

          {!isEditing ? (
            <EditBtn onClick={() => setIsEditing(true)}>
              <Pencil size={15} /> Edit profile
            </EditBtn>
          ) : (
            <EditForm onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <label>First name
                <input
                  value={form.first_name}
                  onChange={(e) => setField('first_name', e.target.value)}
                  disabled={saving}
                  maxLength={150}
                  autoComplete="given-name"
                />
                {fieldErrors.first_name && <FieldError>{fieldErrors.first_name}</FieldError>}
              </label>
              <label>Last name
                <input
                  value={form.last_name}
                  onChange={(e) => setField('last_name', e.target.value)}
                  disabled={saving}
                  maxLength={150}
                  autoComplete="family-name"
                />
                {fieldErrors.last_name && <FieldError>{fieldErrors.last_name}</FieldError>}
              </label>
              <label>Contact
                <input
                  value={form.contact}
                  onChange={(e) => setField('contact', e.target.value)}
                  placeholder="9800000000"
                  disabled={saving}
                  maxLength={20}
                  inputMode="tel"
                  autoComplete="tel"
                />
                {fieldErrors.contact && <FieldError>{fieldErrors.contact}</FieldError>}
              </label>
              <label>Customer type
                <select
                  value={form.user_type}
                  onChange={(e) => setField('user_type', e.target.value)}
                  disabled={saving}
                >
                  {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {fieldErrors.user_type && <FieldError>{fieldErrors.user_type}</FieldError>}
              </label>
              {saveError && <SaveError role="alert">{saveError}</SaveError>}
              <EditRow>
                <SaveBtn type="submit" disabled={saving || !dirty}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save'}
                </SaveBtn>
                <CancelBtn type="button" onClick={handleCancel} disabled={saving}>
                  <X size={15} /> Cancel
                </CancelBtn>
              </EditRow>
            </EditForm>
          )}
        </SidebarCard>

        <HistorySection>
          <h3><History size={20} /> Order History</h3>
          {orders.length > 0 ? (
            <OrderList>
              {orders.map(order => (
                <OrderCard key={order.id}>
                  <strong>Order #{order.id}</strong>
                  <div className="date">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</div>
                  <div className="status">{order.order_status}</div>
                  <div className="total">Rs. {order.total_amount}</div>
                </OrderCard>
              ))}
            </OrderList>
          ) : (
            <EmptyState><Package size={40} /><p>No orders yet.</p></EmptyState>
          )}
        </HistorySection>
      </ProfileLayout>
    </Container>
  );
};

const Container = styled.div` padding: clamp(32px, 6vw, 60px) 5%; background: #FAF7F2; min-height: 100vh; min-width: 0; `;
const ProfileLayout = styled.div` display: grid; grid-template-columns: minmax(0, 350px) minmax(0, 1fr); gap: clamp(20px, 4vw, 40px); max-width: 1100px; margin: 0 auto; min-width: 0; @media (max-width: 850px) { grid-template-columns: minmax(0, 1fr); } `;

const SidebarCard = styled.div` background: white; padding: clamp(20px, 4vw, 30px); border-radius: 24px; border: 1px solid #EAE3D6; height: fit-content; text-align: center; min-width: 0; overflow-wrap: anywhere; `;
const Avatar = styled.div` width: 90px; height: 90px; background: #2A1F10; color: #B8935A; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 15px; font-weight: 800; `;
const Badge = styled.span` background: #F5F2EE; color: #B8935A; padding: 6px 14px; border-radius: 50px; font-weight: 800; text-transform: uppercase; font-size: 0.7rem; `;
const DetailGroup = styled.div` margin-top: 25px; display: flex; flex-direction: column; gap: 15px; align-items: flex-start; text-align: left; `;
const DetailItem = styled.div` display: flex; align-items: center; gap: 12px; color: #6B5C4A; font-weight: 500; font-size: 0.9rem; overflow-wrap: anywhere; `;
const StatusLive = styled.div` margin-top: 16px; display: flex; flex-direction: column; gap: 10px; &:empty { margin-top: 0; } `;
const SuccessNote = styled.div` display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #EDFDF5; color: #166534; border: 1px solid #A7F3D0; border-radius: 10px; padding: 10px 12px; font-size: 0.85rem; font-weight: 700; `;
const EditBtn = styled.button` margin-top: 22px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #2A1F10; color: #fff; border: none; border-radius: 12px; padding: 12px 18px; min-height: 48px; font-weight: 700; cursor: pointer; width: 100%; &:hover { background: #40301B; } `;
const EditForm = styled.form` margin-top: 22px; display: flex; flex-direction: column; gap: 12px; text-align: left; min-width: 0; label { display: flex; flex-direction: column; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #2A1F10; min-width: 0; } input, select { padding: 12px; border-radius: 10px; border: 1px solid #D8CFBE; font-size: 16px; max-width: 100%; background: #fff; &:disabled { opacity: 0.6; } } `;
const FieldError = styled.span` font-size: 0.78rem; font-weight: 600; color: #C53030; `;
const EditRow = styled.div` display: flex; gap: 10px; @media (max-width: 480px) { flex-direction: column; } `;
const SaveBtn = styled.button` flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #2A1F10; color: #fff; border: none; border-radius: 10px; padding: 12px; min-height: 48px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.6; cursor: not-allowed; } `;
const CancelBtn = styled.button` flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #F5F2EE; color: #2A1F10; border: 1px solid #EAE3D6; border-radius: 10px; padding: 12px; min-height: 48px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.6; } `;
const SaveError = styled.div` background: #FFF5F5; color: #C53030; border: 1px solid #FEB2B2; border-radius: 10px; padding: 10px 12px; font-size: 0.82rem; font-weight: 600; `;
const ErrorCard = styled.div` background: #fff; border: 1px solid #EAE3D6; border-radius: 20px; padding: 32px; max-width: 560px; margin: 0 auto; text-align: center; color: #2A1F10; `;
const ErrorRow = styled.div` display: flex; gap: 10px; justify-content: center; margin-top: 16px; flex-wrap: wrap; `;
const RetryBtn = styled.button` display: inline-flex; align-items: center; gap: 8px; border-radius: 12px; padding: 12px 18px; min-height: 48px; font-weight: 700; cursor: pointer; border: ${p => p.$ghost ? '1px solid #EAE3D6' : 'none'}; background: ${p => p.$ghost ? '#fff' : '#2A1F10'}; color: ${p => p.$ghost ? '#2A1F10' : '#fff'}; `;

const HistorySection = styled.div` width: 100%; min-width: 0; `;
const OrderList = styled.div` display: grid; gap: 15px; `;
const OrderCard = styled.div` background: white; padding: 20px; border-radius: 16px; display: grid; grid-template-columns: 1fr auto auto auto; align-items: center; gap: 12px 20px; border: 1px solid #EAE3D6; min-width: 0; @media (max-width: 640px) { grid-template-columns: 1fr 1fr; } @media (max-width: 480px) { grid-template-columns: minmax(0, 1fr); } .status { font-weight: 700; color: #B8935A; text-transform: capitalize; } .total { font-weight: 800; color: #2A1F10; } `;
const EmptyState = styled.div` background: white; border-radius: 20px; padding: 60px; text-align: center; color: #8A7B6D; border: 1px dashed #EAE3D6; `;

export default Profile;
