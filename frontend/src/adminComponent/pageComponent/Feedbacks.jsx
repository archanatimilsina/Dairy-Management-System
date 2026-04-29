import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  MessageSquare, Mail, Trash2, Reply, Search, 
  Filter, CheckCircle2, Clock, ChevronRight, User
} from 'lucide-react';

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(1);

  const [feedbacks] = useState([
    { 
      id: 1, 
      name: "Siddharth Rana", 
      email: "sid.rana@gmail.com", 
      message: "The morning milk delivery was a bit late today, but the quality of the Whole Milk is excellent as always. Please check the delivery timing for Parsyang.",
      date: "Oct 10, 2026",
      isNew: true,
      category: "Delivery"
    },
    { 
      id: 2, 
      name: "Anjali Joshi", 
      email: "anjali.j@outlook.com", 
      message: "I would love to see more varieties of flavored curd in the future! The current one is great.",
      date: "Oct 09, 2026",
      isNew: false,
      category: "Product"
    },
    { 
      id: 3, 
      name: "Kiran KC", 
      email: "kiran.kc@email.com", 
      message: "Can you please update my subscription to 2 Liters starting from next Monday?",
      date: "Oct 08, 2026",
      isNew: false,
      category: "Subscription"
    }
  ]);

  const filteredFeedbacks = feedbacks.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="page-fade-in">
      <Header>
        <div className="title-area">
          <h2>Customer Voice</h2>
          <span className="count-pill">{feedbacks.length} Messages</span>
        </div>
        <ActionBar>
          <SearchBox>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or content..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterButton><Filter size={18} /> Filters</FilterButton>
        </ActionBar>
      </Header>

      <MainLayout>
        {/* LIST VIEW */}
        <ListView>
          {filteredFeedbacks.map(fb => (
            <FeedbackItem 
              key={fb.id} 
              $isActive={selectedId === fb.id}
              $isNew={fb.isNew}
              onClick={() => setSelectedId(fb.id)}
            >
              <div className="item-main">
                <Avatar>{fb.name.charAt(0)}</Avatar>
                <div className="item-content">
                  <div className="item-top">
                    <span className="name">{fb.name}</span>
                    <span className="date">{fb.date}</span>
                  </div>
                  <p className="preview">{fb.message}</p>
                </div>
              </div>
              <ChevronRight size={16} className="arrow" />
            </FeedbackItem>
          ))}
        </ListView>

        {/* DETAIL VIEW */}
        <DetailView>
          {filteredFeedbacks.find(f => f.id === selectedId) ? (
            <DetailContent>
              <DetailHeader>
                <div className="user-profile">
                  <LargeAvatar>{filteredFeedbacks.find(f => f.id === selectedId).name.charAt(0)}</LargeAvatar>
                  <div className="user-meta">
                    <h3>{filteredFeedbacks.find(f => f.id === selectedId).name}</h3>
                    <span><Mail size={14}/> {filteredFeedbacks.find(f => f.id === selectedId).email}</span>
                  </div>
                </div>
                <CategoryBadge>{filteredFeedbacks.find(f => f.id === selectedId).category}</CategoryBadge>
              </DetailHeader>

              <MessageBody>
                <p>{filteredFeedbacks.find(f => f.id === selectedId).message}</p>
              </MessageBody>

              <ActionFooter>
                <div className="primary-actions">
                  <button className="btn-reply"><Reply size={18}/> Draft Reply</button>
                  <button className="btn-resolve"><CheckCircle2 size={18}/> Resolve</button>
                </div>
                <button className="btn-delete"><Trash2 size={18}/></button>
              </ActionFooter>
            </DetailContent>
          ) : (
            <EmptyState>Select a message to read</EmptyState>
          )}
        </DetailView>
      </MainLayout>
    </Container>
  );
};

// --- STYLED COMPONENTS (Optimized for 2-Column Layout) ---

const Container = styled.div`
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .title-area {
    display: flex;
    align-items: center;
    gap: 12px;
    h2 { margin: 0; font-size: 1.6rem; color: #2d3436; }
    .count-pill { 
      background: #7DAACB20; color: #7DAACB; 
      padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;
    }
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  flex: 1;
  overflow: hidden;
`;

const ListView = styled.div`
  background: white;
  border-radius: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid #f1f2f6;
`;

const FeedbackItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s;
  background: ${props => props.$isActive ? '#f0f7fc' : 'transparent'};
  border-left: 4px solid ${props => props.$isNew ? '#7DAACB' : 'transparent'};

  &:hover { background: #f8f9fa; }

  .item-main { display: flex; gap: 12px; overflow: hidden; }
  .item-content { overflow: hidden; }
  .item-top { 
    display: flex; justify-content: space-between; margin-bottom: 4px; 
    .name { font-weight: 700; color: #2d3436; font-size: 0.9rem; }
    .date { font-size: 0.75rem; color: #b2bec3; }
  }
  .preview { 
    margin: 0; font-size: 0.8rem; color: #636e72; 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .arrow { color: ${props => props.$isActive ? '#7DAACB' : '#dfe6e9'}; }
`;

const DetailView = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f2f6;
`;

const DetailContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  
  .user-profile {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .user-meta {
    h3 { margin: 0; font-size: 1.4rem; color: #2d3436; }
    span { color: #b2bec3; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; margin-top: 4px; }
  }
`;

const ActionFooter = styled.div`
  margin-top: auto;
  padding-top: 30px;
  border-top: 1px solid #f1f2f6;
  display: flex;
  justify-content: space-between;

  .primary-actions { display: flex; gap: 12px; }
  
  button {
    border: none; padding: 12px 24px; border-radius: 12px; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px;
    transition: 0.2s;
  }

  .btn-reply { background: #2d3436; color: white; &:hover { background: #7DAACB; } }
  .btn-resolve { background: #f1f2f6; color: #636e72; &:hover { background: #d1f2eb; color: #1abc9c; } }
  .btn-delete { background: #fff5f5; color: #e74c3c; padding: 12px; }
`;

// Helper Components
const Avatar = styled.div`
  width: 40px; height: 40px; background: #f1f2f6; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-weight: 800; color: #2d3436; flex-shrink: 0;
`;

const LargeAvatar = styled(Avatar)` width: 60px; height: 60px; font-size: 1.5rem; border-radius: 16px; `;

const CategoryBadge = styled.span`
  background: #f8f9fa; color: #636e72; padding: 6px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 800;
`;

const MessageBody = styled.div`
  p { line-height: 1.8; color: #4d5456; font-size: 1.05rem; }
`;

const ActionBar = styled.div` display: flex; gap: 12px; `;
const SearchBox = styled.div`
  background: white; border: 1px solid #f1f2f6; border-radius: 12px; 
  display: flex; align-items: center; padding: 0 15px; gap: 10px; width: 300px;
  input { border: none; outline: none; height: 45px; width: 100%; font-size: 0.9rem; }
  color: #b2bec3;
`;

const FilterButton = styled.button`
  background: white; border: 1px solid #f1f2f6; border-radius: 12px;
  padding: 0 18px; display: flex; align-items: center; gap: 8px;
  font-weight: 700; color: #636e72; cursor: pointer;
`;

const EmptyState = styled.div`
  display: flex; align-items: center; justify-content: center; height: 100%; color: #b2bec3;
`;

export default Feedbacks;