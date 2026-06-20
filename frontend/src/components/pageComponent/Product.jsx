import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../elementComponent/Navbar';
import FooterSection from '../elementComponent/Footer';
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const LocalStyle = createGlobalStyle`  
  body {
    background-color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    color: #2A1F10;
  }
`;

const ProductPage = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
const [CATEGORIES, setCategories] = useState(["All"]);  
const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await get(`product/listCreate/?page=${currentPage}`);
      const categoriesRes= await get('product/category/listCreate/')

      if (result.success) 
      {
        setProducts(result.data.results);
        setTotalPages(Math.ceil(result.data.count / PAGE_SIZE));
      }
      if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
        const backendCatNames = categoriesRes.data.map(cat => cat.name);
        setCategories(["All", ...backendCatNames]);
      }
    };
    const fetchCartItems = async () => {
      const result = await get('product/cart/listCreate/');
      if (result.success) setCartItems(result.data);
    };
    fetchProducts();
    fetchCartItems();
  }, [get, currentPage]);

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


  const filteredProducts = products?.filter(p => {
    const dbCategoryName = p.category_name || "";
    const matchesCategory = activeFilter === "All" || 
      dbCategoryName.trim().toLowerCase() === activeFilter.trim().toLowerCase();
    const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <LocalStyle />
      <HeroSection>
        <div className="hero-content">
          <h1>Elsa Market Catalog</h1>
          <p>Pure whole products. Hand-selected organic dairy choices.</p>
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
            {CATEGORIES.map((cat) => (
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
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageContainer>
                    <img src={product.picture_src} alt={product.product_name} loading="lazy" />
                    <CategoryBadge>{product.category_name}</CategoryBadge>
                  </ImageContainer>
                  
                  <CardBody>
                    <div className="meta">
                      <h4>{product.product_name}</h4>
                      <span className="unit">{product.unit} Pack</span>
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
                        whileTap={!isProductInCart(product.id) ? { scale: 0.95 } : {}}
                      >
                        {isProductInCart(product.id) ? (
                          <><FiCheckCircle /> In Cart</>
                        ) : (
                          <><FiShoppingBag /> Add</>
                        )}
                      </CartButton>
                      <BuyNowButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        Buy Now
                      </BuyNowButton>
                    </ButtonGroup>
                  </CardBody>
                </ProductCard>
              ))}
            </AnimatePresence>
          </ProductGrid>
          
          {totalPages > 1 && (
            <PaginationWrapper>
              <PageBtn 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronLeft /> Previous
              </PageBtn>
              
              <PageIndicator>
                Page <span>{currentPage}</span> of {totalPages}
              </PageIndicator>

              <PageBtn 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
                whileTap={{ scale: 0.95 }}
              >
                Next <FiChevronRight />
              </PageBtn>
            </PaginationWrapper>
          )}
        </ContentArea>
      </MainContainer>
    <FooterSection />
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  height: 440px;
  background: linear-gradient(180deg, rgba(42, 31, 16, 0.4) 0%, rgba(25, 25, 25, 0.65) 100%), 
              url('../../../public/Dairy.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;

  .hero-content {
    h1 { 
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.4rem, 5vw, 3.8rem); 
      font-weight: 700; 
      color: #FFFFFF; 
      margin-bottom: 12px;
    }
    p { 
      color: #FAF7F2; 
      font-size: 1.15rem; 
      margin-bottom: 35px; 
      opacity: 0.95; 
      letter-spacing: 0.5px;
    }
  }
`;

const SearchWrapper = styled.div`
  background: #FFFFFF;
  padding: 8px 24px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  width: 540px;
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(42, 31, 16, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);

  .search-icon { 
    color: #B8935A; 
    font-size: 1.3rem; 
  }
  
  input {
    border: none;
    outline: none;
    padding: 12px 14px;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: #2A1F10;
    background: transparent;
    &::placeholder { color: #A89B87; }
  }
`;

const MainContainer = styled.div`
  max-width: 1340px;
  margin: -60px auto 100px;
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 40px;
  padding: 0 5%;
  position: relative;
  z-index: 10;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    margin-top: 40px;
    gap: 30px;
  }
`;

const Sidebar = styled.aside`
  background: #FFFFFF;
  padding: 35px 25px;
  border-radius: 24px;
  height: fit-content;
  box-shadow: 0 10px 30px rgba(42, 31, 16, 0.04);
  border: 1px solid #EAE3D6;
  position: sticky;
  top: 120px;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    padding: 25px;
  }
`;

const SidebarTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #B8935A;
  font-weight: 700;
  margin-bottom: 24px;
  border-bottom: 1px solid #FAF7F2;
  padding-bottom: 10px;
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 1024px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const FilterItem = styled.div`
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${props => props.$active ? '#2A1F10' : '#6B5C4A'};
  background: ${props => props.$active ? '#F3EFE6' : 'transparent'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;

  &:hover { 
    background: #FAF7F2; 
    color: #2A1F10; 
  }
  
  .active-dot {
    width: 6px;
    height: 6px;
    background: #B8935A;
    border-radius: 50%;
  }

  @media (max-width: 1024px) {
    padding: 8px 16px;
    border-radius: 50px;
    border: 1px solid ${props => props.$active ? '#2A1F10' : '#EAE3D6'};
    background: ${props => props.$active ? '#2A1F10' : '#FFFFFF'};
    color: ${props => props.$active ? '#FFFFFF' : '#6B5C4A'};
    
    .active-dot { display: none; }
    &:hover { background: ${props => props.$active ? '#2A1F10' : '#FAF7F2'}; }
  }
`;

const ContentArea = styled.main`
  width: 100%;
`;

const ResultsInfo = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #EAE3D6;
  padding-bottom: 16px;
  
  h2 { 
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; 
    font-weight: 700; 
    color: #2A1F10; 
  }
  
  span { 
    color: #8C7A61; 
    font-weight: 500; 
    font-size: 0.95rem;
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: 30px;
`;

const ProductCard = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #EAE3D6;
  box-shadow: 0 4px 15px rgba(42, 31, 16, 0.02);
  padding: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  height: 230px;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: #FAF7F2;
  
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    transition: transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1); 
  }
  
  ${ProductCard}:hover img { 
    transform: scale(1.04); 
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #B8935A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
`;

const CardBody = styled.div`
  padding: 20px 6px 6px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    gap: 12px;
    
    h4 { 
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem; 
      font-weight: 700; 
      color: #2A1F10; 
      line-height: 1.3;
    }
    
    .unit { 
      font-size: 0.85rem; 
      color: #8C7A61; 
      white-space: nowrap;
      font-weight: 500;
    }
  }
