import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import phoneService from '../services/phoneService';
import reviewService from '../services/reviewService';
import API_BASE_URL from '../config/api';
import '../styles/PhoneList.css';

function PhoneList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [sortBy, setSortBy] = useState('default');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    loadPhonesWithRatings();
    
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  const loadPhonesWithRatings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await phoneService.getAllPhones();
      
      const phonesWithRatings = await Promise.all(
        data.map(async (phone) => {
          try {
            const ratingData = await reviewService.getAverageRating(phone.id);
            const reviews = await reviewService.getPhoneReviews(phone.id);
            
            return {
              ...phone,
              averageRating: ratingData.averageRating || 0,
              reviewCount: reviews.length || 0
            };
          } catch (error) {
            console.error(`휴대폰 ${phone.id} 평점 로드 실패:`, error);
            return { ...phone, averageRating: 0, reviewCount: 0 };
          }
        })
      );
      
      setPhones(phonesWithRatings);
      setFilteredPhones(phonesWithRatings);
    } catch (error) {
      console.error('휴대폰 목록 로드 실패:', error);
      setError('휴대폰 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...phones];

    if (searchKeyword) {
      result = phoneService.searchPhones(result, searchKeyword);
    }

    if (selectedBrand !== 'all') {
      result = result.filter(phone => phone.brand === selectedBrand);
    }

    if (sortBy !== 'default') {
      result = phoneService.sortPhones(result, sortBy);
    }

    setFilteredPhones(result);
  }, [searchKeyword, selectedBrand, sortBy, phones]);

  const saveSearchHistory = (keyword) => {
    if (!keyword.trim()) return;

    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    history = history.slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
    setSearchHistory(history);
  };

  const removeSearchHistory = (keyword) => {
    const history = searchHistory.filter(item => item !== keyword);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    setSearchHistory(history);
  };

  const clearSearchHistory = () => {
    localStorage.setItem('searchHistory', JSON.stringify([]));
    setSearchHistory([]);
  };

  const handleHistoryClick = (keyword) => {
    setSearchKeyword(keyword);
    setSearchParams({ search: keyword });
    setShowHistory(false);
    saveSearchHistory(keyword);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setSearchParams({ search: searchKeyword });
      saveSearchHistory(searchKeyword);
      setShowHistory(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  const handleDeletePhone = async (phoneId, phoneName, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`"${phoneName}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await phoneService.deletePhone(phoneId);
      alert('휴대폰이 삭제되었습니다');
      loadPhonesWithRatings();
    } catch (error) {
      console.error('휴대폰 삭제 실패:', error);
      alert(error.message || '휴대폰 삭제에 실패했습니다');
    }
  };

  if (loading) {
    return (
      <div className="phone-list-page">
        <header className="phone-list-header">
          <div className="header-content">
            <Link to="/" className="back-button">← 홈</Link>
            <h1>📱 휴대폰 목록</h1>
            {isAdmin && (
              <Link to="/admin/phones/new" className="admin-add-button">
                ➕ 휴대폰 등록
              </Link>
            )}
            {!isAdmin && <div></div>}
          </div>
        </header>
        <div className="loading-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="phone-list-page">
        <header className="phone-list-header">
          <div className="header-content">
            <Link to="/" className="back-button">← 홈</Link>
            <h1>📱 휴대폰 목록</h1>
            {isAdmin && (
              <Link to="/admin/phones/new" className="admin-add-button">
                ➕ 휴대폰 등록
              </Link>
            )}
            {!isAdmin && <div></div>}
          </div>
        </header>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadPhonesWithRatings} className="retry-button">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-list-page">
      <header className="phone-list-header">
        <div className="header-content">
          <Link to="/" className="back-button">← 홈</Link>
          <h1>📱 휴대폰 목록</h1>
          {isAdmin && (
            <Link to="/admin/phones/new" className="admin-add-button">
              ➕ 휴대폰 등록
            </Link>
          )}
          {!isAdmin && <div></div>}
        </div>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder="휴대폰 검색 (모델명, 브랜드)"
              className="search-input"
            />
            
            {showHistory && searchHistory.length > 0 && (
              <div className="search-history-dropdown">
                <div className="history-header">
                  <span>최근 검색어</span>
                  <button type="button" onClick={clearSearchHistory} className="clear-all-button">
                    전체 삭제
                  </button>
                </div>
                <ul className="history-list">
                  {searchHistory.map((keyword, index) => (
                    <li key={index} className="history-item">
                      <button type="button" onClick={() => handleHistoryClick(keyword)} className="history-keyword">
                        🔍 {keyword}
                      </button>
                      <button type="button" onClick={() => removeSearchHistory(keyword)} className="remove-history-button">
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button type="submit" className="search-button">🔍 검색</button>
        </form>
      </section>

      <section className="filter-section">
        <div className="filter-container">
          <div className="filter-group">
            <label>브랜드</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="filter-select">
              <option value="all">전체</option>
              <option value="삼성">삼성</option>
              <option value="apple">애플</option>
              <option value="구글">구글</option>
            </select>
          </div>

          <div className="filter-group">
            <label>정렬</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="default">기본</option>
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="name">이름순</option>
            </select>
          </div>
        </div>
      </section>

      <section className="result-info">
        <p>총 <strong>{filteredPhones.length}</strong>개의 휴대폰</p>
      </section>

      <section className="phone-grid">
        {filteredPhones.length === 0 ? (
          <div className="no-results">
            <p>😢 검색 결과가 없습니다</p>
          </div>
        ) : (
          filteredPhones.map(phone => (
            <div key={phone.id} className="phone-card-wrapper">
              <Link to={`/phones/${phone.id}`} className="phone-card">
                <div className="phone-image">
                  <img 
                    src={phone.imageUrl
                      ? (phone.imageUrl.startsWith('http') ? encodeURI(phone.imageUrl) : `${API_BASE_URL}${phone.imageUrl}`)
                      : `https://placehold.co/300x300/667eea/FFF?text=${encodeURIComponent(phone.name)}`
                    }
                    alt={phone.name}
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = 'true';
                        e.target.src = `https://placehold.co/300x300/667eea/FFF?text=${encodeURIComponent(phone.name)}`;
                      }
                    }}
                  />
                </div>

                <div className="phone-info">
                  <div className="brand-badge">{phone.brand}</div>
                  <h3 className="phone-name">{phone.name}</h3>
                  
                  {phone.averageRating > 0 && (
                    <div className="phone-rating">
                      <div className="stars">{renderStars(phone.averageRating)}</div>
                      <span className="rating-text">{phone.averageRating.toFixed(1)}</span>
                      <span className="review-count">({phone.reviewCount})</span>
                    </div>
                  )}
                  
                  <p className="phone-price">{formatPrice(phone.price)}</p>
                </div>
              </Link>

              {isAdmin && (
                <button
                  onClick={(e) => handleDeletePhone(phone.id, phone.name, e)}
                  className="delete-phone-button"
                  title="삭제"
                >
                  🗑️
                </button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default PhoneList;