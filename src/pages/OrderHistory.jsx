import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { API_BASE_URL } from '../config/api';
import '../styles/OrderHistory.css';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const orderList = await orderService.getMyOrders();
      setOrders(orderList);
    } catch (error) {
      console.error('주문 내역 로드 실패:', error);
      setError('주문 내역을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 URL 변환 함수
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // 이미 http로 시작하면 그대로 반환
    if (imageUrl.startsWith('http')) return imageUrl;
    // 상대 경로면 백엔드 URL 붙이기
    return `${API_BASE_URL}${imageUrl}`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'CREATED': '주문 생성',
      'PAID': '결제 완료',
      'CANCELLED': '주문 취소'
    };
    return statusMap[status] || status;
  };

  const handleOrderClick = (order) => {
    if (selectedOrder && selectedOrder.orderId === order.orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(order);
    }
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <header className="history-header">
          <div className="header-content">
            <Link to="/mypage" className="back-button">← 마이페이지</Link>
            <h1>주문 내역</h1>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-page">
        <header className="history-header">
          <div className="header-content">
            <Link to="/mypage" className="back-button">← 마이페이지</Link>
            <h1>주문 내역</h1>
          </div>
        </header>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadOrders} className="retry-button">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <header className="history-header">
        <div className="header-content">
          <Link to="/mypage" className="back-button">← 마이페이지</Link>
          <h1>주문 내역</h1>
        </div>
      </header>

      <main className="history-content">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>주문 내역이 없습니다</h2>
            <p>첫 주문을 시작해보세요!</p>
            <Link to="/phones" className="go-shopping-button">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <>
            <div className="orders-summary">
              <h3>총 {orders.length}건의 주문</h3>
            </div>

            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div 
                    className="order-header"
                    onClick={() => handleOrderClick(order)}
                  >
                    <div className="order-header-left">
                      <h4>주문번호: {order.orderId}</h4>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-header-right">
                      <span className="status-badge">{getStatusText(order.status)}</span>
                      <button className="expand-button">
                        {selectedOrder?.orderId === order.orderId ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="preview-item">
                        <img
                          src={getImageUrl(item.imageUrl) || `https://placehold.co/80x80/667eea/FFF?text=${encodeURIComponent(item.phoneName)}`}
                          alt={item.phoneName}
                          onError={(e) => {
                            if (!e.target.dataset.fallback) {
                              e.target.dataset.fallback = 'true';
                              e.target.src = `https://placehold.co/80x80/667eea/FFF?text=Image`;
                            }
                          }}
                        />
                        <div className="preview-info">
                          <p className="preview-name">{item.phoneName}</p>
                          <p className="preview-option">{item.brand} / {item.quantity}개</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="more-items">외 {order.items.length - 2}개 상품</p>
                    )}
                  </div>

                  <div className="order-price">
                    <span>총 결제 금액</span>
                    <span className="price">{formatPrice(order.finalPrice)}</span>
                  </div>

                  {selectedOrder?.orderId === order.orderId && (
                    <div className="order-details">
                      <div className="details-section">
                        <h4>📦 주문 상품</h4>
                        <div className="details-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="details-item">
                              <img
                                src={getImageUrl(item.imageUrl) || `https://placehold.co/60x60/667eea/FFF?text=${encodeURIComponent(item.phoneName)}`}
                                alt={item.phoneName}
                                onError={(e) => {
                                  if (!e.target.dataset.fallback) {
                                    e.target.dataset.fallback = 'true';
                                    e.target.src = `https://placehold.co/60x60/667eea/FFF?text=Image`;
                                  }
                                }}
                              />
                              <div className="details-item-info">
                                <p className="details-brand">{item.brand}</p>
                                <p className="details-name">{item.phoneName}</p>
                                <p className="details-option">{item.quantity}개</p>
                              </div>
                              <div className="details-item-price">
                                {formatPrice(item.totalPrice)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="details-section">
                        <h4>💳 결제 정보</h4>
                        <table className="details-table">
                          <tbody>
                            <tr>
                              <th>결제 방법</th>
                              <td>카카오페이</td>
                            </tr>
                            <tr>
                              <th>주문 일시</th>
                              <td>{formatDate(order.createdAt)}</td>
                            </tr>
                            {order.paidAt && (
                              <tr>
                                <th>결제 일시</th>
                                <td>{formatDate(order.paidAt)}</td>
                              </tr>
                            )}
                            <tr>
                              <th>배송비</th>
                              <td className="free">무료</td>
                            </tr>
                            <tr className="total-row">
                              <th>총 결제 금액</th>
                              <td className="total">{formatPrice(order.finalPrice)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default OrderHistory;