import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (!formData.email) {
      setError('이메일을 입력하세요');
      return;
    }
    if (!formData.password) {
      setError('비밀번호를 입력하세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      await authService.login(formData.email, formData.password);
      
      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">
          <h1>📱 Phone Shop</h1>
          <p>휴대폰 쇼핑몰에 오신 것을 환영합니다</p>
        </div>

        <div className="login-form-container">
          <h2>로그인</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
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
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="form-links">
            <Link to="/find-password" className="find-password">
              비밀번호를 잊으셨나요?
            </Link>
            <Link to="/signup" className="signup-link">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;