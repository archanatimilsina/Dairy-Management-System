import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, Leaf, CheckCircle, Loader2, Droplets } from 'lucide-react';
import Navbar from '../elementComponent/Navbar';
import FooterSection from '../elementComponent/Footer';
import useApi from '../../hooks/useApi';
import DairyImage from '../../../public/Dairy.jpg'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background-color: #FAF7F2; font-family: 'DM Sans', sans-serif; color: #2A1F10; }
`;

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [CATEGORIES, setCategories] = useState(["All"]);



 useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      const productRes = await get('product/listCreate/');
      const categoriesRes= await get('product/category/listCreate/')

      const cartRes = localStorage.getItem("IsLoggedIn") 
        ? await get('product/cart/listCreate/') 
        : { success: true, data: [] };
      

if (categoriesRes.success) {
  const backendCatNames = categoriesRes.data.map(cat => cat.name);
   setCategories(["All", ...backendCatNames]);
}
      if (productRes.success) {
        setProducts(Array.isArray(productRes.data) ? productRes.data : productRes.data.results || []);
      }
      if (cartRes.success) setCartItems(cartRes.data);
      setIsLoading(false);
    };
    initializePage();
  }, [get]);

  const handleAddToCart = async (productId) => {
    if (!localStorage.getItem("IsLoggedIn")) return navigate('/loginPage');
    const result = await post('product/cart/listCreate/', { product: productId });
    if (result.success) setCartItems(prev => [...prev, result.data]);
  };

const filteredProducts = products.filter(p => 
    activeCategory === "All" || p.category_name.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <PageWrapper>
      <GlobalStyle />
   

      <HeroSection>
        <HeroGrid>
          <HeroContent>
            <Badge><Leaf size={14} /> Certified Organic</Badge>
            <h1>Nature’s Purest <br/><em>Morning Ritual</em></h1>
            <p>Experience the richness of high-altitude, farm-fresh dairy delivered straight from our pastures to your doorstep.</p>
            <PrimaryBtn onClick={() => navigate("/products")}>Explore Collection <ArrowRight size={18}/></PrimaryBtn>
          </HeroContent>

          <VisualColumn>
            <FloatingCard style={{ top: '10%', right: '10%' }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <Droplets size={18} color="#B8935A" /> <span>100% Raw</span>
            </FloatingCard>
            <FloatingCard style={{ bottom: '10%', left: '10%' }} animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
              <Truck size={18} color="#B8935A" /> <span>Fast Delivery</span>
            </FloatingCard>
          </VisualColumn>
        </HeroGrid>
      </HeroSection>

      <ShopSection>
        <Container>
          <ShopHeader>
            <h2>Fresh Collection</h2>
            <FilterBar>
              {CATEGORIES.map(cat => (
                <FilterChip key={cat} $active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>{cat}</FilterChip>
              ))}
            </FilterBar>
          </ShopHeader>

          {isLoading ? <LoadingState><Loader2 className="animate-spin" size={32} /></LoadingState> : (
            <ProductGrid>
              {filteredProducts.filter(p => activeCategory === "All" || p.category_name === activeCategory).map(product => (
                <ProductCard key={product.id}>
                  <div className="img-wrap"><img src={product.picture_src} alt={product.product_name} /></div>
                  <div className="info">
                    <h4>{product.product_name}</h4>
                    <div className="price-row">
                      <span>Rs. {product.price}</span>
                      <button onClick={() => handleAddToCart(product.id)} disabled={cartItems.some(i => i.product === product.id)}>
                        {cartItems.some(i => i.product === product.id) ? <CheckCircle size={20}/> : <ShoppingCart size={20}/>}
                      </button>
                    </div>
                  </div>
                </ProductCard>
              ))}
            </ProductGrid>
          )}
        </Container>
      </ShopSection>
      <FooterSection />
    </PageWrapper>
  );
};


const PageWrapper = styled.div`width: 100%;`;
const Container = styled.div`max-width: 1200px; margin: 0 auto; padding: 0 5%;`;

const HeroSection = styled.section`
  padding: 100px 5%; height: 85vh; min-height: 800px;

  background:url('../../../public/Dairy.jpg')center/cover no-repeat;
  position: relative;
  &::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(98, 93, 86, 0.5); }
`;

const HeroGrid = styled(Container)`
  display: grid; grid-template-columns: 1fr 1fr; height: 100%; align-items: center; position: relative; z-index: 1;
  @media(max-width: 900px) { grid-template-columns: 1fr; text-align: center; }
`;

const HeroContent = styled.div`
  color: #FFF;
  h1 { font-family: 'Playfair Display'; font-size: 3.5rem; line-height: 1.1; margin: 0 0 20px; }
  em { color: #B8935A; font-style: italic; }
  p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
`;

const VisualColumn = styled.div`
  position: relative; height: 100%; min-height: 300px;
  @media(max-width: 900px) { display: none; }
`;

const FloatingCard = styled(motion.div)`
  position: absolute; background: white; padding: 15px 25px; border-radius: 20px; 
  display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); color: #2A1F10;
`;

const Badge = styled.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1);
  border-radius: 50px; font-weight: 700; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.2);
`;

const ShopSection = styled.section`padding: 80px 0;`;
const ShopHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; flex-wrap: wrap; gap: 20px;`;
const FilterBar = styled.div`display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px;`;
const FilterChip = styled.button`
  padding: 8px 20px; border-radius: 20px; border: none; cursor: pointer;
  background: ${props => props.active ? '#2A1F10' : '#EAE3D6'}; color: ${props => props.active ? '#FFF' : '#2A1F10'};
`;

const ProductGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px;`;
const ProductCard = styled.div`
  background: white; border-radius: 20px; padding: 15px; border: 1px solid #EAE3D6;
  .img-wrap { height: 220px; border-radius: 15px; overflow: hidden; margin-bottom: 15px; img { width: 100%; height: 100%; object-fit: cover; } }
  .info { .price-row { display: flex; justify-content: space-between; align-items: center; font-weight: 700; } }
`;

const LoadingState = styled.div`display: flex; justify-content: center; padding: 100px;`;
const PrimaryBtn = styled.button`
  background: #B8935A; color: #FFF; padding: 18px 35px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer;
`;

export default HomePage;