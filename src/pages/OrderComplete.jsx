import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/OrderComplete.css';

function OrderComplete() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // useCallback으로 감싸서 ESLint 경고 제거
  const loadOrderInfo = useCallback(async () => {
    try {
      setLoading(true);
      
      // localStorage에서 최근 주문 정보 가져오기
      const lastOrder = localStorage.getItem('lastOrder');
      
      if (lastOrder) {
        const orderData = JSON.parse(lastOrder);
        
        // orderId 업데이트 (백엔드에서 받은 실제 orderId 사용)
        orderData.orderId = orderId;
        
        setOrder(orderData);
        
        // 사용 완료된 정보 삭제
        localStorage.removeItem('lastOrder');
        localStorage.removeItem('checkoutCart');
      } else {
        // 주문 정보가 없으면 기본값
        setOrder({
          orderId: orderId,
          orderDate: new Date().toISOString(),
          items: [],
          totalPrice: 0,
          finalPrice: 0,
          status: '결제 완료'
        });
      }
    } catch (error) {
      console.error('주문 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]); // orderId가 변경될 때만 함수 재생성

  useEffect(() => {
    // 로그인 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    // 주문 정보 로드
    loadOrderInfo();
  }, [navigate, loadOrderInfo]); // loadOrderInfo 의존성 추가

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <div className="order-complete-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-complete-page">
        <div className="error-container">
          <p>주문 정보를 찾을 수 없습니다</p>
          <Link to="/" className="home-button">홈으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-complete-page">
      {/* 헤더 */}
      <header className="complete-header">
        <div className="header-content">
          <Link to="/" className="back-button">← 홈</Link>
          <h1>주문 완료</h1>
          <div></div>
        </div>
      </header>

      <main className="complete-content">
        {/* 완료 메시지 */}
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>주문이 완료되었습니다!</h2>
          <p>주문번호: <strong>{order.orderId}</strong></p>
          <p className="order-date">{formatDate(order.orderDate)}</p>
        </div>

        {/* 주문 정보 */}
        {order.items && order.items.length > 0 && (
          <div className="order-info-container">
            {/* 주문 상품 */}
            <section className="info-section">
              <h3>📦 주문 상품</h3>
              <div className="order-items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.image || `https://placehold.co/100x100/667eea/FFF?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = 'true';
                          e.target.src = `https://placehold.co/100x100/667eea/FFF?text=Image`;
                        }
                      }}
                    />
                    <div className="item-info">
                      <p className="item-brand">{item.brand || '브랜드'}</p>
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-option">수량: {item.quantity}개</p>
                      <p className="item-price">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 결제 정보 */}
            <section className="info-section">
              <h3>💳 결제 정보</h3>
              <table className="info-table">
                <tbody>
                  <tr>
                    <th>결제 방법</th>
                    <td>카카오페이</td>
                  </tr>
                  <tr>
                    <th>상품 금액</th>
                    <td>{formatPrice(order.totalPrice)}</td>
                  </tr>
                  {order.discountAmount > 0 && (
                    <tr>
                      <th>쿠폰 할인</th>
                      <td className="discount">-{formatPrice(order.discountAmount)}</td>
                    </tr>
                  )}
                  <tr>
                    <th>배송비</th>
                    <td className="free">무료</td>
                  </tr>
                  <tr className="total-row">
                    <th>최종 결제 금액</th>
                    <td className="total-price">{formatPrice(order.finalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* 안내 사항 */}
        <div className="notice-box">
          <h4>📌 안내 사항</h4>
          <ul>
            <li>주문하신 상품은 영업일 기준 2-3일 이내에 배송됩니다.</li>
            <li>주문 내역은 마이페이지 &gt; 주문 내역에서 확인하실 수 있습니다.</li>
            <li>배송 조회는 배송이 시작된 후 가능합니다.</li>
            <li>문의사항은 고객센터(1588-0000)로 연락 주시기 바랍니다.</li>
          </ul>
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <Link to="/order-history" className="history-button">
            주문 내역 보기
          </Link>
          <Link to="/phones" className="shopping-button">
            쇼핑 계속하기
          </Link>
          <Link to="/" className="home-button">
            홈으로
          </Link>
        </div>
      </main>
    </div>
  );
}

export default OrderComplete;