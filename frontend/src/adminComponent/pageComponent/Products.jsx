import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, Trash2, Edit3, Search, X, 
  Image as ImageIcon, Layers, UploadCloud
} from 'lucide-react';
import useApi from '../../hooks/useApi';

const Products = () => {
  const { post, get, loading } = useApi();
  
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    stock: "",
    description: "",
    picture_src: null
  });

  useEffect(() => {
    const fetchInitialData = async ()=>
    {
      const category= await get('product/category/listCreate/')
      const product = await get("product/listCreate/");
      if(category.success && product.success)
      {
        setProducts(product.data.results);
        setCategories(category.data)
      }

    }
    fetchInitialData();
  }, [get]); 


  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "picture_src") { 
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, picture_src: file }));
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(file)); 
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('product_name', formData.name); 
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('unit', formData.unit);
    data.append('stock', formData.stock);
    
    if (formData.description.trim()) {
        data.append('description', formData.description);
    }
    if (formData.picture_src) {
      data.append('picture_src', formData.picture_src); 
    }
    const result = await post("product/listCreate/", data);
    if (result.success) {
      const matchedCategory = categories.find(
        c => String(c.id) === String(result.data.category)
      );
      const enrichedProduct = {
        ...result.data,
        category_name: result.data.category_name || matchedCategory?.name || ""
      };
      setProducts(prev => [enrichedProduct, ...prev]);
      setFormData({
        name: "",
        category: categories.length > 0 ? categories[0].id : "", 
        price: "",
        unit: "",
        stock: "",
        description: "",
        picture_src: null
      });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setShowForm(false);
    }
  };
const filteredProducts = products.filter(p => {
  const matchesSearch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesTab = activeTab === "All" || (p.category_name || "").toLowerCase() === activeTab.toLowerCase();
  return matchesSearch && matchesTab;
});
  return (
    <Container>
      <Header>
        <div className="title-box">
          <h2>Inventory Catalog</h2>
          <p>Manage products, pricing, and stock levels.</p>
        </div>
        <ActionRow>
          <SearchBox>
            <Search size={18} />
            <input 
              placeholder="Search product name..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </SearchBox>
          <AddBtn onClick={() => setShowForm(true)}><Plus size={20} /> Add Product</AddBtn>
        </ActionRow>
      </Header>

      <TabRow>
        {["All", ...categories.map(cat => cat.name)].map((cat, index) => (
  <Tab key={index} $active={activeTab === cat} onClick={() => setActiveTab(cat)}>{cat}</Tab>
))}
      </TabRow>

      <TableContainer>
        <TableHead>
          <div className="col-img">Image</div>
          <div className="col-main">Product Details</div>
          <div className="col-cat">Category</div>
          <div className="col-price">Price</div>
          <div className="col-stock">Stock</div>
          <div className="col-actions">Actions</div>
        </TableHead>
        
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <TableRow key={product.id}>
              <div className="col-img">
                <img src={product.picture_src 
        ? product.picture_src 
        : 'https://via.placeholder.com/50'
      } alt="" />
              </div>
              <div className="col-main">
                <strong>{product.product_name}</strong>
                <span>ID: #PROD-{product.id}</span>
              </div>
              <div className="col-cat"><Tag>{product.category_name}</Tag></div>
              <div className="col-price">Rs. {product.price} <small>/{product.unit}</small></div>
              <div className="col-stock">
                  <StockStatus $low={parseInt(product.stock) < 20}>
                      {product.stock} {product.unit === 'Litre' ? 'L' : 'kg'} available
                  </StockStatus>
              </div>
              <div className="col-actions">
                <IconButton title="Edit"><Edit3 size={18}/></IconButton>
                <IconButton className="del" title="Delete"><Trash2 size={18}/></IconButton>
              </div>
            </TableRow>
          ))
        ) : (
          <EmptyState>No products found matching your criteria.</EmptyState>
        )}
      </TableContainer>

      {showForm && (
        <Overlay onClick={() => setShowForm(false)}>
          <Sidebar onClick={e => e.stopPropagation()}>
            <SidebarHeader>
              <div className="title">
                <Layers size={20} color="#7DAACB" />
                <h3>{loading ? "Processing..." : "Create New Product"}</h3>
              </div>
              <button className="close" onClick={() => setShowForm(false)}><X /></button>
            </SidebarHeader>

            <FormContent id="productForm" onSubmit={handleSubmit}>
               <PreviewCard>
                  <div className="preview-img">
                    {imagePreview ? <img src={imagePreview} alt="preview" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <ImageIcon size={24} color="#b2bec3" />}
                  </div>
                  <div className="preview-info">
                    <h5>{formData.name || "Product Name"}</h5>
                    <p>Rs. {formData.price || "0"} / {formData.unit}</p>
                  </div>
               </PreviewCard>

              <InputGroup>
                <label>Product Title</label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Buffalo Ghee" required />
              </InputGroup>

              <InputGroup>
                <label>Description <small style={{color: '#b2bec3', fontWeight: 400}}>(Optional)</small></label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Enter product details..."
                  rows="3"
                />
              </InputGroup>

              <InputGroup>
                <label>Upload Product Image</label>
                <UploadLabel>
                   <UploadCloud size={20} />
                   <span>{formData.picture_src ? formData.picture_src.name : "Choose an image"}</span>
                   <input 
                      type="file" 
                      name="picture_src" 
                      accept="image/*" 
                      onChange={handleInputChange} 
                      hidden 
                    />
                </UploadLabel>
              </InputGroup>

              <Row>
                <InputGroup>
                  <label>Category</label>
                 <select name="category" value={formData.category} onChange={handleInputChange}>
  {categories.map(c => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>
                </InputGroup>
                <InputGroup>
                  <label>Price (NPR)</label>
                  <input name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                </InputGroup>
              </Row>

              <Row>
                <InputGroup>
                  <label>Unit Type</label>
                  <input name="unit" value={formData.unit} onChange={handleInputChange} placeholder="Litre / kg" />
                </InputGroup>
                <InputGroup>
                  <label>Inventory Stock</label>
                  <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} required />
                </InputGroup>
              </Row>
            </FormContent>

            <SidebarFooter>
              <button type="button" className="cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" form="productForm" className="save" disabled={loading}>
                {loading ? "Saving..." : "Save Product"}
              </button>
            </SidebarFooter>
          </Sidebar>
        </Overlay>
      )}
    </Container>
  );
};


