import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, Leaf, CheckCircle, Loader2, Droplets } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { resolveMediaUrl } from '../../utils/media';


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
  const catList = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data?.results || []);
  const backendCatNames = catList.map(cat => cat.name);
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
    activeCategory === "All" || (p.category_name || '').toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <PageWrapper>
      
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
              {filteredProducts.map(product => (
                <ProductCard key={product.id}>
                  <div className="img-wrap"><img loading="lazy" src={resolveMediaUrl(product.picture_src)} alt={product.product_name} onError={(e) => { e.currentTarget.src = '/logo.png'; }} /></div>
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
    </PageWrapper>
  );
};


const PageWrapper = styled.div`width: 100%;`;
const Container = styled.div`max-width: 1200px; margin: 0 auto; padding: 0 5%;`;

const HeroSection = styled.section`
  padding: clamp(56px, 8vw, 100px) 5%;
  min-height: min(78vh, 720px);
  display: flex;
  align-items: center;
  background: url('/Dairy.jpg') center/cover no-repeat;
  position: relative;
  &::before { content: ''; position: absolute; inset: 0; background: rgba(42, 31, 16, 0.55); }
  @media (max-width: 768px) { min-height: 0; }
`;

const HeroGrid = styled(Container)`
  display: grid; grid-template-columns: 1.1fr 0.9fr; width: 100%; align-items: center; gap: 32px; position: relative; z-index: 1;
  @media(max-width: 900px) { grid-template-columns: 1fr; text-align: center; justify-items: center; }
`;

const HeroContent = styled.div`
  color: #FFF;
  max-width: 640px;
  h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 5vw + 1rem, 3.5rem); line-height: 1.08; margin: 0 0 20px; text-wrap: balance; }
  em { color: #E8C88A; font-style: italic; }
  p { font-size: clamp(1rem, 1.5vw + 0.8rem, 1.2rem); margin: 0 0 30px; opacity: 0.92; line-height: 1.6; }
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
  padding: 10px 20px; border-radius: 999px; border: 1px solid transparent; cursor: pointer;
  min-height: 44px; font-weight: 700; font-size: 0.9rem; white-space: nowrap; flex-shrink: 0;
  background: ${props => props.$active ? '#2A1F10' : '#EAE3D6'}; color: ${props => props.$active ? '#FFF' : '#2A1F10'};
`;

const ProductGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: clamp(16px, 3vw, 30px);`;
const ProductCard = styled.div`
  background: white; border-radius: 20px; padding: 15px; border: 1px solid #EAE3D6; min-width: 0;
  .img-wrap { aspect-ratio: 4 / 3; border-radius: 15px; overflow: hidden; margin-bottom: 15px; background: #F5F2EE; img { width: 100%; height: 100%; object-fit: cover; } }
  .info h4 { margin: 0 0 10px; font-size: 1rem; overflow: hidden; text-overflow: ellipsis; }
  .info { .price-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-weight: 700; } button { min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid #EAE3D6; background: #fff; cursor: pointer; } }
`;

const LoadingState = styled.div`display: flex; justify-content: center; padding: 100px;`;
const PrimaryBtn = styled.button`
  background: #B8935A; color: #FFF; padding: 16px 32px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer;
  min-height: 52px; font-size: 1rem; display: inline-flex; align-items: center; gap: 10px; max-width: 100%;
  &:hover { background: #2A1F10; }
  @media (max-width: 480px) { width: 100%; justify-content: center; }
`;

export default HomePage;