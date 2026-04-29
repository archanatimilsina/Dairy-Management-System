import React, { useState } from 'react'
import styled from 'styled-components'
import Navbar from '../elementComponent/Navbar'
import FooterSection from '../elementComponent/Footer'
import image1 from '/img1.jpg'

const HomePage = () => {
  const [filter, setFilter] = useState("All");
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

  const filteredProducts = filter === "All" 
    ? PRODUCT_DATA 
    : PRODUCT_DATA.filter(p => p.category === filter);

  return (
    <PageWrapper>
      <Navbar />
      <HeroContainer>
        <HeroSection>
          <div className="hero-content">
            <span className="badge">100% Organic & Fresh</span>
            <h1>Pure Milk, <br/><span>Straight to Your Door</span></h1>
            <p>खेतदेखि ओठसम्म, ताजा र शुद्ध दुध अब तपाईंको घरदैलोमा।</p>
            <button className="cta-btn">Explore Products</button>
          </div>
          <div className="hero-image">
            <img src={image1} alt="Fresh Dairy" />
          </div>
        </HeroSection>
      </HeroContainer>



      <HowItWorksSection>
        <div className="center-text">
          <span className="sub-title">Simple & Easy</span>
          <h2>How Elsa Diary Works</h2>
        </div>
        <div className="steps-grid">
          <div className="step">
            <div className="number">01</div>
            <h4>Place Order</h4>
            <p>Select your favorite dairy products from our collection.</p>
          </div>
          <div className="step">
            <div className="number">02</div>
            <h4>Freshly Packed</h4>
            <p>We pack your order with care using eco-friendly materials.</p>
          </div>
          <div className="step">
            <div className="number">03</div>
            <h4>Morning Delivery</h4>
            <p>Get fresh delivery at your doorstep every morning.</p>
          </div>
        </div>
      </HowItWorksSection>

      <SectionContainer>
        <div className="section-header">
          <div className="title-text">
            <h2>Our Fresh Collection</h2>
            <p>Quality dairy and bakery products for your daily needs.</p>
          </div>
          
          <FilterTabs>
            {categories.map(cat => (
              <Tab 
                key={cat} 
                active={filter === cat} 
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Tab>
            ))}
          </FilterTabs>
        </div>

        <ProductSlider>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id}>
              <div className="img-holder">
                <img src={product.image} alt={product.name} />
                <div className="category-tag">{product.category}</div>
              </div>
              <div className="info">
                <h4>{product.name}</h4>
                <p className="unit-text">Per {product.unit}</p>
                <div className="price-row">
                  <span className="price-tag">Rs. {product.price}</span>
                </div>
                <div className="button-group">
                  <button className="cart-btn">Add to Cart</button>
                  <button className="buy-btn">Buy Now</button>
                </div>
              </div>
            </ProductCard>
          ))}
        </ProductSlider>
      </SectionContainer>
<FooterSection />
    </PageWrapper>
  )
}


const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`;

const HeroContainer = styled.div`
  padding: 20px 5%;
`;

const HeroSection = styled.section`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #CFECF3 0%, #e2f5f9 100%);
  border-radius: 40px;
  padding: 80px;
  position: relative;

  .hero-content {
    width: 55%;
    .badge {
      background: #7DAACB;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h1 {
      font-size: 4rem;
      color: #2d3436;
      line-height: 1.1;
      margin: 20px 0;
      span { color: #5a8ba3; }
    }
    p {
      font-size: 1.2rem;
      color: #636e72;
      margin-bottom: 40px;
      max-width: 500px;
    }
    .cta-btn {
      padding: 18px 45px;
      background: #2d3436;
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.4s;
      &:hover { background: #7DAACB;
         transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(125,170,203,0.3); }
    }
  }

  .hero-image {
    width: 450px;
    height: 450px;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.12);
    img { width: 100%;
       height: 100%; 
      object-fit: cover;
       transition: 1.5s ease; }
    &:hover img { transform: scale(1.1); }
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 60px 30px;
    text-align: center;
    .hero-content { width: 100%; margin-bottom: 50px; p { margin: 20px auto 40px; } }
  }
`;

const HowItWorksSection = styled.section`
  padding: 100px 5% 50px;
  max-width: 1200px;
  margin: 0 auto;
  .center-text {
    text-align: center;
    margin-bottom: 60px;
    .sub-title {
       color: #7DAACB; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      font-size: 0.9rem; 
    }
    h2 { 
      font-size: 2.8rem; 
      color: #2d3436; 
      margin-top: 10px; 
    }
  }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }
  .step {
    text-align: center;
    .number {
      font-size: 4rem;
      font-weight: 900;
      color: #CFECF3;
      line-height: 1;
      margin-bottom: 20px;
    }
    h4 { font-size: 1.4rem; color: #2d3436; margin-bottom: 15px; }
    p { color: #636e72; line-height: 1.6; }
  }

  @media (max-width: 768px) {
    .steps-grid { grid-template-columns: 1fr; }
  }
`;

const SectionContainer = styled.div`
  padding: 80px 5%;
  max-width: 1400px;
  margin: 0 auto;

  .section-header {
    margin-bottom: 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    h2 { font-size: 2.8rem; color: #2d3436; margin-bottom: 10px; }
    p { color: #b2bec3; font-size: 1.1rem; }
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 12px;
  background: #f1f2f6;
  padding: 6px;
  border-radius: 30px;
  overflow-x: auto;
  scrollbar-width: none;
`;

const Tab = styled.button`
  padding: 12px 28px;
  border-radius: 25px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#2d3436' : '#636e72'};
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'};
  transition: 0.3s;
`;

const ProductSlider = styled.div`
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding: 20px 0 40px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ProductCard = styled.div`
  flex: 0 0 320px;
  background: #ffffff;
  border-radius: 32px;
  padding: 20px;
  border: 1px solid #f1f2f6;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover { 
    transform: translateY(-12px); 
    box-shadow: 0 25px 50px rgba(0,0,0,0.06);
    border-color: #CFECF3;
  }
  
  .img-holder {
    height: 240px;
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
    img { width: 100%; height: 100%; object-fit: cover; }
    .category-tag {
      position: absolute;
      top: 15px;
      right: 15px;
      background: white;
      padding: 6px 14px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 800;
      color: #7DAACB;
    }
  }

  .info {
    h4 { color: #2d3436; font-size: 1.3rem; margin-bottom: 8px; }
    .unit-text { color: #b2bec3; font-size: 0.9rem; margin-bottom: 15px; font-weight: 500; }
    .price-tag { font-weight: 900; color: #2d3436; font-size: 1.6rem; }
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 25px;
    button {
      flex: 1;
      padding: 14px;
      border-radius: 16px;
      border: none;
      font-weight: 700;
      cursor: pointer;
    }
    .cart-btn { background: #f8f9fa; color: #2d3436; }
    .buy-btn { background: #7DAACB; color: white; }
  }
`;

export default HomePage;