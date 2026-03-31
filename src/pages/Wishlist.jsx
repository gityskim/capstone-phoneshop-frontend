import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import favoriteService from '../services/favoriteService';
import '../styles/Wishlist.css';

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistPhones, setWishlistPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 로그인 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    loadWishlist();
  }, [navigate]);

  // 백엔드에서 찜 목록 가져오기
  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      
      const favorites = await favoriteService.getMyFavorites();
      setWishlistPhones(favorites);
      
      // 로컬 스토리지 동기화
      favoriteService.syncLocalWishlist(favorites);
    } catch (error) {
      console.error('찜 목록 로드 실패:', error);
      setError('찜 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 찜 삭제
  const removeFromWishlist = async (phoneId) => {
    try {
      await favoriteService.deleteFavorite(phoneId);
      
      // UI 즉시 업데이트
      setWishlistPhones(prev => prev.filter(phone => phone.phoneId !== phoneId));
      favoriteService.removeFromLocalWishlist(phoneId);
      
      alert('찜 목록에서 삭제되었습니다');
    } catch (error) {
      console.error('찜 삭제 실패:', error);
      alert(error.message || '찜 삭제에 실패했습니다');
    }
  };

  // 장바구니 추가
  const addToCart = (phone) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.phoneId === phone.phoneId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        phoneId: phone.phoneId,
        name: phone.name,
        brand: phone.brand,
        unitPrice: phone.price,
        quantity: 1,
        image: phone.imageUrl
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('장바구니에 추가되었습니다!');
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="wishlist-page">
        <header className="wishlist-header">
          <div className="header-content">
            <Link to="/" className="back-button">← 홈</Link>
            <h1>❤️ 찜</h1>
            <div></div>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="wishlist-page">
        <header className="wishlist-header">
          <div className="header-content">
            <Link to="/" className="back-button">← 홈</Link>
            <h1>❤️ 찜</h1>
            <div></div>
          </div>
        </header>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadWishlist} className="retry-button">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* 헤더 */}
      <header className="wishlist-header">
        <div className="header-content">
          <Link to="/" className="back-button">← 홈</Link>
          <h1>❤️ 찜</h1>
          <div></div>
        </div>
      </header>

      <main className="wishlist-content">
        {wishlistPhones.length === 0 ? (
          // 빈 상태
          <div className="empty-wishlist">
            <div className="empty-icon">💔</div>
            <h2>찜한 상품이 없습니다</h2>
            <p>마음에 드는 휴대폰을 찜해보세요!</p>
            <Link to="/phones" className="shop-button">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          // 찜 목록
          <div className="wishlist-grid">
            {wishlistPhones.map((phone) => (
              <div key={phone.phoneId} className="wishlist-card">
                {/* 이미지 */}
                <Link to={`/phones/${phone.phoneId}`} className="phone-image">
                  <img 
                    src={phone.imageUrl || `https://via.placeholder.com/300x300?text=${phone.name}`} 
                    alt={phone.name}
                  />
                </Link>

                {/* 정보 */}
                <div className="phone-info">
                  <div className="brand-badge">{phone.brand}</div>
                  <Link to={`/phones/${phone.phoneId}`}>
                    <h3 className="phone-name">{phone.name}</h3>
                  </Link>
                  <p className="phone-price">{formatPrice(phone.price)}</p>

                  {/* 버튼 */}
                  <div className="card-actions">
                    <button 
                      onClick={() => addToCart(phone)} 
                      className="cart-button"
                    >
                      🛒 장바구니
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(phone.phoneId)} 
                      className="remove-button"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;