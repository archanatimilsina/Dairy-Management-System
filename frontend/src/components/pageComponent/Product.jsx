import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../elementComponent/Navbar';
import FooterSection from '../elementComponent/Footer';
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
const ProductPage = () => {
  const {get, post} = useApi()
const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState("All");
const [products, setProducts] = useState([])
const [cartItems, setCartItems] = useState([])

useEffect(()=>
{
 const fetchProducts =async ()=>
{
const result = await get('product/listCreate/')
if(result.success)
{
setProducts(result.data)
}
}
const fetchCartItems = async ()=>
{
const result = await get('product/cart/listCreate/')
if(result.success)
{
  setCartItems(result.data)
}
}
fetchProducts()
fetchCartItems()
},[get])


const isProductInCart = (productId)=>
{
return cartItems.some(item=> item.product === productId)
}


const addToCart = async (productID)=>
{
  if(!localStorage.getItem("IsLoggedIn")){
navigate('/loginPage')
  }
const result = await post('product/cart/listCreate/',{
  product: productID
 })
if(result.success)
{
  console.log(result.data)
  setCartItems([...cartItems,result.data])
  console.log(cartItems)
}
}



  const categories = ["All", "Milk", "Paneer", "Cheese", "Nauni", "Ghee", "Cake"];
  
  const filteredProducts = activeFilter === "All" 
    ? products 
    : products.filter(p => p.category === activeFilter);

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
                $active={activeFilter === cat}
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
                  <img src={product.picture_src} alt={product.product_name} />
                  <span className="tag">{product.category}</span>
                </div>
                <div className="details">
                  <div className="header-info">
                    <h4>{product.product_name}</h4>
                    <span className="unit">/{product.unit}</span>
                  </div>
                  <div className="price-row">
                    <span className="price">Rs. {product.price}</span>
                  </div>

                  <ActionArea>
                    <button className="sub-btn">
                      <span className="icon">Regular Order</span> 
                    </button>
                    <div className="buy-row">
                      <button className="cart-btn" onClick={()=>{addToCart(product.id)}} disabled={isProductInCart(product.id)}>{isProductInCart(product.id)? "In cart": "Add to Cart"}</button>
                      <button className="buy-btn">Buy Now</button>
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