`;

const PriceRow = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  
  .currency { 
    font-size: 0.9rem; 
    font-weight: 600; 
    color: #B8935A; 
    margin-right: 4px; 
  }
  
  .amount { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #2A1F10; 
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 12px;
  margin-top: auto;
`;

const CartButton = styled(motion.button)`
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: background-color 0.25s ease, color 0.25s ease;
  background: ${props => props.$inCart ? '#F3EFE6' : '#2A1F10'};
  color: ${props => props.$inCart ? '#B8935A' : '#FFFFFF'};
  border: 1px solid ${props => props.$inCart ? '#EAE3D6' : '#2A1F10'};
  
  &:hover { 
    background: ${props => props.$inCart ? '#F3EFE6' : '#40301B'}; 
    border-color: ${props => props.$inCart ? '#EAE3D6' : '#40301B'}; 
  }
  
  svg {
    font-size: 1.05rem;
  }
`;

const BuyNowButton = styled(motion.button)`
  border: 1px solid #D8CFBE;
  border-radius: 12px;
  padding: 12px;
  background: #FFFFFF;
  color: #2A1F10;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover { 
    background: #FAF7F2; 
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 20px;
`;

const PageBtn = styled(motion.button)`
  background: #FFFFFF;
  border: 1px solid #D8CFBE;
  padding: 12px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #2A1F10;

  &:hover:not(:disabled) {
    background: #2A1F10;
    color: #FFFFFF;
    border-color: #2A1F10;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.div`
  font-weight: 500;
  color: #6B5C4A;
  font-size: 0.95rem;
  span { color: #2A1F10; font-weight: 700; }
`;

export default ProductPage;