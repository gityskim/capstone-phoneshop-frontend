import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import EditProfile from './pages/EditProfile';
import DeleteAccount from './pages/DeleteAccount';
import FindPassword from './pages/FindPassword';
import PhoneList from './pages/PhoneList';
import PhoneDetail from './pages/PhoneDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderComplete from './pages/OrderComplete';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import AdminPhoneCreate from './pages/AdminPhoneCreate';
import AdminPage from './pages/AdminPage';
import CouponPage from './pages/CouponPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/phones" element={<PhoneList />} />
        <Route path="/phones/:phoneId" element={<PhoneDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-complete/:orderId" element={<OrderComplete />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin/phones/new" element={<AdminPhoneCreate />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/my-coupons" element={<CouponPage />} />
      </Routes>
    </Router>
  );
}

export default App;