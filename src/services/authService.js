// src/services/authService.js
// 백엔드 API 통신 서비스

import API_BASE_URL from '../config/api';

class AuthService {
  // JWT 토큰에서 Payload 디코딩
  decodeToken(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
      return null;
    }
  }

  // 회원가입
  async signup(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원가입에 실패했습니다');
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  // 로그인
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '로그인에 실패했습니다');
      }

      const data = await response.json();
      
      // JWT 토큰 저장
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // JWT 토큰 디코딩해서 userId, role 추출
      const tokenData = this.decodeToken(data.token);
      
      if (tokenData) {
        console.log('디코딩된 토큰:', tokenData);
        
        const userId = tokenData.userId || tokenData.sub || tokenData.user_id || tokenData.id;
        const role = tokenData.role || tokenData.authorities || 'USER';
        
        if (userId) {
          localStorage.setItem('userId', userId.toString());
        }
        
        if (role) {
          const roleString = Array.isArray(role) ? role[0].replace('ROLE_', '') : role;
          localStorage.setItem('role', roleString);
        }
        
        console.log('저장된 정보:', {
          userId: userId,
          role: role
        });
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // 로그아웃
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
  }

  // 비밀번호 찾기 (초기화)
  async resetPassword(email, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '비밀번호 찾기에 실패했습니다');
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  // 회원정보 수정
  async updateUser(email, name, password) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원정보 수정에 실패했습니다');
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  // 회원탈퇴
  async withdraw(email, name, password) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/users/withdraw`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원탈퇴에 실패했습니다');
      }

      this.logout();

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  // 토큰 확인
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // 관리자 여부 확인
  isAdmin() {
    return localStorage.getItem('role') === 'ADMIN';
  }

  // 현재 사용자 이메일
  getCurrentUserEmail() {
    return localStorage.getItem('userEmail');
  }
}

//  ESLint 경고 해결: 변수에 먼저 할당
const authService = new AuthService();
export default authService;