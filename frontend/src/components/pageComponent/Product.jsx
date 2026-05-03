import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../elementComponent/Navbar';
import FooterSection from '../elementComponent/Footer';
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';

const ProductPage = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await get('product/listCreate/');
      if (result.success) setProducts(result.data);
    };
    const fetchCartItems = async () => {
      const result = await get('product/cart/listCreate/');
      if (result.success) setCartItems(result.data);
    };
    fetchProducts();
    fetchCartItems();
  }, [get]);

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  const addToCart = async (productID) => {
    if (!localStorage.getItem("IsLoggedIn")) {
      navigate('/loginPage');
      return;
    }
    const result = await post('product/cart/listCreate/', { product: productID });
    if (result.success) {
      setCartItems([...cartItems, result.data]);
    }
  };

  const categories = ["All", "Milk", "Paneer", "Cheese", "Nauni", "Ghee", "Cake"];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeFilter === "All" || p.category === activeFilter;
    const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <Navbar />
      
      <HeroSection>
        <div className="hero-content">
          <h1>Elsa Premium Dairy</h1>
          <p>Pure. Organic. Fresh from the Farm.</p>
          <SearchWrapper>
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for milk, ghee, cakes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
        </div>
      </HeroSection>

      <MainContainer>
        <Sidebar>
          <SidebarTitle>Categories</SidebarTitle>
          <FilterList>
            {categories.map((cat) => (
              <FilterItem 
                key={cat} 
                $active={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
                {activeFilter === cat && <div className="active-dot" />}
              </FilterItem>
            ))}
          </FilterList>
        </Sidebar>

        <ContentArea>
          <ResultsInfo>
            <h2>{activeFilter} Collection</h2>
            <span>{filteredProducts.length} items found</span>
          </ResultsInfo>

          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id}>
                <ImageContainer>
                  <img src={product.picture_src} alt={product.product_name} />
                  <CategoryBadge>{product.category}</CategoryBadge>
                </ImageContainer>
                
                <CardBody>
                  <div className="meta">
                    <h4>{product.product_name}</h4>
                    <span className="unit">{product.unit}</span>
                  </div>
                  
                  <PriceRow>
                    <span className="currency">Rs.</span>
                    <span className="amount">{product.price}</span>
                  </PriceRow>

                  <ButtonGroup>
                    <CartButton 
                      onClick={() => addToCart(product.id)} 
                      disabled={isProductInCart(product.id)}
                      $inCart={isProductInCart(product.id)}
                    >
                      {isProductInCart(product.id) ? (
                        <><FiCheckCircle /> In Cart</>
                      ) : (
                        <><FiShoppingBag /> Add</>
                      )}
                    </CartButton>
                    <BuyNowButton>Buy Now</BuyNowButton>
                  </ButtonGroup>
                </CardBody>
              </ProductCard>
            ))}
          </ProductGrid>
        </ContentArea>
      </MainContainer>
      <FooterSection />
    </PageWrapper>
  );
};


const PageWrapper = styled.div`
  background-color: #fcfdfe;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.div`
  height: 400px;
  background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.05)), 
              url('https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=2000');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .hero-content {
    h1 { font-size: 3.5rem; font-weight: 900; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
    p { color: #fff; font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
  }
`;

const SearchWrapper = styled.div`
  background: white;
  padding: 10px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  width: 500px;
  max-width: 90vw;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  .search-icon { color: #7DAACB; font-size: 1.2rem; }
  input {
    border: none;
    outline: none;
    padding: 10px 15px;
    width: 100%;
    font-size: 1rem;
    &::placeholder { color: #a0a0a0; }
  }
`;

const MainContainer = styled.div`
  max-width: 1300px;
  margin: -50px auto 80px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  padding: 0 20px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: white;
  padding: 30px;
  border-radius: 24px;
  height: fit-content;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  position: sticky;
  top: 100px;
`;

const SidebarTitle = styled.h3`
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin-bottom: 20px;
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterItem = styled.div`
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.$active ? '#2d3436' : '#777'};
  background: ${props => props.$active ? '#f0f7ff' : 'transparent'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;

  &:hover { background: #f8fbff; color: #2d3436; }
  
  .active-dot {
    width: 6px;
    height: 6px;
    background: #7DAACB;
    border-radius: 50%;
  }
`;

const ContentArea = styled.main``;

const ResultsInfo = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  h2 { font-size: 1.8rem; font-weight: 800; color: #2d3436; }
  span { color: #999; font-weight: 500; }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
  ${ProductCard}:hover img { transform: scale(1.05); }
`;

const CategoryBadge = styled.span`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(5px);
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #7DAACB;
  text-transform: uppercase;
`;

const CardBody = styled.div`
  padding: 20px;
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
    h4 { font-size: 1.1rem; font-weight: 700; color: #2d3436; }
    .unit { font-size: 0.8rem; color: #aaa; }
  }
`;

const PriceRow = styled.div`
  margin-bottom: 20px;
  .currency { font-size: 0.9rem; font-weight: 600; color: #7DAACB; margin-right: 4px; }
  .amount { font-size: 1.4rem; font-weight: 800; color: #2d3436; }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const CartButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.3s;
  background: ${props => props.$inCart ? '#e7f3ff' : '#f5f5f5'};
  color: ${props => props.$inCart ? '#007bff' : '#555'};
  
  &:hover { background: ${props => props.$inCart ? '#e7f3ff' : '#e0e0e0'}; }
`;

const BuyNowButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 10px;
  background: #2d3436;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover { background: #7DAACB; }
`;

export default ProductPage;