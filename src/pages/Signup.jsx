import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
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

    // 유효성 검사
    if (!formData.name) {
      setError('이름을 입력하세요');
      return;
    }
    if (formData.name.length < 2) {
      setError('이름은 2자 이상이어야 합니다');
      return;
    }
    if (!formData.email) {
      setError('이메일을 입력하세요');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다');
      return;
    }
    if (!formData.password) {
      setError('비밀번호를 입력하세요');
      return;
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      const response = await authService.signup(
        formData.email,
        formData.password,
        formData.name
      );
      
      alert(response || '회원가입 성공!');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError(error.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="logo">
          <h1>📱 Phone Shop</h1>
          <p>새로운 계정을 만들어보세요</p>
        </div>

        <div className="signup-form-container">
          <h2>회원가입</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                disabled={loading}
              />
            </div>

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
                placeholder="6자 이상 입력"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          <div className="form-footer">
            <p>이미 계정이 있으신가요?</p>
            <Link to="/login" className="login-link">
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;