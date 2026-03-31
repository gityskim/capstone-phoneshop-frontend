import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 로그인 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (isLoggedIn !== 'true' || !userEmail) {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    // 사용자 정보 설정
    setUserInfo({
      email: userEmail,
      role: role || 'USER',
      roleText: role === 'ADMIN' ? '관리자' : '일반 회원'
    });
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    alert('로그아웃 되었습니다');
    navigate('/');
  };

  if (!userInfo) {
    return (
      <div className="mypage-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mypage-page">
      {/* 헤더 */}
      <header className="mypage-header">
        <div className="header-content">
          <Link to="/" className="back-button">← 홈으로</Link>
          <h1>마이페이지</h1>
          <div></div>
        </div>
      </header>

      <main className="mypage-content">
        {/* 사용자 정보 카드 */}
        <section className="profile-card">
          <div className="profile-icon">
            {userInfo.role === 'ADMIN' ? '👑' : '👤'}
          </div>
          <h2>{userInfo.email}</h2>
          <p className="role-badge">{userInfo.roleText}</p>
        </section>

        {/* 상세 정보 */}
        <section className="info-section">
          <h3>📋 회원 정보</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">이메일</span>
              <span className="value">{userInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="label">회원 등급</span>
              <span className="value">{userInfo.roleText}</span>
            </div>
          </div>
        </section>

        {/* 쇼핑 메뉴 */}
        <section className="menu-section">
          <h3 className="section-title">🛍️ 쇼핑</h3>
          
          <Link to="/order-history" className="menu-button">
            <div className="menu-left">
              <span className="icon">📦</span>
              <span>주문 내역</span>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/wishlist" className="menu-button">
            <div className="menu-left">
              <span className="icon">💗</span>
              <span>찜한 상품</span>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/my-coupons" className="menu-button">
            <div className="menu-left">
              <span className="icon">🎫</span>
              <span>내 쿠폰</span>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/my-reviews" className="menu-button">
            <div className="menu-left">
              <span className="icon">⭐</span>
              <span>내가 쓴 리뷰</span>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/my-comments" className="menu-button">
            <div className="menu-left">
              <span className="icon">💬</span>
              <span>내 문의 내역</span>
            </div>
            <span className="arrow">→</span>
          </Link>
        </section>

        {/* 설정 메뉴 */}
        <section className="menu-section">
          <h3 className="section-title">⚙️ 설정</h3>

          <Link to="/edit-profile" className="menu-button">
            <div className="menu-left">
              <span className="icon">✏️</span>
              <span>회원정보 수정</span>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/find-password" className="menu-button">
            <div className="menu-left">
              <span className="icon">🔑</span>
              <span>비밀번호 변경</span>
            </div>
            <span className="arrow">→</span>
          </Link>

          <button onClick={handleLogout} className="menu-button logout">
            <div className="menu-left">
              <span className="icon">🚪</span>
              <span>로그아웃</span>
            </div>
            <span className="arrow">→</span>
          </button>

          <Link to="/delete-account" className="menu-button danger">
            <div className="menu-left">
              <span className="icon">⚠️</span>
              <span>회원탈퇴</span>
            </div>
            <span className="arrow">→</span>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default MyPage;