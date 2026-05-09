import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layers, Plus, Trash2, Tag, Scale } from 'lucide-react';
import useApi from '../../hooks/useApi';

const Category = () => {
  const { get, post, del, loading } = useApi();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    unit: ''
  });

  useEffect(() => {
  const fetchCategories = async () => {
    const result = await get('product/category/listCreate/');
    if (result.success) {
      setCategories(result.data);
    }
    
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
        <div className="title-box">
          <h2>Product Categories</h2>
          <p>Define product groups and their measurement units (e.g., Litre, kg).</p>
        </div>
      </Header>

      <MainGrid>
        {/* Creation Form */}
        <FormSection>
          <Card>
            <CardHeader>
              <Plus size={20} color="#7DAACB" />
              <h3>Add New Category</h3>
            </CardHeader>
            <StyledForm onSubmit={handleSubmit}>
              <InputGroup>
                <label><Tag size={14} /> Category Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Cheese" 
                  required 
                />
              </InputGroup>

              <InputGroup>
                <label><Scale size={14} /> Unit of Measure</label>
                <input 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleInputChange} 
                  placeholder="e.g. kg, Litre, Packet" 
                  required 
                />
              </InputGroup>

              <SubmitBtn type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Category"}
              </SubmitBtn>
            </StyledForm>
          </Card>
        </FormSection>

        {/* Category List */}
        <ListSection>
          <Card>
            <CardHeader>
              <Layers size={20} color="#7DAACB" />
              <h3>Existing Categories</h3>
            </CardHeader>
            <CategoryList>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <CategoryItem key={cat.id}>
                    <div className="info">
                      <strong>{cat.name}</strong>
                      <span>Measured in: {cat.unit}</span>
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

const Container = styled.div` padding: 30px; max-width: 1200px; margin: 0 auto; `;
const Header = styled.div` margin-bottom: 40px; h2 { margin: 0; color: #2d3436; } p { color: #b2bec3; margin: 5px 0 0; } `;
const MainGrid = styled.div` display: grid; grid-template-columns: 400px 1fr; gap: 30px; `;
const Card = styled.div` background: white; border-radius: 20px; border: 1px solid #f1f2f6; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02); `;
const CardHeader = styled.div` padding: 20px 25px; border-bottom: 1px solid #f1f2f6; display: flex; align-items: center; gap: 12px; h3 { font-size: 1.1rem; margin: 0; color: #2d3436; } `;
const FormSection = styled.div``;
const ListSection = styled.div``;
const StyledForm = styled.form` padding: 25px; display: flex; flex-direction: column; gap: 20px; `;
const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  label { font-size: 0.8rem; font-weight: 700; color: #636e72; display: flex; align-items: center; gap: 6px; }
  input { padding: 12px; border-radius: 12px; border: 1.5px solid #f1f2f6; font-family: inherit; transition: 0.2s; &:focus { outline: none; border-color: #7DAACB; } }
`;
const SubmitBtn = styled.button` background: #2d3436; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; &:disabled { opacity: 0.6; } &:hover { background: #000; } `;
const CategoryList = styled.div` padding: 10px 0; `;
const CategoryItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; border-bottom: 1px solid #f8f9fa;
  &:last-child { border-bottom: none; }
  .info { display: flex; flex-direction: column; strong { color: #2d3436; font-size: 1rem; } span { font-size: 0.8rem; color: #b2bec3; } }
`;
const DeleteBtn = styled.button` background: none; border: none; color: #b2bec3; cursor: pointer; transition: 0.2s; &:hover { color: #e74c3c; } `;
const EmptyText = styled.div` padding: 40px; text-align: center; color: #b2bec3; font-size: 0.9rem; `;

export default Category;