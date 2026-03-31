import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // ========================================
  // 모바일 메뉴 상태 추가
  // ========================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    const adminStatus = authService.isAdmin();
    
    if (loggedIn === 'true' && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setIsAdmin(adminStatus);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserEmail('');
    setIsAdmin(false);
    setIsMobileMenuOpen(false); // 로그아웃 시 메뉴 닫기
  };

  // ========================================
  // 모바일 메뉴 토글 함수
  // ========================================
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // ========================================
  // 메뉴 클릭 시 모바일 메뉴 닫기
  // ========================================
  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span>📱</span>
            <h1>Phone Shop</h1>
          </div>
          
          {isLoggedIn ? (
            <>
              {/* ===== 데스크톱 메뉴 (768px 이상) ===== */}
              <div className="user-section desktop-menu">
                <Link to="/wishlist" className="wishlist-link">❤️ 찜</Link>
                <Link to="/cart" className="cart-link">🛒 장바구니</Link>
                <Link to="/mypage" className="mypage-link">👤 마이페이지</Link>
                {isAdmin && (
                  <Link to="/admin" className="admin-link">⚙️ 관리자 페이지</Link>
                )}
                <span className="user-email">{userEmail}</span>
                <button onClick={handleLogout} className="logout-btn">
                  로그아웃
                </button>
              </div>

              {/* ===== 모바일 햄버거 버튼 (768px 미만) ===== */}
              <button 
                className="mobile-menu-button"
                onClick={toggleMobileMenu}
                aria-label="메뉴 열기"
              >
                <div className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>

              {/* ===== 모바일 슬라이드 메뉴 ===== */}
              <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {/* 닫기 버튼 */}
                <button 
                  className="mobile-menu-close"
                  onClick={toggleMobileMenu}
                  aria-label="메뉴 닫기"
                >
                  ✕
                </button>

                {/* 사용자 정보 */}
                <div className="mobile-menu-user">
                  <div className="mobile-user-icon">👤</div>
                  <div className="mobile-user-email">{userEmail}</div>
                </div>

                {/* 메뉴 리스트 */}
                <nav className="mobile-menu-nav">
                  <Link 
                    to="/wishlist" 
                    className="mobile-menu-item"
                    onClick={handleMenuClick}
                  >
                    <span className="mobile-menu-icon">❤️</span>
                    찜
                  </Link>

                  <Link 
                    to="/cart" 
                    className="mobile-menu-item"
                    onClick={handleMenuClick}
                  >
                    <span className="mobile-menu-icon">🛒</span>
                    장바구니
                  </Link>

                  <Link 
                    to="/mypage" 
                    className="mobile-menu-item"
                    onClick={handleMenuClick}
                  >
                    <span className="mobile-menu-icon">👤</span>
                    마이페이지
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="mobile-menu-item admin-item"
                      onClick={handleMenuClick}
                    >
                      <span className="mobile-menu-icon">⚙️</span>
                      관리자 페이지
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="mobile-menu-item logout-item"
                  >
                    <span className="mobile-menu-icon">🚪</span>
                    로그아웃
                  </button>
                </nav>
              </div>

              {/* ===== 오버레이 (메뉴 열렸을 때 배경) ===== */}
              {isMobileMenuOpen && (
                <div 
                  className="mobile-menu-overlay"
                  onClick={toggleMobileMenu}
                ></div>
              )}
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">로그인</Link>
              <Link to="/signup" className="signup-btn">회원가입</Link>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <h2>{isLoggedIn ? '환영합니다! 🎉' : '휴대폰 쇼핑몰에 오신 것을 환영합니다!'}</h2>
          <p>{isLoggedIn ? '최신 휴대폰을 둘러보세요' : '로그인하여 다양한 혜택을 받아보세요'}</p>
          <Link to="/phones" className="view-phones-button">📱 휴대폰 둘러보기</Link>
        </section>

        {isLoggedIn ? (
          <section className="status-section">
            <h3>✅ 로그인 상태</h3>
            <ul>
              <li>📧 이메일: <strong>{userEmail}</strong></li>
              <li>🔐 로그인 완료</li>
              {isAdmin && <li>⚙️ 관리자 권한</li>}
              <li>⏰ {new Date().toLocaleString('ko-KR')}</li>
            </ul>
          </section>
        ) : (
          <section className="auth-cards">
            <div className="auth-card">
              <div className="card-icon">🔐</div>
              <h3>로그인</h3>
              <p>이미 계정이 있으신가요?<br />로그인하여 서비스를 이용하세요</p>
              <Link to="/login" className="card-button">로그인하기 →</Link>
            </div>

            <div className="auth-card">
              <div className="card-icon">✨</div>
              <h3>회원가입</h3>
              <p>새로운 회원이신가요?<br />지금 가입하고 다양한 혜택을 받으세요</p>
              <Link to="/signup" className="card-button">회원가입하기 →</Link>
            </div>
          </section>
        )}

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>최신 휴대폰</h4>
            <p>다양한 브랜드의 최신 스마트폰</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h4>합리적인 가격</h4>
            <p>최저가 보장 및 할인 혜택</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h4>빠른 배송</h4>
            <p>당일 배송 및 무료 배송</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Phone Shop. 컴퓨터공학과 졸업작품.</p>
      </footer>
    </div>
  );
}

export default Home;