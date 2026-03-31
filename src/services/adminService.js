// src/services/adminService.js
// 관리자 API 통신 서비스

import API_BASE_URL from '../config/api';

class AdminService {
  // 총 매출 조회
  async getTotalSales() {
    try {
      const token = localStorage.getItem('token');
      
      // 경로 수정: /admin/sales/total → /admin/totalSales
      const response = await fetch(`${API_BASE_URL}/admin/totalSales`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '총 매출 조회에 실패했습니다');
      }

      // 백엔드가 숫자만 반환하므로 직접 파싱
      const totalSales = await response.json();
      return totalSales || 0;
    } catch (error) {
      throw error;
    }
  }

  // 쿠폰 생성
  async createCoupon(couponData) {
    try {
      const token = localStorage.getItem('token');
      
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

      return await response.text();
    } catch (error) {
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;