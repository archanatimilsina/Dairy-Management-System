import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Mail, Trash2, Reply, Search, Filter, 
  CheckCircle2, ChevronRight, User 
} from 'lucide-react';
import useApi from '../../hooks/useApi';

const Feedbacks = () => {
  const { get } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await get('feedback/listCreate/');
      if (result.success) {
        console.log(result.data)
        setFeedbacks(result.data);
        if (result.data.length > 0) setSelectedId(result.data[0].id);
      }
    };
    fetchData();
  }, [get]);

  const filteredFeedbacks = feedbacks.filter(f => 
    f.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.feedback_topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeFeedback = filteredFeedbacks.find(f => f.id === selectedId);

  return (
    <Container>
      <Header>
        <div className="title-area">
          <h2>Customer Voice</h2>
          <span className="count-pill">{feedbacks.length} Total</span>
        </div>
        <ActionBar>
          <SearchBox>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
        </ActionBar>
      </Header>

      <MainLayout>
        <ListView>
          {filteredFeedbacks.map(fb => (
            <FeedbackItem 
              key={fb.id} 
              $isActive={selectedId === fb.id}
              onClick={() => setSelectedId(fb.id)}
            >
              <div className="item-main">
                <Avatar>{fb.username.charAt(0)}</Avatar>
                <div className="item-content">
                  <div className="item-top">
                    <span className="name">{fb.username}</span>
                    <span className="date">{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="preview">{fb.feedback}</p>
                </div>
              </div>
            </FeedbackItem>
          ))}
        </ListView>

        <DetailView>
          {activeFeedback ? (
            <DetailContent>
              <DetailHeader>
                <div className="user-profile">
                  <LargeAvatar>{activeFeedback.username.charAt(0)}</LargeAvatar>
                  <div className="user-meta">
                    <h3>{activeFeedback.username}</h3>
                    <span><Mail size={12}/> {activeFeedback.email}</span>
                  </div>
                </div>
                <CategoryBadge>{activeFeedback.feedback_topic}</CategoryBadge>
              </DetailHeader>

              <MessageBody>
                <p>{activeFeedback.feedback}</p>
              </MessageBody>

              <ActionFooter>
                <div className="primary-actions">
                  <button className="btn-reply"><Reply size={16}/> Reply</button>
                  <button className="btn-resolve"><CheckCircle2 size={16}/> Resolve</button>
                </div>
                <button className="btn-delete"><Trash2 size={16}/></button>
              </ActionFooter>
            </DetailContent>
          ) : (
            <EmptyState>Select a message to view details</EmptyState>
          )}
        </DetailView>
      </MainLayout>
    </Container>
  );
};

const Container = styled.div` height: 80vh; display: flex; flex-direction: column; font-family: 'DM Sans', sans-serif; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; .title-area { display: flex; align-items: center; gap: 12px; h2 { margin: 0; font-size: 1.5rem; color: #2A1F10; } .count-pill { background: #F5F2EE; color: #B8935A; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.75rem; } } `;
const MainLayout = styled.div` display: grid; grid-template-columns: 350px 1fr; gap: 24px; flex: 1; overflow: hidden; `;
const ListView = styled.div` background: white; border-radius: 20px; overflow-y: auto; border: 1px solid #EAE3D6; `;
const FeedbackItem = styled.div` padding: 20px; border-bottom: 1px solid #F5F2EE; cursor: pointer; transition: 0.3s; background: ${props => props.$isActive ? '#F5F2EE' : 'transparent'}; &:hover { background: #F5F2EE; } .item-main { display: flex; gap: 12px; } .name { font-weight: 700; color: #2A1F10; font-size: 0.9rem; } .date { font-size: 0.7rem; color: #8A7B6D; } .preview { margin: 4px 0 0; font-size: 0.8rem; color: #8A7B6D; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } `;
const DetailView = styled.div` background: white; border-radius: 20px; border: 1px solid #EAE3D6; display: flex; flex-direction: column; `;
const DetailContent = styled.div` padding: 40px; display: flex; flex-direction: column; height: 100%; `;
const DetailHeader = styled.div` display: flex; justify-content: space-between; margin-bottom: 30px; .user-profile { display: flex; gap: 15px; align-items: center; } h3 { margin: 0; color: #2A1F10; } span { color: #B8935A; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; } `;
const ActionFooter = styled.div` margin-top: auto; padding-top: 30px; border-top: 1px solid #F5F2EE; display: flex; justify-content: space-between; .primary-actions { display: flex; gap: 10px; } button { border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; } .btn-reply { background: #2A1F10; color: white; } .btn-resolve { background: #F5F2EE; color: #2A1F10; } .btn-delete { background: #FFF; color: #E74C3C; border: 1px solid #EAE3D6; } `;
const Avatar = styled.div` width: 40px; height: 40px; background: #F5F2EE; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #2A1F10; `;
const LargeAvatar = styled(Avatar)` width: 50px; height: 50px; border-radius: 12px; `;
const CategoryBadge = styled.span` background: #F5F2EE; color: #2A1F10; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; `;
const MessageBody = styled.div` p { line-height: 1.6; color: #2A1F10; font-size: 1rem; } `;
const ActionBar = styled.div` display: flex; gap: 12px; `;
const SearchBox = styled.div` background: white; border: 1px solid #EAE3D6; border-radius: 12px; display: flex; align-items: center; padding: 0 15px; gap: 10px; width: 250px; input { border: none; outline: none; height: 40px; width: 100%; font-size: 0.9rem; } color: #8A7B6D; `;
const EmptyState = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #8A7B6D; font-size: 0.9rem; `;

export default Feedbacks;