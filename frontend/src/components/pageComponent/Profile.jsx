import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Mail, History, Package, Loader2, Phone, Award, User as UserIcon } from 'lucide-react';
import useApi from '../../hooks/useApi';

const Profile = () => {
  const [data, setData] = useState({ user: null, orders: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useApi();

useEffect(() => {
 const fetchAll = async () => {
    setIsLoading(true);
    const username = localStorage.getItem("username");

    try {
        const [uRes, oRes] = await Promise.all([
            get(`user/profile/${username}/`), 
            get('user/history/')
        ]);

        setData({
            user: uRes?.success ? uRes.data : null,
            orders: oRes?.success ? (oRes.data || []) : [] 
        });
    } catch (err) {
        console.error("Fetch Error:", err);
    } finally {
        setIsLoading(false);
    }
};
  fetchAll();
}, [get]);

  if (isLoading) return <Container><Loader2 className="animate-spin" size={32} /></Container>;
  if (!data.user) return <Container>Error loading profile.</Container>;

  const { user, orders } = data;

  return (
    <Container>
      <ProfileLayout>
        <SidebarCard>
          <Avatar>{user.username?.charAt(0).toUpperCase()}</Avatar>
          <h2>{user.first_name} {user.last_name}</h2>
          <Badge>{user.user_type || 'Visitor'}</Badge>
          
          <DetailGroup>
            <DetailItem><Mail size={16}/> {user.email}</DetailItem>
            <DetailItem><Phone size={16}/> {user.contact || 'No contact provided'}</DetailItem>
            <DetailItem><Award size={16}/> Member Since: 2026</DetailItem>
          </DetailGroup>
        </SidebarCard>

        <HistorySection>
          <h3><History size={20} /> Order History</h3>
          {orders.length > 0 ? (
            <OrderList>
              {orders.map(order => (
                <OrderCard key={order.id}>
                  <strong>Order #{order.id}</strong>
                  <div className="date">{new Date(order.created_at).toLocaleDateString()}</div>
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

const Container = styled.div` padding: 60px 5%; background: #FAF7F2; min-height: 100vh; `;
const ProfileLayout = styled.div` display: grid; grid-template-columns: 350px 1fr; gap: 40px; max-width: 1100px; margin: 0 auto; @media (max-width: 850px) { grid-template-columns: 1fr; } `;

const SidebarCard = styled.div` background: white; padding: 30px; border-radius: 24px; border: 1px solid #EAE3D6; height: fit-content; text-align: center; `;
const Avatar = styled.div` width: 90px; height: 90px; background: #2A1F10; color: #B8935A; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 15px; font-weight: 800; `;
const Badge = styled.span` background: #F5F2EE; color: #B8935A; padding: 6px 14px; border-radius: 50px; font-weight: 800; text-transform: uppercase; font-size: 0.7rem; `;
const DetailGroup = styled.div` margin-top: 25px; display: flex; flex-direction: column; gap: 15px; align-items: flex-start; text-align: left; `;
const DetailItem = styled.div` display: flex; align-items: center; gap: 12px; color: #6B5C4A; font-weight: 500; font-size: 0.9rem; `;

const HistorySection = styled.div` width: 100%; `;
const OrderList = styled.div` display: grid; gap: 15px; `;
const OrderCard = styled.div` background: white; padding: 20px; border-radius: 16px; display: grid; grid-template-columns: 1fr auto auto auto; align-items: center; gap: 20px; border: 1px solid #EAE3D6; .status { font-weight: 700; color: #B8935A; text-transform: capitalize; } .total { font-weight: 800; color: #2A1F10; } `;
const EmptyState = styled.div` background: white; border-radius: 20px; padding: 60px; text-align: center; color: #8A7B6D; border: 1px dashed #EAE3D6; `;

export default Profile;