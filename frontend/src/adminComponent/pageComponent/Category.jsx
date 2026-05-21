import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layers, Plus, Trash2, Tag, Scale } from 'lucide-react';
import useApi from '../../hooks/useApi';

const Category = () => {
  const { get, post, del, loading } = useApi();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', unit: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await get('product/category/listCreate/');
      if (result.success) setCategories(result.data);
    };
    fetchCategories();
  }, [get]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await post('product/category/listCreate/', formData);
    if (result.success) {
      setCategories(prev => [...prev, result.data]);
      setFormData({ name: '', unit: '' });
    }
  };

  const handleDelete = async (id) => {
    const result = await del(`product/category/detail/${id}/`);
    if (result.success) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  return (
    <Container>
      <Header>
        <h2>Category Management</h2>
        <p>Define product groups and measurement units.</p>
      </Header>

      <MainGrid>
        <FormSection>
          <Card>
            <CardHeader>
              <Plus size={20} />
              <h3>Create New</h3>
            </CardHeader>
            <StyledForm onSubmit={handleSubmit}>
              <InputGroup>
                <label><Tag size={14} /> Category Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Cheese" required />
              </InputGroup>
              <InputGroup>
                <label><Scale size={14} /> Unit of Measure</label>
                <input name="unit" value={formData.unit} onChange={handleInputChange} placeholder="e.g. kg, Litre, Packet" required />
              </InputGroup>
              <SubmitBtn type="submit" disabled={loading}>
                {loading ? "Saving..." : "Add Category"}
              </SubmitBtn>
            </StyledForm>
          </Card>
        </FormSection>

        <ListSection>
          <Card>
            <CardHeader>
              <Layers size={20} />
              <h3>Existing Categories</h3>
            </CardHeader>
            <CategoryList>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <CategoryItem key={cat.id}>
                    <div className="info">
                      <strong>{cat.name}</strong>
                      <span>Unit: {cat.unit}</span>
                    </div>
                    <DeleteBtn onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={18} />
                    </DeleteBtn>
                  </CategoryItem>
                ))
              ) : (
                <EmptyText>No categories defined yet.</EmptyText>
              )}
            </CategoryList>
          </Card>
        </ListSection>
      </MainGrid>
    </Container>
  );
};

const Container = styled.div`
 max-width: 1000px;
 margin: 0 auto; `;

const Header = styled.div`
 margin-bottom: 30px;
  h2 {
     color: #2A1F10;
     font-size: 1.8rem;
      margin: 0;
       }
 p {  
        color: #8A7B6D; 
        margin: 5px 0 0; 
        } `;

const MainGrid = styled.div`
 display: grid;
  grid-template-columns: 350px 1fr;
   gap: 30px; `;

const Card = styled.div`
 background: white;
  border-radius: 20px;
   border: 1px solid #EAE3D6;
    box-shadow: 0 4px 15px rgba(42,31,16,0.05);
     overflow: hidden; `;

const CardHeader = styled.div` 
  padding: 20px 25px;
   border-bottom: 1px solid #EAE3D6;
    display: flex;
     align-items: center;
      gap: 12px; 
  h3 { 
    font-size: 1rem;
     margin: 0;
      color: #2A1F10;
     } 
  svg {
     color: #B8935A;
      }
`;
const StyledForm = styled.form`
 padding: 25px;
  display: flex;
   flex-direction: column; 
   gap: 20px; `;

const InputGroup = styled.div`
  display: flex; 
  flex-direction: column;
   gap: 8px;
  label { 
    font-size: 0.75rem; 
    font-weight: 700;
     color: #2A1F10;
      display: flex;
       align-items: center;
        gap: 6px; 
      }
  input { 
    padding: 12px;
     border-radius: 12px;
      border: 1px solid #EAE3D6;
       font-family: inherit;
        transition: 0.3s;
    &:focus {
       outline: none; 
       border-color: #B8935A;
        box-shadow: 0 0 0 2px rgba(184,147,90,0.1); 
      } 
  }
`;
const SubmitBtn = styled.button` 
  background: #2A1F10;
   color: white; 
   border: none;
    padding: 14px; border-radius: 12px; 
  font-weight: 700; cursor: pointer; transition: 0.3s; 
  &:hover { background: #B8935A; } &:disabled { opacity: 0.6; } 
`;
const CategoryList = styled.div` padding: 10px 0; `;
const CategoryItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; 
  border-bottom: 1px solid #F5F2EE;
  .info { display: flex; flex-direction: column; strong { color: #2A1F10; } span { font-size: 0.8rem; color: #B8935A; font-weight: 600; } }
`;
const DeleteBtn = styled.button`
 background: none; border: none; color: #EAE3D6; cursor: pointer; transition: 0.3s; &:hover { color: #D35400; } `;
const EmptyText = styled.div`
 padding: 40px; text-align: center; color: #8A7B6D; font-size: 0.9rem; `;
const FormSection = styled.div``;
const ListSection = styled.div``;

export default Category;