// src/services/reviewService.js
// 리뷰 API 통신 서비스

import API_BASE_URL from '../config/api';

class ReviewService {
  // 리뷰 작성
  async addReview(phoneId, rating, content) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneId, rating, content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '리뷰 작성에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('addReview 에러:', error);
      throw error;
    }
  }

  // 평균 별점 조회
  async getAverageRating(phoneId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/phones/${phoneId}/average`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('평균 별점 조회에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getAverageRating 에러:', error);
      throw error;
    }
  }

  // 휴대폰별 리뷰 목록 조회
  async getPhoneReviews(phoneId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/phones/${phoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('리뷰 목록 조회에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getPhoneReviews 에러:', error);
      throw error;
    }
  }

  // 리뷰 삭제
  async deleteReview(reviewId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '리뷰 삭제에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('deleteReview 에러:', error);
      throw error;
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;