const Container = styled.div` padding: 30px; background: #F5F2EE; min-height: 100vh; font-family: 'DM Sans', sans-serif; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h2 { color: #2A1F10; } p { color: #8A7B6D; } `;
const ActionRow = styled.div` display: flex; gap: 15px; `;
const SearchBox = styled.div` background: white; border-radius: 12px; display: flex; align-items: center; padding: 0 15px; border: 1px solid #EAE3D6; width: 300px; input { border: none; outline: none; height: 48px; width: 100%; color: #2A1F10; } `;
const AddBtn = styled.button` background: #2A1F10; color: white; border: none; padding: 0 25px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; &:hover { background: #B8935A; } `;
const TabRow = styled.div` display: flex; gap: 10px; margin-bottom: 30px; `;
const Tab = styled.button` background: ${props => props.$active ? '#2A1F10' : 'transparent'}; color: ${props => props.$active ? 'white' : '#8A7B6D'}; border: 1px solid #EAE3D6; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; `;
const TableContainer = styled.div` background: white; border-radius: 20px; border: 1px solid #EAE3D6; overflow: hidden; `;
const TableHead = styled.div` display: grid; grid-template-columns: 80px 2fr 1fr 1fr 1.5fr 120px; padding: 20px; background: #F5F2EE; border-bottom: 1px solid #EAE3D6; font-size: 0.75rem; font-weight: 800; color: #2A1F10; text-transform: uppercase; `;
const TableRow = styled.div` display: grid; grid-template-columns: 80px 2fr 1fr 1fr 1.5fr 120px; padding: 15px 20px; align-items: center; border-bottom: 1px solid #F5F2EE; &:hover { background: #FCFBF9; } .col-img img { width: 45px; height: 45px; border-radius: 10px; object-fit: cover; } .col-main { display: flex; flex-direction: column; strong { color: #2A1F10; } span { font-size: 0.7rem; color: #8A7B6D; } } .col-price { font-weight: 700; color: #2A1F10; } `;
const Tag = styled.span` background: #F5F2EE; color: #8A7B6D; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; `;
const StockStatus = styled.div` font-size: 0.85rem; font-weight: 700; color: ${props => props.$low ? '#B91C1C' : '#15803D'}; `;
const IconButton = styled.button` background: none; border: none; padding: 8px; color: #8A7B6D; cursor: pointer; &:hover { color: #B8935A; } &.del:hover { color: #B91C1C; } `;
const Overlay = styled.div` position: fixed; inset: 0; background: rgba(42, 31, 16, 0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; justify-content: flex-end; `;
const Sidebar = styled.div` width: 450px; background: white; height: 100%; display: flex; flex-direction: column; border-left: 1px solid #EAE3D6; `;
const SidebarHeader = styled.div` padding: 25px 30px; border-bottom: 1px solid #EAE3D6; display: flex; justify-content: space-between; align-items: center; .title { display: flex; align-items: center; gap: 10px; color: #2A1F10; } .close { background: #F5F2EE; border: none; border-radius: 8px; padding: 8px; cursor: pointer; } `;
const FormContent = styled.form` padding: 25px 30px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; `;
const PreviewCard = styled.div` background: #F5F2EE; border: 1px solid #EAE3D6; border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 15px; .preview-img { width: 50px; height: 50px; border-radius: 8px; background: white; display: flex; align-items: center; justify-content: center; } h5 { margin: 0; color: #2A1F10; } p { margin: 0; font-size: 0.8rem; color: #8A7B6D; } `;
const InputGroup = styled.div` display: flex; flex-direction: column; gap: 6px; label { font-size: 0.75rem; font-weight: 700; color: #2A1F10; } input, select, textarea { padding: 12px; border-radius: 8px; border: 1px solid #EAE3D6; font-family: inherit; &:focus { outline: none; border-color: #B8935A; } } `;
const UploadLabel = styled.label` border: 2px dashed #EAE3D6; padding: 20px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #B8935A; font-weight: 700; span { font-size: 0.8rem; color: #8A7B6D; } &:hover { background: #F5F2EE; } `;
const Row = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 15px; `;
const SidebarFooter = styled.div` padding: 20px 30px; background: white; border-top: 1px solid #EAE3D6; display: flex; gap: 12px; button { flex: 1; padding: 14px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; } .save { background: #2A1F10; color: white; &:hover { background: #B8935A; } } .cancel { background: #F5F2EE; color: #2A1F10; } `;
const EmptyState = styled.div` padding: 40px; text-align: center; color: #8A7B6D; font-weight: 600; `;
export default Products;