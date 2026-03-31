import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/DeleteAccount.css';

function DeleteAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmText: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn !== 'true' || !userEmail) {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    setFormData(prev => ({
      ...prev,
      email: userEmail
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name) {
      setError('이름을 입력하세요');
      return;
    }
    if (!formData.password) {
      setError('비밀번호를 입력하세요');
      return;
    }
    if (formData.confirmText !== '회원탈퇴') {
      setError('"회원탈퇴"를 정확히 입력하세요');
      return;
    }
    if (!agreed) {
      setError('탈퇴 동의에 체크해주세요');
      return;
    }

    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      const response = await authService.withdraw(
        formData.email,
        formData.name,
        formData.password
      );
      
      alert(response || '회원탈퇴가 완료되었습니다');
      navigate('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      setError(error.message || '회원탈퇴에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account-page">
      <div className="delete-account-container">
        <Link to="/mypage" className="back-button">← 마이페이지</Link>

        <div className="header">
          <h1>⚠️ 회원탈퇴</h1>
          <p>회원탈퇴 전에 아래 내용을 꼭 확인해주세요</p>
        </div>

        <div className="warning-box">
          <h3>📌 탈퇴 시 삭제되는 정보</h3>
          <ul>
            <li>회원 정보 (이메일, 이름 등)</li>
            <li>구매 내역</li>
            <li>적립금 및 쿠폰</li>
            <li>장바구니 및 관심 상품</li>
          </ul>
          <p className="warning-text">⚠️ 탈퇴 후에는 복구가 불가능합니다</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>이메일 (확인용)</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름 입력"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>확인 문구 입력</label>
              <input
                type="text"
                name="confirmText"
                value={formData.confirmText}
                onChange={handleChange}
                placeholder="'회원탈퇴' 입력"
                disabled={loading}
              />
              <small>정확히 "회원탈퇴"를 입력해주세요</small>
            </div>

            <div className="agreement">
              <label>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={loading}
                />
                <span>위 내용을 모두 확인했으며, 회원탈퇴에 동의합니다</span>
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="delete-button" disabled={loading}>
              {loading ? '처리 중...' : '회원탈퇴'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;