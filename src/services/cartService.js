// src/services/cartService.js
// 장바구니 API 통신 서비스

import API_BASE_URL from '../config/api';

class CartService {
  // 장바구니에 상품 추가 (+1)
  async addItem(phoneId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '장바구니 추가에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('addItem 에러:', error);
      throw error;
    }
  }

  // 장바구니 수량 감소 (-1)
  async decreaseItem(phoneId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/cart/items/decrease`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '수량 감소에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('decreaseItem 에러:', error);
      throw error;
    }
  }

  // 내 장바구니 조회
  async getMyCart() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // 장바구니가 없으면 빈 배열 반환
        if (response.status === 400) {
          return { items: [], totalPrice: 0 };
        }
        throw new Error('장바구니 조회에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getMyCart 에러:', error);
      throw error;
    }
  }

  // 장바구니 전체 삭제
  async clearCart() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '장바구니 비우기에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('clearCart 에러:', error);
      throw error;
    }
  }

  // 로컬 장바구니와 동기화 (필요 시)
  syncLocalCart(cartItems) {
    const cart = cartItems.map(item => ({
      phoneId: item.phoneId,
      name: item.name,
      brand: item.brand,
      unitPrice: item.price,
      quantity: item.quantity,
      image: item.imageUrl
    }));
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

const cartService = new CartService();
export default cartService;