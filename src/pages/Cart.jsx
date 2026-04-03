import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import API_BASE_URL from '../config/api';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 장바구니 데이터 로드
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    loadCart();
  }, [navigate]);

  useEffect(() => {
  // URL 파라미터에서 결제 상태 확인
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  
  if (status === 'cancelled') {
    alert('결제가 취소되었습니다');
    // URL 파라미터 제거
    window.history.replaceState({}, '', '/cart');
  } else if (status === 'failed') {
    alert('결제에 실패했습니다. 다시 시도해주세요');
    window.history.replaceState({}, '', '/cart');
  }
}, []);

  // 백엔드에서 장바구니 가져오기
  const loadCart = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await cartService.getMyCart();
      setCartItems(response.items || []);
      
      // 모든 아이템 선택
      setSelectedItems(response.items ? response.items.map((_, index) => index) : []);
      
      // 로컬 스토리지 동기화
      cartService.syncLocalCart(response.items || []);
    } catch (error) {
      console.error('장바구니 로드 실패:', error);
      setError('장바구니를 불러오는데 실패했습니다');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 수량 증가 (백엔드 API 호출)
  const increaseQuantity = async (phoneId) => {
    try {
      await cartService.addItem(phoneId);
      await loadCart(); // 새로고침
    } catch (error) {
      console.error('수량 증가 실패:', error);
      alert(error.message || '수량 증가에 실패했습니다');
    }
  };

  // 수량 감소 (백엔드 API 호출)
  const decreaseQuantity = async (phoneId, currentQuantity) => {
    try {
      if (currentQuantity === 1) {
        // 수량이 1이면 삭제 확인
        if (window.confirm('수량이 0이 되면 상품이 삭제됩니다. 계속하시겠습니까?')) {
          await cartService.decreaseItem(phoneId);
          await loadCart();
        }
      } else {
        await cartService.decreaseItem(phoneId);
        await loadCart();
      }
    } catch (error) {
      console.error('수량 감소 실패:', error);
      alert(error.message || '수량 감소에 실패했습니다');
    }
  };

  // 전체 삭제
  const clearCart = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다');
      return;
    }

    if (window.confirm('장바구니를 비우시겠습니까?')) {
      try {
        await cartService.clearCart();
        setCartItems([]);
        setSelectedItems([]);
        localStorage.setItem('cart', JSON.stringify([]));
      } catch (error) {
        console.error('장바구니 비우기 실패:', error);
        alert(error.message || '장바구니 비우기에 실패했습니다');
      }
    }
  };

  // 선택 아이템 삭제 (개별 삭제 API 여러 번 호출)
  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택하세요');
      return;
    }

    if (window.confirm(`선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`)) {
      try {
        // 선택된 아이템들의 phoneId 추출
        const selectedPhoneIds = selectedItems.map(index => cartItems[index].phoneId);
        
        // 각 phoneId에 대해 수량을 0으로 만들기 (반복 감소)
        for (const phoneId of selectedPhoneIds) {
          const item = cartItems.find(i => i.phoneId === phoneId);
          // 현재 수량만큼 감소 API 호출
          for (let i = 0; i < item.quantity; i++) {
            await cartService.decreaseItem(phoneId);
          }
        }
        
        // 새로고침
        await loadCart();
        setSelectedItems([]);
      } catch (error) {
        console.error('선택 삭제 실패:', error);
        alert(error.message || '선택 삭제에 실패했습니다');
      }
    }
  };

  // 선택 토글
  const toggleSelect = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((_, index) => index));
    }
  };

  // 선택된 아이템 총 금액
  const getTotalPrice = () => {
    return cartItems
      .filter((_, index) => selectedItems.includes(index))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // 선택된 아이템 개수
  const getSelectedCount = () => {
    return cartItems
      .filter((_, index) => selectedItems.includes(index))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // 주문하기
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택하세요');
      return;
    }

    // 선택된 상품만 localStorage에 저장 (결제 페이지용)
    const selectedCartItems = cartItems.filter((_, index) => selectedItems.includes(index));
    const cartForCheckout = selectedCartItems.map(item => ({
      phoneId: item.phoneId,
      name: item.name,
      brand: item.brand,
      unitPrice: item.price,
      quantity: item.quantity,
      image: item.imageUrl
    }));
    localStorage.setItem('checkoutCart', JSON.stringify(cartForCheckout));
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <div className="header-content">
            <Link to="/" className="back-button">← 홈</Link>
            <h1>🛒 장바구니</h1>
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
      <div className="cart-page">
        <header className="cart-header">
          <div className="header-content">
            <Link to="/" className="back-button">← 홈</Link>
            <h1>🛒 장바구니</h1>
            <div></div>
          </div>
        </header>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadCart} className="retry-button">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* 헤더 */}
      <header className="cart-header">
        <div className="header-content">
          <Link to="/" className="back-button">← 홈</Link>
          <h1>🛒 장바구니</h1>
          <div></div>
        </div>
      </header>

      <main className="cart-content">
        {cartItems.length === 0 ? (
          // 빈 장바구니
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>장바구니가 비어있습니다</h2>
            <p>마음에 드는 상품을 담아보세요!</p>
            <Link to="/phones" className="go-shopping-button">
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <>
            {/* 상단 액션 바 */}
            <div className="cart-actions">
              <div className="select-all">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedItems.length === cartItems.length}
                  onChange={toggleSelectAll}
                />
                <label htmlFor="select-all">
                  전체 선택 ({selectedItems.length}/{cartItems.length})
                </label>
              </div>
              <div className="action-buttons">
                <button onClick={removeSelectedItems} className="delete-selected-button">
                  선택 삭제
                </button>
                <button onClick={clearCart} className="clear-cart-button">
                  전체 삭제
                </button>
              </div>
            </div>

            {/* 장바구니 아이템 목록 */}
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={item.phoneId} className="cart-item">
                  <div className="item-select">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => toggleSelect(index)}
                    />
                  </div>

                  <div className="item-image">
                    <img
                      src={item.imageUrl ? (item.imageUrl.startsWith('http') ? encodeURI(item.imageUrl) : `${API_BASE_URL}${item.imageUrl}`) : `https://via.placeholder.com/150x150?text=${item.name}`}
                      alt={item.name}
                    />
                  </div>

                  <div className="item-info">
                    <div className="brand-badge">{item.brand}</div>
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">{formatPrice(item.price)}</p>
                  </div>

                  <div className="item-quantity">
                    <button 
                      onClick={() => decreaseQuantity(item.phoneId, item.quantity)}
                      className="qty-button"
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQuantity(item.phoneId)}
                      className="qty-button"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <p className="total-label">합계</p>
                    <p className="total-price">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="item-actions">
                    <button 
                      onClick={() => decreaseQuantity(item.phoneId, item.quantity)}
                      className="remove-button"
                      title="삭제"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 주문 요약 */}
            <div className="order-summary">
              <div className="summary-box">
                <h3>주문 요약</h3>
                
                <div className="summary-row">
                  <span>선택 상품</span>
                  <span>{getSelectedCount()}개</span>
                </div>

                <div className="summary-row">
                  <span>상품 금액</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="summary-row">
                  <span>배송비</span>
                  <span className="free">무료</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>총 결제 금액</span>
                  <span className="total-amount">{formatPrice(getTotalPrice())}</span>
                </div>

                <button onClick={handleCheckout} className="checkout-button">
                  주문하기
                </button>

                <Link to="/phones" className="continue-shopping">
                  쇼핑 계속하기
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Cart;