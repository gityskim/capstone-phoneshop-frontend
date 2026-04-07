// src/services/orderService.js
// 주문/결제 API 통신 서비스

import { API_BASE_URL } from '../config/api';

class OrderService {
  // 카카오페이 결제 준비
  async preparePayment(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/kakao-pay/ready`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '결제 준비에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('결제 준비 실패:', error);
      throw error;
    }
  }

  // 카카오페이 결제 승인
  async approvePayment(pgToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/kakao-pay/approve?pg_token=${pgToken}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '결제 승인에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('결제 승인 실패:', error);
      throw error;
    }
  }

  // 사용 가능한 쿠폰 조회
  async getMyCoupons() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/users/coupons`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('쿠폰 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
      throw error;
    }
  }

  // NEW: 내 주문 내역 조회
  async getMyOrders() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/orders/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('주문 내역을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
      throw error;
    }
  }
}

const orderService = new OrderService();
export default orderService;