import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import authService from '../services/authService';
import '../styles/AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState(0);
  const [couponName, setCouponName] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // 관리자 권한 확인
    const isAdmin = authService.isAdmin();
    if (!isAdmin) {
      alert('관리자만 접근 가능합니다');
      navigate('/');
      return;
    }

    loadTotalSales();
  }, [navigate]);

  const loadTotalSales = async () => {
    try {
      setLoading(true);
      const sales = await adminService.getTotalSales();
      setTotalSales(sales);
    } catch (error) {
      console.error('총 매출 로드 실패:', error);
      alert('총 매출을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    if (!couponName.trim()) {
      alert('쿠폰 이름을 입력해주세요');
      return;
    }

    const rate = parseInt(discountRate);
    if (isNaN(rate) || rate < 1 || rate > 100) {
      alert('할인율은 1~100 사이의 숫자여야 합니다');
      return;
    }

    try {
      setCreating(true);
      await adminService.createCoupon({
        name: couponName,
        discountRate: rate
      });
      
      alert(`쿠폰 "${couponName}" (${rate}% 할인)이 생성되었습니다!`);
      
      // 폼 초기화
      setCouponName('');
      setDiscountRate('');
    } catch (error) {
      console.error('쿠폰 생성 실패:', error);
      alert(error.message || '쿠폰 생성에 실패했습니다');
    } finally {
      setCreating(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* 헤더 */}
      <header className="admin-header">
        <div className="header-content">
          <button onClick={() => navigate('/')} className="back-button">
            ← 홈으로
          </button>
          <h1>⚙️ 관리자 페이지</h1>
          <div></div>
        </div>
      </header>

      <main className="admin-content">
        {/* 총 매출 */}
        <section className="sales-section">
          <div className="section-header">
            <h2>💰 총 매출</h2>
            <button onClick={loadTotalSales} className="refresh-button">
              🔄 새로고침
            </button>
          </div>
          <div className="sales-display">
            <div className="sales-icon">📊</div>
            <div className="sales-amount">{formatPrice(totalSales)}</div>
            <p className="sales-label">총 결제 완료 금액</p>
          </div>
        </section>

        {/* 쿠폰 생성 */}
        <section className="coupon-section">
          <div className="section-header">
            <h2>🎫 쿠폰 생성</h2>
          </div>
          <form onSubmit={handleCreateCoupon} className="coupon-form">
            <div className="form-group">
              <label htmlFor="couponName">쿠폰 이름</label>
              <input
                type="text"
                id="couponName"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value)}
                placeholder="예: 신규회원 환영 쿠폰"
                disabled={creating}
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountRate">할인율 (%)</label>
              <input
                type="number"
                id="discountRate"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                placeholder="1~100"
                min="1"
                max="100"
                disabled={creating}
              />
            </div>

            <button 
              type="submit" 
              className="create-button"
              disabled={creating}
            >
              {creating ? '생성 중...' : '쿠폰 생성'}
            </button>
          </form>

          <div className="coupon-notice">
            <h4>📌 안내사항</h4>
            <ul>
              <li>생성된 쿠폰은 모든 사용자에게 자동으로 발급됩니다</li>
              <li>할인율은 1~100% 사이로 설정 가능합니다</li>
              <li>쿠폰은 주문 시 1회만 사용 가능합니다</li>
            </ul>
          </div>
        </section>

        {/* 빠른 액션 */}
        <section className="quick-actions">
          <h2>🚀 빠른 액션</h2>
          <div className="action-cards">
            <button 
              onClick={() => navigate('/admin/phones')} 
              className="action-card"
            >
              <div className="action-icon">📱</div>
              <h3>휴대폰 관리</h3>
              <p>휴대폰 등록 및 수정</p>
            </button>

            <button 
              onClick={() => navigate('/phones')} 
              className="action-card"
            >
              <div className="action-icon">🛍️</div>
              <h3>상품 목록</h3>
              <p>등록된 상품 보기</p>
            </button>

            <button 
              onClick={() => navigate('/order-history')} 
              className="action-card"
            >
              <div className="action-icon">📦</div>
              <h3>주문 내역</h3>
              <p>주문 확인하기</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;