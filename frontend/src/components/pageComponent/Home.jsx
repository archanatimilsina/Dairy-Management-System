import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, Droplets, Leaf, Star, Mail, Menu } from 'lucide-react';
import Navbar from '../elementComponent/Navbar';
import FooterSection from '../elementComponent/Footer';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    padding: 0;
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PRODUCT_DATA = [
  { id: 1, name: "Premium Cow Milk", category: "Milk", price: 120, unit: "Litre", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Organic Soft Paneer", category: "Paneer", price: 380, unit: "500g", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=500&auto=format&fit=crop" },
  { id: 7, name: "Himalayan Yak Cheese", category: "Cheese", price: 1200, unit: "500g", image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=500&auto=format&fit=crop" },
  { id: 14, name: "Pure Danfe Ghee", category: "Ghee", price: 1100, unit: "1 Litre", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=500&auto=format&fit=crop" },
  { id: 17, name: "Vanilla Cloud Cake", category: "Cake", price: 850, unit: "Pound", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=500&auto=format&fit=crop" },
  { id: 12, name: "Artisan Salted Butter", category: "Nauni", price: 350, unit: "500g", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=500&auto=format&fit=crop" },
];

const CATEGORIES = ["All", "Milk", "Paneer", "Cheese", "Nauni", "Ghee", "Cake"];

const HomePage = () => {
  const [filter, setFilter] = useState("All");

  const filteredProducts = filter === "All" 
    ? PRODUCT_DATA 
    : PRODUCT_DATA.filter(p => p.category === filter);

  return (
    <PageWrapper>
      <GlobalStyle />
      <Navbar />

      <HeroSection>
        <div className="container">
          <HeroContent initial="hidden" animate="show" variants={containerVariants}>
            <motion.div variants={itemVariants} className="badge">
              <Leaf size={14} /> Certified Organic
            </motion.div>
            <motion.h1 variants={itemVariants}>
              Nature’s Purest <br/><span>Morning Ritual</span>
            </motion.h1>
            <motion.p variants={itemVariants}>
              Sourced from high-altitude local farms, delivered fresh to your doorstep before the city wakes up.
            </motion.p>
            <motion.div variants={itemVariants} className="btn-group">
              <PrimaryBtn>Shop Now <ArrowRight size={18}/></PrimaryBtn>
              <SecondaryBtn>Our Story</SecondaryBtn>
            </motion.div>
          </HeroContent>

          <HeroVisual initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="img-box">
              <img src="https://images.unsplash.com/photo-1528498033053-3564abbaaf9f?q=80&w=1200&auto=format&fit=crop" alt="Fresh Milk" />
              <FloatingCard style={{ top: '15%', right: '-5%' }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                <Droplets size={18} color="#B8935A" /> <span>100% Raw</span>
              </FloatingCard>
              <FloatingCard style={{ bottom: '20%', left: '-5%' }} animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
                <Truck size={18} color="#B8935A" /> <span>Fast Delivery</span>
              </FloatingCard>
            </div>
          </HeroVisual>
        </div>
      </HeroSection>

      {/* ── Feature Grid ── */}
      <FeatureSection>
        <div className="container">
          <SectionHeader>
            <span className="label">The Quality Check</span>
            <h2>Why Choose Elsa?</h2>
          </SectionHeader>
          <div className="grid">
            {[
              { icon: <Leaf />, title: "Sustainable", desc: "Eco-friendly farming practices." },
              { icon: <ShieldCheck />, title: "Certified", desc: "24-point purity check." },
              { icon: <Truck />, title: "Cold-Chain", desc: "Temperature controlled logistics." }
            ].map((f, i) => (
              <FeatureCard key={i}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </FeatureCard>
            ))}
          </div>
        </div>
      </FeatureSection>

      {/* ── Product Section ── */}
      <ShopSection>
        <div className="container">
          <ShopHeader>
            <div className="title-area">
              <h2>The Collection</h2>
              <p>Pure dairy, from our farm to your home.</p>
            </div>
            <FilterWrapper>
              {CATEGORIES.map(cat => (
                <FilterBtn 
                  key={cat} 
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </FilterBtn>
              ))}
            </FilterWrapper>
          </ShopHeader>

          <ProductGrid layout>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="img-wrap">
                    <img src={product.image} alt={product.name} />
                    <span className="category-tag">{product.category}</span>
                  </div>
                  <div className="details">
                    <h4>{product.name}</h4>
                    <span className="unit">{product.unit}</span>
                    <div className="footer">
                      <span className="price">Rs. {product.price}</span>
                      <button className="add-btn"><ShoppingCart size={18} /></button>
                    </div>
                  </div>
                </ProductCard>
              ))}
            </AnimatePresence>
          </ProductGrid>
        </div>
      </ShopSection>

      <FooterSection />
    </PageWrapper>
  );
};

/* ── Styled Components ───────────────────────────── */

const PageWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  padding: 120px 5% 80px;
  background: white;

  .container {
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      text-align: center;
      padding-top: 60px;
    }
  }
`;

const HeroContent = styled(motion.div)`
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #FAF7F2;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #B8935A;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    line-height: 1.1;
    margin-bottom: 20px;
    span { color: #B8935A; font-style: italic; }
  }

  p {
    font-size: 1.1rem;
    color: #7A6A52;
    max-width: 500px;
    margin: 0 0 40px 0;
    @media (max-width: 1024px) { margin-inline: auto; }
  }

  .btn-group {
    display: flex;
    gap: 15px;
    @media (max-width: 1024px) { justify-content: center; }
    @media (max-width: 480px) { flex-direction: column; }
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  .img-box {
    position: relative;
    img {
      width: 100%;
      height: 550px;
      object-fit: cover;
      border-radius: 30px;
      @media (max-width: 768px) { height: 350px; }
    }
  }
`;

const FloatingCard = styled(motion.div)`
  position: absolute;
  background: white;
  padding: 12px 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  z-index: 10;
  span { font-weight: 700; font-size: 0.9rem; }
  @media (max-width: 500px) { display: none; }
`;

const FeatureSection = styled.section`
  padding: 80px 5%;
  .container { max-width: 1200px; margin: 0 auto; }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  .label { color: #B8935A; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }
  h2 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-top: 10px; }
`;

const FeatureCard = styled.div`
  padding: 40px;
  background: white;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s ease;
  &:hover { transform: translateY(-5px); }
  .icon { color: #B8935A; margin-bottom: 20px; svg { width: 40px; height: 40px; } }
  h3 { font-family: 'Playfair Display', serif; margin-bottom: 10px; }
  p { color: #7A6A52; font-size: 0.95rem; }
`;

const ShopSection = styled.section`
  padding: 80px 5%;
  .container { max-width: 1300px; margin: 0 auto; }
`;

const ShopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  @media (max-width: 900px) { flex-direction: column; align-items: center; text-align: center; gap: 30px; }

  h2 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 8px; }
  p { color: #7A6A52; }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 10px;
  background: white;
  padding: 6px;
  border-radius: 50px;
  overflow-x: auto;
  max-width: 100%;
  &::-webkit-scrollbar { display: none; }
`;

const FilterBtn = styled.button`
  padding: 10px 22px;
  border: none;
  border-radius: 50px;
  background: ${props => props.active ? '#2A1F10' : 'transparent'};
  color: ${props => props.active ? 'white' : '#7A6A52'};
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.3s;
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 12px;
  border: 1px solid #EAE3D6;

  .img-wrap {
    height: 250px;
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    img { width: 100%; height: 100%; object-fit: cover; }
    .category-tag {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(4px);
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 800;
      color: #B8935A;
    }
  }

  .details {
    padding: 15px 5px;
    h4 { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 5px; }
    .unit { color: #B2A08A; font-size: 0.85rem; }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      .price { font-weight: 800; font-size: 1.2rem; }
      .add-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: none;
        background: #FAF7F2;
        cursor: pointer;
        &:hover { background: #2A1F10; color: white; }
      }
    }
  }
`;

const PrimaryBtn = styled.button`
  background: #2A1F10;
  color: white;
  border: none;
  padding: 16px 30px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const SecondaryBtn = styled.button`
  background: white;
  border: 1px solid #D8CFBE;
  padding: 16px 30px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export default HomePage;