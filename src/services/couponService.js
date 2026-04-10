// src/services/couponService.js
// 쿠폰 API 통신 서비스

import API_BASE_URL from '../config/api';

class CouponService {
  // 내 쿠폰 목록 조회
  async getMyCoupons() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/users/coupons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('쿠폰 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getMyCoupons 에러:', error);
      throw error;
    }
  }

  // 쿠폰 등록 (쿠폰 코드로 등록)
  async registerCoupon(couponCode) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/coupons/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ couponCode }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '쿠폰 등록에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('registerCoupon 에러:', error);
      throw error;
    }
  }

  // 사용 가능한 쿠폰 조회 (결제 시)
  async getAvailableCoupons(orderAmount) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(
        `${API_BASE_URL}/coupons/available?orderAmount=${orderAmount}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('사용 가능한 쿠폰 조회에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getAvailableCoupons 에러:', error);
      throw error;
    }
  }

  // 쿠폰 사용 (주문 시)
  async useCoupon(couponId, orderId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/coupons/${couponId}/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error('쿠폰 사용에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('useCoupon 에러:', error);
      throw error;
    }
  }

  // 쿠폰 상세 조회
  async getCouponById(couponId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('쿠폰 정보를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getCouponById 에러:', error);
      throw error;
    }
  }

  // 관리자: 쿠폰 생성
  async createCoupon(couponData) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/admin/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '쿠폰 생성에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('createCoupon 에러:', error);
      throw error;
    }
  }

  // 관리자: 쿠폰 발급 (특정 사용자에게)
  async issueCoupon(couponCode, userId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/admin/coupons/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ couponCode, userId }),
      });

      if (!response.ok) {
        throw new Error('쿠폰 발급에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('issueCoupon 에러:', error);
      throw error;
    }
  }

  // 쿠폰 할인 금액 계산
  calculateDiscount(coupon, orderAmount) {
    // 최소 주문 금액 확인
    if (orderAmount < coupon.minOrderAmount) {
      return 0;
    }

    // 정액 할인
    if (coupon.discountAmount) {
      return Math.min(coupon.discountAmount, orderAmount);
    }

    // 정률 할인
    if (coupon.discountRate) {
      const discount = Math.floor(orderAmount * (coupon.discountRate / 100));
      
      // 최대 할인 금액 제한이 있다면
      if (coupon.maxDiscountAmount) {
        return Math.min(discount, coupon.maxDiscountAmount);
      }
      
      return discount;
    }

    return 0;
  }

  // 쿠폰 사용 가능 여부 확인
  canUseCoupon(coupon, orderAmount) {
    // 사용 완료 체크
    if (coupon.isUsed) {
      return { canUse: false, reason: '이미 사용한 쿠폰입니다' };
    }

    // 만료 체크
    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (expiryDate < today) {
      return { canUse: false, reason: '만료된 쿠폰입니다' };
    }

    // 최소 주문 금액 체크
    if (orderAmount < coupon.minOrderAmount) {
      return { 
        canUse: false, 
        reason: `${coupon.minOrderAmount.toLocaleString()}원 이상 구매 시 사용 가능합니다` 
      };
    }

    return { canUse: true };
  }
}

const couponService = new CouponService();
export default couponService;