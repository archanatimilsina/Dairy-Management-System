import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MoreVertical,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import useApi from '../../hooks/useApi';
const UsersReport = () => {
  const {get} = useApi()
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");


  const [users, setUsers] = useState([])

  const filteredUsers = users.filter(user => {
    const name = user.first_name +" "+ user.last_name
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" ? true : user.user_type === filterType;
    return matchesSearch && matchesType;
  });

useEffect( ()=>
{
  const fetchData = async ()=> {
const result = await get('user/listView/')
if(result.success)
{
  console.log(result.data)
  setUsers(result.data)
}
  }

fetchData();

},[get])


  return (
    <Container className="page-fade-in">
      <HeaderSection>
        <div>
          <h2>Customer Directory</h2>
          <p>Manage and view all registered users of Elsa Diary.</p>
        </div>
        <AddUserBtn>
          <UserPlus size={18} />
          Add New User
        </AddUserBtn>
      </HeaderSection>

      <StatsRow>
        <StatCard>
          <div className="icon active"><Users size={20}/></div>
          <div className="data">
            <span>Total Users</span>
            <h3>{users.length}</h3>
          </div>
        </StatCard>
        <StatCard>
          <div className="icon regular"><Calendar size={20}/></div>
          <div className="data">
            <span>Regular (Subs)</span>
            <h3>{users.filter(u => u.user_type === 'Regular').length}</h3>
          </div>
        </StatCard>
      </StatsRow>

      <FilterBar>
        <SearchWrapper>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <ButtonGroup>
          <FilterBtn 
            $active={filterType === 'all'} 
            onClick={() => setFilterType('all')}
          >All</FilterBtn>
          <FilterBtn 
            $active={filterType === 'Regular'} 
            onClick={() => setFilterType('regular')}
          >Regular</FilterBtn>
          <FilterBtn 
            $active={filterType === 'Visitor'} 
            onClick={() => setFilterType('visitor')}
          >Visitor</FilterBtn>
          <FilterBtn 
            $active={filterType === 'Occasional'} 
            onClick={() => setFilterType('occasional')}
          >Occasional</FilterBtn>
        </ButtonGroup>
      </FilterBar>

      <TableContainer>
        <UserTable>
          <thead>
            <tr>
              <th><ArrowUpDown size={14}/> Name</th>
              <th>Contact Information</th>
              <th>User Type</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <UserCell>
                    <div className="avatar">{user.first_name.charAt(0) || '?'}</div>
                    <strong>{user.first_name + user.last_name}</strong>
                  </UserCell>
                </td>
                <td>
                  <ContactCell>
                    <div className="item"><Mail size={12}/> {user.email}</div>
                    <div className="item"><Phone size={12}/> {user.contact}</div>
                  </ContactCell>
                </td>
                <td>
                  <TypeTag $type={user.user_type}>{user.user_type}</TypeTag>
                </td>
                <td className="date-cell">{new Date(user.date_joined).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })}</td>
                <td>
                  <StatusBadge $status={user.status}>{user.status}</StatusBadge>
                </td>
                <td>
                  <IconButton><MoreVertical size={18}/></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </UserTable>
        {filteredUsers.length === 0 && (
          <EmptyState>No users found matching your search.</EmptyState>
        )}
      </TableContainer>
    </Container>
  );
};

// --- STYLED COMPONENTS ---

const Container = styled.div`
  padding: 10px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  h2 { margin: 0; color: #2d3436; font-size: 1.8rem; }
  p { margin: 5px 0 0; color: #b2bec3; font-size: 0.95rem; }
`;

const AddUserBtn = styled.button`
  background: #2d3436;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover { background: #7DAACB; }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  .icon {
    padding: 12px;
    border-radius: 12px;
    &.active { background: #f0f7fc; color: #7DAACB; }
    &.regular { background: #fdf2f2; color: #e74c3c; }
  }
  .data {
    span { font-size: 0.8rem; color: #b2bec3; font-weight: 600; }
    h3 { margin: 0; color: #2d3436; font-size: 1.4rem; }
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 15px;
  border-radius: 12px;
  gap: 10px;
  width: 350px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  color: #b2bec3;
  input { border: none; outline: none; width: 100%; font-size: 0.9rem; }
`;

const ButtonGroup = styled.div`
  display: flex;
  background: #f1f2f6;
  padding: 4px;
  border-radius: 10px;
`;

const FilterBtn = styled.button`
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#2d3436' : '#b2bec3'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'};
  transition: 0.2s;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 18px 24px;
    background: #fcfcfd;
    color: #b2bec3;
    font-size: 0.75rem;
    text-transform: uppercase;
    border-bottom: 1px solid #f1f2f6;
  }
  td { padding: 18px 24px; border-bottom: 1px solid #f8f9fa; font-size: 0.9rem; }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .avatar {
    width: 35px; height: 35px; background: #7DAACB; color: white;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 0.8rem;
  }
`;

const ContactCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  .item { display: flex; align-items: center; gap: 6px; color: #636e72; font-size: 0.8rem; }
`;

const TypeTag = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.$type === 'Regular' ? '#f0f7fc' : '#f1f2f6'};
  color: ${props => props.$type === 'Regular' ? '#7DAACB' : '#636e72'};
`;

const StatusBadge = styled.span`
  text-transform: capitalize;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${props => props.$status === 'active' ? '#d1f2eb' : '#ffd7d7'};
  color: ${props => props.$status === 'active' ? '#1abc9c' : '#e74c3c'};
`;

const IconButton = styled.button`
  background: none; border: none; color: #b2bec3; cursor: pointer;
  &:hover { color: #2d3436; }
`;

const EmptyState = styled.div`
  padding: 60px; text-align: center; color: #b2bec3; font-style: italic;
`;

export default UsersReport;