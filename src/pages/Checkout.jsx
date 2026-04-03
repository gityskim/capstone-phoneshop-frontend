import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { API_BASE_URL } from '../config/api';
import '../styles/Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    const checkoutCart = JSON.parse(localStorage.getItem('checkoutCart') || '[]');
    
    if (checkoutCart.length === 0) {
      alert('주문할 상품이 없습니다');
      navigate('/cart');
      return;
    }

    setCartItems(checkoutCart);
    loadCoupons();
  }, [navigate]);

  // 이미지 URL 변환 함수
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return encodeURI(imageUrl);
    return `${API_BASE_URL}${imageUrl}`;
  };

  const loadCoupons = async () => {
    try {
      const couponList = await orderService.getMyCoupons();
      setCoupons(couponList);
    } catch (error) {
      console.error('쿠폰 로드 실패:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!selectedCouponId) return 0;
    
    const selectedCoupon = coupons.find(c => c.userCouponId === selectedCouponId);
    if (!selectedCoupon) return 0;
    
    const totalPrice = getTotalPrice();
    return Math.floor(totalPrice * selectedCoupon.discountRate / 100);
  };

  const getFinalPrice = () => {
    return getTotalPrice() - getDiscountAmount();
  };

  const handlePayment = async () => {
    if (paying) return;

    if (!userId) {
      alert('로그인 정보가 없습니다');
      navigate('/login');
      return;
    }

    try {
      setPaying(true);

      const orderData = {
        userId: parseInt(userId),
        items: cartItems.map(item => ({
          phoneId: item.phoneId,
          quantity: item.quantity
        })),
        userCouponId: selectedCouponId || null
      };

      const response = await orderService.preparePayment(orderData);

      if (response.next_redirect_pc_url) {
        window.location.href = response.next_redirect_pc_url;
      } else {
        throw new Error('결제 페이지 URL을 받지 못했습니다');
      }
    } catch (error) {
      console.error('결제 준비 실패:', error);
      alert(error.message || '결제 준비에 실패했습니다');
      setPaying(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <div className="header-content">
            <Link to="/cart" className="back-button">← 장바구니</Link>
            <h1>주문/결제</h1>
            <div></div>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="header-content">
          <Link to="/cart" className="back-button">← 장바구니</Link>
          <h1>주문/결제</h1>
          <div></div>
        </div>
      </header>

      <main className="checkout-content">
        <div className="checkout-container">
          <div className="checkout-left">
            <section className="checkout-section">
              <h3>📦 주문 상품</h3>
              <div className="order-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="checkout-item">
                    <img
                      src={getImageUrl(item.image) || `https://placehold.co/80x80/667eea/FFF?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = 'true';
                          e.target.src = `https://placehold.co/80x80/667eea/FFF?text=Image`;
                        }
                      }}
                    />
                    <div className="item-info">
                      <div className="item-brand">{item.brand}</div>
                      <h4>{item.name}</h4>
                      <p className="item-quantity">수량: {item.quantity}개</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="checkout-section">
              <h3>🎫 쿠폰 선택</h3>
              {coupons.length === 0 ? (
                <div className="no-coupons">
                  <p>사용 가능한 쿠폰이 없습니다</p>
                </div>
              ) : (
                <div className="coupon-list">
                  <div className="coupon-option">
                    <input
                      type="radio"
                      id="no-coupon"
                      name="coupon"
                      checked={selectedCouponId === null}
                      onChange={() => setSelectedCouponId(null)}
                    />
                    <label htmlFor="no-coupon">
                      <span className="coupon-name">쿠폰 사용 안 함</span>
                    </label>
                  </div>
                  {coupons.map(coupon => (
                    <div key={coupon.userCouponId} className="coupon-option">
                      <input
                        type="radio"
                        id={`coupon-${coupon.userCouponId}`}
                        name="coupon"
                        checked={selectedCouponId === coupon.userCouponId}
                        onChange={() => setSelectedCouponId(coupon.userCouponId)}
                      />
                      <label htmlFor={`coupon-${coupon.userCouponId}`}>
                        <span className="coupon-name">{coupon.couponName}</span>
                        <span className="coupon-discount">{coupon.discountRate}% 할인</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="checkout-right">
            <div className="payment-summary">
              <h3>💳 결제 정보</h3>
              
              <div className="summary-row">
                <span>상품 금액</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>

              {selectedCouponId && (
                <div className="summary-row discount">
                  <span>쿠폰 할인</span>
                  <span className="discount-amount">-{formatPrice(getDiscountAmount())}</span>
                </div>
              )}

              <div className="summary-row">
                <span>배송비</span>
                <span className="free">무료</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>최종 결제 금액</span>
                <span className="total-amount">{formatPrice(getFinalPrice())}</span>
              </div>

              <div className="payment-method-info">
                <p className="payment-label">결제 방법</p>
                <div className="kakao-pay-badge">
                  <img 
  src="/images/kakaopay_logo.png"
  alt="카카오페이"
  style={{width: '200px'}}
  onError={(e) => {
    // 이미지 로드 실패시 텍스트로 대체
    e.target.style.display = 'none';
    e.target.parentElement.innerHTML = '<span style="color: #FEE500; font-weight: bold; font-size: 18px;">카카오페이</span>';
  }}
/>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                className="payment-button"
                disabled={paying}
              >
                {paying ? '결제 준비 중...' : `${formatPrice(getFinalPrice())} 결제하기`}
              </button>

              <div className="payment-notice">
                <p>• 카카오페이로 안전하게 결제됩니다</p>
                <p>• 결제 완료 후 주문 내역에서 확인 가능합니다</p>
                <p>• 문의사항은 고객센터로 연락 주세요</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;