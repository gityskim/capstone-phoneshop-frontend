// src/services/commentService.js
// 댓글(Q&A) API 통신 서비스

import { API_BASE_URL } from '../config/api';

class CommentService {
  // 특정 휴대폰의 댓글 목록 조회
  async getPhoneComments(phoneId) {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/phones/${phoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('댓글 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);
      throw error;
    }
  }

  // 댓글 작성
  async createComment(phoneId, content) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneId: phoneId,
          content: content,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '댓글 작성에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  }

  // 댓글 수정
  async updateComment(commentId, content) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '댓글 수정에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error;
    }
  }

  // 댓글 삭제
  async deleteComment(commentId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '댓글 삭제에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  }
}

const commentService = new CommentService();
export default commentService;