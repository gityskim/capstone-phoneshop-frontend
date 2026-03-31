import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/FindPassword.css';

function FindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('이메일을 입력하세요');
      return;
    }
    if (!name) {
      setError('이름을 입력하세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      const response = await authService.resetPassword(email, name);
      
      // 임시 비밀번호 추출
      setTempPassword(response.replace('임시 비밀번호: ', ''));
      setStep(2);
    } catch (error) {
      console.error('비밀번호 찾기 실패:', error);
      setError(error.message || '비밀번호 찾기에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="find-password-page">
      <div className="find-password-container">
        <Link to="/login" className="back-button">← 로그인</Link>

        <div className="logo">
          <h1>🔑 비밀번호 찾기</h1>
          <p>가입 시 입력한 정보를 입력해주세요</p>
        </div>

        {step === 1 ? (
          // Step 1: 이메일과 이름 입력
          <div className="form-container">
            <form onSubmit={handleStep1Submit}>
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  disabled={loading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? '확인 중...' : '다음'}
              </button>
            </form>
          </div>
        ) : (
          // Step 2: 임시 비밀번호 표시
          <div className="result-container">
            <div className="success-icon">✅</div>
            <h3>임시 비밀번호가 발급되었습니다</h3>
            
            <div className="temp-password-box">
              <p className="temp-password-label">임시 비밀번호</p>
              <p className="temp-password">{tempPassword}</p>
            </div>

            <div className="info-box">
              <p>⚠️ 임시 비밀번호를 복사하여 로그인 후</p>
              <p>마이페이지에서 비밀번호를 변경해주세요</p>
            </div>

            <button onClick={handleGoToLogin} className="login-button">
              로그인하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindPassword;