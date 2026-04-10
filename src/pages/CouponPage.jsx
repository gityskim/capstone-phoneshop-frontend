import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import couponService from '../services/couponService';
import '../styles/CouponPage.css';

function CouponPage() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    loadCoupons();
  }, [navigate]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      
      // 백엔드 API 호출
      const response = await couponService.getMyCoupons();
      
      // 백엔드 응답을 그대로 사용
      const formattedCoupons = response.map(item => ({
        id: item.userCouponId,
        name: item.couponName,
        discountRate: item.discountRate
      }));
      
      setCoupons(formattedCoupons);
    } catch (error) {
      console.error('쿠폰 로드 실패:', error);
      alert('쿠폰 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="coupon-page">
        <header className="coupon-header">
          <div className="header-content">
            <Link to="/mypage" className="back-button">← 뒤로</Link>
            <h1>내 쿠폰</h1>
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
    <div className="coupon-page">
      <header className="coupon-header">
        <div className="header-content">
          <Link to="/mypage" className="back-button">← 뒤로</Link>
          <h1>내 쿠폰</h1>
          <div></div>
        </div>
      </header>

      <main className="coupon-content">
        {/* 보유 쿠폰 개수 */}
        <section className="coupon-count-section">
          <div className="count-card">
            <p className="count-label">보유 쿠폰</p>
            <p className="count-number">{coupons.length}개</p>
          </div>
        </section>

        {/* 쿠폰 목록 */}
        {coupons.length > 0 ? (
          <section className="coupon-list-section">
            <h2 className="section-title">🎫 내 쿠폰 목록</h2>
            <div className="coupon-list">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="coupon-card">
                  <div className="coupon-discount">{coupon.discountRate}%</div>
                  <h3 className="coupon-name">{coupon.name}</h3>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <p className="empty-text">보유한 쿠폰이 없습니다</p>
            <Link to="/phones" className="shop-button">
              쇼핑하러 가기
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default CouponPage;