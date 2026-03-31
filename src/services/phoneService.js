// src/services/phoneService.js
// 휴대폰 API 통신 서비스

import API_BASE_URL from '../config/api';

class PhoneService {
  // 전체 휴대폰 목록 조회
  async getAllPhones() {
    try {
      const response = await fetch(`${API_BASE_URL}/phones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('휴대폰 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getAllPhones 에러:', error);
      throw error;
    }
  }

  // 특정 휴대폰 상세 조회
  async getPhoneById(phoneId) {
    try {
      const response = await fetch(`${API_BASE_URL}/phones/${phoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('휴대폰 정보를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('getPhoneById 에러:', error);
      throw error;
    }
  }

  // 관리자: 휴대폰 등록 (이미지 포함)
  async createPhone(phoneData, imageFile) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      // FormData 생성
      const formData = new FormData();
      
      // phone 데이터를 JSON 문자열로 변환하여 추가
      const phoneJson = JSON.stringify(phoneData);
      formData.append('phone', phoneJson);
      
      // 이미지 파일 추가
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/phones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Content-Type은 자동으로 multipart/form-data로 설정됨
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '휴대폰 등록에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('createPhone 에러:', error);
      throw error;
    }
  }

  // 검색 (프론트엔드에서 필터링)
  searchPhones(phones, keyword) {
    if (!keyword) return phones;
    
    const lowerKeyword = keyword.toLowerCase();
    return phones.filter(phone => 
      phone.name.toLowerCase().includes(lowerKeyword) ||
      phone.brand.toLowerCase().includes(lowerKeyword)
    );
  }

  // 정렬 (프론트엔드에서)
  sortPhones(phones, sortBy) {
    const sorted = [...phones];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }

  // 휴대폰 삭제 (관리자만)
  async deletePhone(phoneId) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/phones/${phoneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '휴대폰 삭제에 실패했습니다');
      }

      return true;
    } catch (error) {
      console.error('휴대폰 삭제 실패:', error);
      throw error;
    }
  }
}

const phoneService = new PhoneService();
export default phoneService;