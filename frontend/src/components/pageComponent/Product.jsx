import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../elementComponent/Navbar';
import FooterSection from '../elementComponent/Footer';
const ProductPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

 const PRODUCT_DATA = [

  { id: 1, name: "Fresh Cow Milk", category: "Milk", price: 120, unit: "Litre", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Standard Buffalo Milk", category: "Milk", price: 150, unit: "Litre", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800" },
  
{ id: 4, name: "Fresh Soft Paneer", category: "Paneer", price: 380, unit: "500g", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=500&auto=format&fit=crop" },
  { id: 6, name: "Low-Fat Diet Paneer", category: "Paneer", price: 400, unit: "500g", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop" },


  { id: 7, name: "Himalayan Yak Cheese", category: "Cheese", price: 1200, unit: "500g", image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=500&auto=format&fit=crop" },
  { id: 8, name: "Mozzarella Shredded", category: "Cheese", price: 550, unit: "200g", image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=500&auto=format&fit=crop" },


  { id: 11, name: "White Nauni (Unsalted)", category: "Nauni", price: 320, unit: "500g", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=500&auto=format&fit=crop" },
  { id: 12, name: "Pure Cow Butter", category: "Nauni", price: 350, unit: "500g", image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=500&auto=format&fit=crop" },


  { id: 14, name: "Danfe Pure Cow Ghee", category: "Ghee", price: 1100, unit: "1 Litre", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=500&auto=format&fit=crop" },
  { id: 15, name: "Local Buffalo Ghee", category: "Ghee", price: 1300, unit: "1 Litre", image: "https://images.unsplash.com/photo-1627308595186-e6bb36712645?q=80&w=500&auto=format&fit=crop" },


  { id: 17, name: "Vanilla Cloud Cake", category: "Cake", price: 850, unit: "Pound", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=500&auto=format&fit=crop" },
  { id: 18, name: "Dark Chocolate Truffle", category: "Cake", price: 1200, unit: "Pound", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop" },
  { id: 20, name: "Fresh Fruit Gateau", category: "Cake", price: 1100, unit: "Pound", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=500&auto=format&fit=crop" }
];

  const categories = ["All", "Milk", "Paneer", "Cheese", "Nauni", "Ghee", "Cake"];
  
  const filteredProducts = activeFilter === "All" 
    ? PRODUCT_DATA 
    : PRODUCT_DATA.filter(p => p.category === activeFilter);

  return (
    <PageWrapper>
      <Navbar />
      <HeaderSection>
        <h1>Our Fresh Shop</h1>
        <p>Direct from local farms to your kitchen.</p>
      </HeaderSection>

      <MainLayout>
        <Sidebar>
          <h3>Categories</h3>
          <div className="filter-list">
            {categories.map((cat) => (
              <FilterBtn 
                key={cat} 
                active={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </FilterBtn>
            ))}
          </div>
        </Sidebar>

        <ProductGridContainer>
          <GridHeader>
            <span>Showing {filteredProducts.length} Products</span>
          </GridHeader>
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductItem key={product.id}>
                <div className="img-box">
                  <img src={product.image} alt={product.name} />
                  <span className="tag">{product.category}</span>
                </div>
                <div className="details">
                  <div className="header-info">
                    <h4>{product.name}</h4>
                    <span className="unit">/{product.unit}</span>
                  </div>
                  <div className="price-row">
                    <span className="price">Rs. {product.price}</span>
                  </div>

                  <ActionArea>
                    <button className="sub-btn">
                      <span className="icon">Repeat Order</span> 
                    </button>
                    <div className="buy-row">
                      <button className="cart-btn">Add to Cart</button>
                      <button className="buy-btn">One-Time Buy</button>
                    </div>
                  </ActionArea>
                </div>
              </ProductItem>
            ))}
          </ProductGrid>
        </ProductGridContainer>
      </MainLayout>
    </PageWrapper>
  );
};

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background: #f8fbff;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  text-align: center;
  padding: 80px 5%;
  background: linear-gradient(135deg, #CFECF3 0%, #ffffff 100%);
  h1 { font-size: 3.2rem; color: #2d3436; margin-bottom: 10px; }
  p { color: #7DAACB; font-size: 1.1rem; font-weight: 500; }
`;

const MainLayout = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  padding: 40px 5%;
  gap: 40px;
  @media (max-width: 900px) { flex-direction: column; }
`;

const Sidebar = styled.aside`
  flex: 0 0 260px;
  h3 { margin-bottom: 24px; font-size: 1.4rem; color: #2d3436; font-weight: 800; }
  .filter-list { display: flex; flex-direction: column; gap: 12px; }
`;

const FilterBtn = styled.button`
  text-align: left;
  padding: 14px 24px;
  border-radius: 16px;
  border: 2px solid ${props => props.active ? '#7DAACB' : 'transparent'};
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#2d3436' : '#636e72'};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { background: white; color: #2d3436; transform: translateX(5px); }
`;

const ProductGridContainer = styled.div`
  flex: 1;
`;

const GridHeader = styled.div`
  margin-bottom: 30px;
  span { font-weight: 600; color: #b2bec3; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 35px;
`;

const ProductItem = styled.div`
  background: white;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid #f0f3f7;
  transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(125, 170, 203, 0.15); }

  .img-box {
    height: 240px;
    position: relative;
    img { width: 100%; height: 100%; object-fit: cover; }
    .tag {
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      padding: 6px 16px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 800;
      color: #7DAACB;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }

  .details {
    padding: 25px;
    .header-info {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      h4 { font-size: 1.4rem; color: #2d3436; margin-bottom: 5px; }
      .unit { font-size: 0.85rem; color: #b2bec3; font-weight: 600; }
    }
    .price { font-size: 1.8rem; font-weight: 900; color: #2d3436; }
  }
`;

const ActionArea = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  button {
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: 0.3s;
  }

  .sub-btn {
    background: #eef7f9;
    color: #5a8ba3;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    &:hover { background: #CFECF3; color: #2d3436; }
  }

  .buy-row {
    display: flex;
    gap: 10px;
    .cart-btn {
      flex: 1;
      background: #f8f9fa;
      color: #2d3436;
      &:hover { background: #e9ecef; }
    }
    .buy-btn {
      flex: 1.5;
      background: #2d3436;
      color: white;
      &:hover { background: #7DAACB; }
    }
  }
`;

export default ProductPage;