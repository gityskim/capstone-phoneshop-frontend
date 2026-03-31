import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/EditProfile.css';

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
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
    if (!formData.name || formData.name.length < 2) {
      setError('이름은 2자 이상이어야 합니다');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      const response = await authService.updateUser(
        formData.email,
        formData.name,
        formData.password
      );
      
      alert(response || '회원정보가 수정되었습니다');
      navigate('/mypage');
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      setError(error.message || '회원정보 수정에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <Link to="/mypage" className="back-button">← 마이페이지</Link>

        <div className="header">
          <h1>✏️ 회원정보 수정</h1>
          <p>변경할 정보를 입력해주세요</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>기본 정보</h3>
              
              <div className="form-group">
                <label>이메일 (변경 불가)</label>
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
                  placeholder="변경할 이름 입력"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="새 비밀번호 (6자 이상)"
                  disabled={loading}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? '처리 중...' : '수정 완료'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;