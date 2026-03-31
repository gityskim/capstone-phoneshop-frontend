// src/services/favoriteService.js
// 찜(관심상품) API 통신 서비스

import API_BASE_URL from '../config/api';

class FavoriteService {
  // 찜 추가
  async addFavorite(phoneId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/favorites?phoneId=${phoneId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        // 중복 에러는 무시
        if (errorText.includes('이미') || errorText.includes('등록')) {
          return true; // 이미 찜한 상품이면 성공으로 처리
        }
        throw new Error(errorText || '찜 추가에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('addFavorite 에러:', error);
      throw error;
    }
  }

  // 내 찜 목록 조회
  async getMyFavorites() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('찜 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getMyFavorites 에러:', error);
      throw error;
    }
  }

  // 찜 삭제
  async deleteFavorite(phoneId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/favorites/${phoneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '찜 삭제에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('deleteFavorite 에러:', error);
      throw error;
    }
  }

  // 찜 여부 확인 (로컬 - 빠른 UI 업데이트용)
  isWishlisted(phoneId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.includes(String(phoneId));
  }

  // 로컬 찜 목록에 추가 (UI 즉시 반영용)
  addToLocalWishlist(phoneId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(String(phoneId))) {
      wishlist.push(String(phoneId));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }

  // 로컬 찜 목록에서 제거 (UI 즉시 반영용)
  removeFromLocalWishlist(phoneId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updated = wishlist.filter(id => id !== String(phoneId));
    localStorage.setItem('wishlist', JSON.stringify(updated));
  }

  // 로컬 찜 목록 동기화 (백엔드 데이터로)
  syncLocalWishlist(favorites) {
    const phoneIds = favorites.map(fav => String(fav.phoneId));
    localStorage.setItem('wishlist', JSON.stringify(phoneIds));
  }
}

const favoriteService = new FavoriteService();
export default favoriteService;