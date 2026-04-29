import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from './components/pageComponent/Home';
import Product from './components/pageComponent/Product';
import MainLayout from './components/pageComponent/MainLayout';
import RegisterPage from './components/pageComponent/Register';
import LoginPage from './components/pageComponent/Login';
import ForgotPassword from './components/pageComponent/ForgotPassword';
import AdminPanel from './adminComponent/pageComponent/AdminPanel';
import Cart from './components/pageComponent/Cart';
import Checkout from './components/pageComponent/BuyNow';
import Contact from './components/pageComponent/ContactUs';
import Feedback from './components/pageComponent/Feedback';
import ResetPasswordConfirm from './components/pageComponent/ResetPasswordConfirm';
import NotFound from './components/pageComponent/NotFound';
const ProtectedRoutes = () => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return <Navigate to="/loginPage" replace />;
  }
  return <Outlet />;
};



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/logout" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />

        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<HomePage />} />
          <Route path="products" element={<Product />} />
          <Route path="contactUs" element={<Contact />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="cartPage" element={<Cart />} />
            <Route path="adminPanel" element={<AdminPanel />} />
            <Route path="buyPage" element={<Checkout />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;