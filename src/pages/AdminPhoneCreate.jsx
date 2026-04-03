import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import '../styles/AdminPhoneCreate.css';

function AdminPhoneCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '삼성',
    price: '',
    display: '',
    processor: '',
    ram: '',
    storage: '',
    battery: '',
    camera: ''
  });
  
  const [imageFile, setImageFile] = useState(null);

  // 권한 체크
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      alert('관리자만 접근할 수 있습니다');
      navigate('/phones');
    }
  }, [navigate]);

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('휴대폰 이름을 입력해주세요');
      return;
    }

    if (!formData.price || parseInt(formData.price) <= 0) {
      alert('올바른 가격을 입력해주세요');
      return;
    }

    if (!imageFile) {
      alert('이미지를 선택해주세요');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      
      // FormData 생성
      const submitData = new FormData();
      
      // 휴대폰 정보 JSON
      const phoneData = {
        name: formData.name,
        brand: formData.brand,
        price: parseInt(formData.price),
        display: formData.display || null,
        processor: formData.processor || null,
        ram: formData.ram || null,
        storage: formData.storage || null,
        battery: formData.battery || null,
        camera: formData.camera || null
      };
      
      submitData.append('phone', JSON.stringify(phoneData));
      submitData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/phones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '휴대폰 등록에 실패했습니다');
      }

      alert('휴대폰이 성공적으로 등록되었습니다!');
      navigate('/phones');
    } catch (error) {
      console.error('휴대폰 등록 실패:', error);
      alert(error.message || '휴대폰 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-phone-create-page">
      {/* 헤더 */}
      <header className="admin-header">
        <div className="header-content">
          <Link to="/phones" className="back-button">← 목록</Link>
          <h1>📱 휴대폰 등록</h1>
          <div></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="admin-content">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="phone-form">
            {/* 이미지 업로드 */}
            <section className="form-section">
              <h2>📸 제품 이미지</h2>
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="미리보기" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="remove-image-button"
                    >
                      ✕ 삭제
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <p>이미지 선택 (최대 5MB)</p>
                    </div>
                  </label>
                )}
              </div>
            </section>

            {/* 기본 정보 */}
            <section className="form-section">
              <h2>📋 기본 정보</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>제품명 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="예: Galaxy S24 Ultra"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>브랜드 *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="삼성">삼성</option>
                    <option value="애플">애플</option>
                    <option value="구글">구글</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>가격 (원) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="1698400"
                    min="0"
                    required
                  />
                </div>
              </div>
            </section>

            {/* 상세 스펙 */}
            <section className="form-section">
              <h2>⚙️ 상세 스펙 (선택)</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>디스플레이</label>
                  <input
                    type="text"
                    name="display"
                    value={formData.display}
                    onChange={handleInputChange}
                    placeholder="6.8인치 QHD+"
                  />
                </div>

                <div className="form-group">
                  <label>프로세서</label>
                  <input
                    type="text"
                    name="processor"
                    value={formData.processor}
                    onChange={handleInputChange}
                    placeholder="Snapdragon 8 Gen 3"
                  />
                </div>

                <div className="form-group">
                  <label>RAM</label>
                  <input
                    type="text"
                    name="ram"
                    value={formData.ram}
                    onChange={handleInputChange}
                    placeholder="12GB"
                  />
                </div>

                <div className="form-group">
                  <label>저장공간</label>
                  <input
                    type="text"
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                    placeholder="256GB"
                  />
                </div>

                <div className="form-group">
                  <label>배터리</label>
                  <input
                    type="text"
                    name="battery"
                    value={formData.battery}
                    onChange={handleInputChange}
                    placeholder="5000mAh"
                  />
                </div>

                <div className="form-group">
                  <label>카메라</label>
                  <input
                    type="text"
                    name="camera"
                    value={formData.camera}
                    onChange={handleInputChange}
                    placeholder="200MP 광각"
                  />
                </div>
              </div>
            </section>

            {/* 제출 버튼 */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/phones')}
                className="cancel-button"
                disabled={loading}
              >
                취소
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? '등록 중...' : '✅ 휴대폰 등록'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminPhoneCreate;