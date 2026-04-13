import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import phoneService from '../services/phoneService';
import favoriteService from '../services/favoriteService';
import cartService from '../services/cartService';
import reviewService from '../services/reviewService';
import commentService from '../services/commentService';
import API_BASE_URL from '../config/api';
import '../styles/PhoneDetail.css';

function PhoneDetail() {
  const { phoneId } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 리뷰 관련 state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, content: '' });

  // Q&A 관련 state
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // ===== 찜 개수 state 추가 =====
  const [favoriteCount, setFavoriteCount] = useState(0);

  // 장바구니로 이동
  const handleGoToCart = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }
 
    navigate('/cart');
  };

  // ===== 찜 개수 로드 =====
  const loadFavoriteCount = useCallback(async () => {
    try {
      const allPhones = await phoneService.getAllPhones();
      const currentPhone = allPhones.find(p => p.id === parseInt(phoneId));
      
      if (currentPhone && currentPhone.favoriteCount !== undefined) {
        setFavoriteCount(currentPhone.favoriteCount);
      }
    } catch (error) {
      console.error('찜 개수 로드 실패:', error);
    }
  }, [phoneId]);

  // Q&A 목록 로드
  const loadComments = useCallback(async () => {
    try {
      const commentData = await commentService.getPhoneComments(phoneId);
      setComments(commentData);
    } catch (error) {
      console.error('문의 로드 실패:', error);
      setComments([]);
    }
  }, [phoneId]);

  // 리뷰 목록 로드
  const loadReviews = useCallback(async () => {
    try {
      const reviewData = await reviewService.getPhoneReviews(phoneId);
      setReviews(reviewData);
    } catch (error) {
      console.error('리뷰 로드 실패:', error);
      setReviews([]);
    }
  }, [phoneId]);

  // 평균 별점 로드
  const loadAverageRating = useCallback(async () => {
    try {
      const ratingData = await reviewService.getAverageRating(phoneId);
      setAverageRating(ratingData.averageRating);
    } catch (error) {
      console.error('평균 별점 로드 실패:', error);
      setAverageRating(0);
    }
  }, [phoneId]);

  // 휴대폰 데이터 로드
  const loadPhoneData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // 휴대폰 정보
      const phoneData = await phoneService.getPhoneById(phoneId);
      setPhone(phoneData);
      
      // 찜 상태 (로그인 시에만) - 에러 발생해도 페이지 로딩은 계속
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        try {
          const favorites = await favoriteService.getMyFavorites();
          const isFavorited = favorites.some(fav => fav.phoneId === parseInt(phoneId));
          setIsWishlisted(isFavorited);
        } catch (favError) {
          console.warn('찜 상태 조회 실패 (무시):', favError);
        }
      }
      
      // 리뷰 목록
      await loadReviews();
      
      // 평균 별점
      await loadAverageRating();

      // Q&A 목록
      await loadComments();

      // ===== 찜 개수 로드 추가 =====
      await loadFavoriteCount();
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setError('정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [phoneId, loadReviews, loadAverageRating, loadComments, loadFavoriteCount]);

  useEffect(() => {
    loadPhoneData();
  }, [loadPhoneData]);

  // 리뷰 작성
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        alert('로그인이 필요합니다');
        navigate('/login');
        return;
      }

      if (!newReview.content.trim()) {
        alert('리뷰 내용을 입력해주세요');
        return;
      }

      await reviewService.addReview(phoneId, newReview.rating, newReview.content);
      
      setNewReview({ rating: 5, content: '' });
      setShowReviewForm(false);
      
      await loadReviews();
      await loadAverageRating();
      
      alert('리뷰가 작성되었습니다!');
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      
      const errorMessage = error.message || '';
      if (errorMessage.includes('이미') || errorMessage.includes('작성')) {
        alert('이미 이 제품에 리뷰를 작성하셨습니다.\n리뷰는 제품당 1개만 작성 가능합니다.');
      } else {
        alert(errorMessage || '리뷰 작성에 실패했습니다');
      }
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      await loadReviews();
      await loadAverageRating();
      alert('리뷰가 삭제되었습니다');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert(error.message || '리뷰 삭제에 실패했습니다');
    }
  };

  // Q&A 작성
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        alert('로그인이 필요합니다');
        navigate('/login');
        return;
      }

      if (!newComment.trim()) {
        alert('문의 내용을 입력해주세요');
        return;
      }

      if (newComment.length > 500) {
        alert('문의 내용은 500자 이하로 작성해주세요');
        return;
      }

      await commentService.createComment(phoneId, newComment);
      
      setNewComment('');
      setShowCommentForm(false);
      await loadComments();
      
      alert('문의가 등록되었습니다!');
    } catch (error) {
      console.error('문의 작성 실패:', error);
      alert(error.message || '문의 등록에 실패했습니다');
    }
  };

  // Q&A 수정 시작
  const startEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  // Q&A 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // Q&A 수정 저장
  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) {
      alert('문의 내용을 입력해주세요');
      return;
    }

    if (editingContent.length > 500) {
      alert('문의 내용은 500자 이하로 작성해주세요');
      return;
    }

    try {
      await commentService.updateComment(commentId, editingContent);
      
      setEditingCommentId(null);
      setEditingContent('');
      await loadComments();
      
      alert('문의가 수정되었습니다');
    } catch (error) {
      console.error('문의 수정 실패:', error);
      alert(error.message || '문의 수정에 실패했습니다');
    }
  };

  // Q&A 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('문의를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await commentService.deleteComment(commentId);
      await loadComments();
      alert('문의가 삭제되었습니다');
    } catch (error) {
      console.error('문의 삭제 실패:', error);
      alert(error.message || '문의 삭제에 실패했습니다');
    }
  };

  // 찜 토글
  const toggleWishlist = async () => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        alert('로그인이 필요합니다');
        navigate('/login');
        return;
      }

      if (isWishlisted) {
        await favoriteService.deleteFavorite(phoneId);
        setIsWishlisted(false);
        setFavoriteCount(prev => Math.max(0, prev - 1)); // ===== 찜 개수 감소 =====
        alert('찜 목록에서 제거되었습니다');
      } else {
        await favoriteService.addFavorite(phoneId);
        setIsWishlisted(true);
        setFavoriteCount(prev => prev + 1); // ===== 찜 개수 증가 =====
        alert('찜 목록에 추가되었습니다');
      }
    } catch (error) {
      console.error('찜 처리 실패:', error);
      alert(error.message || '찜 처리에 실패했습니다');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!phone) return;
 
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        alert('로그인이 필요합니다');
        navigate('/login');
        return;
      }
 
      for (let i = 0; i < quantity; i++) {
        await cartService.addItem(phone.id);
      }
 
      const goToCart = window.confirm(
        `장바구니에 ${quantity}개가 추가되었습니다!\n장바구니로 이동하시겠습니까?`
      );
 
      if (goToCart) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert(error.message || '장바구니 추가에 실패했습니다');
    }
  };

  const handleBuyNow = async () => {
    if (!phone) return;

    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        alert('로그인이 필요합니다');
        navigate('/login');
        return;
      }

      for (let i = 0; i < quantity; i++) {
        await cartService.addItem(phone.id);
      }

      navigate('/cart');
    } catch (error) {
      console.error('구매 실패:', error);
      alert(error.message || '구매 처리에 실패했습니다');
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="phone-detail-page">
        <header className="detail-header">
          <div className="header-content">
            <Link to="/phones" className="back-button">← 목록</Link>
            <h1>휴대폰 상세</h1>
            <div></div>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !phone) {
    return (
      <div className="phone-detail-page">
        <header className="detail-header">
          <div className="header-content">
            <Link to="/phones" className="back-button">← 목록</Link>
            <h1>휴대폰 상세</h1>
            <div></div>
          </div>
        </header>
        <div className="error-container">
          <p className="error-message">{error || '휴대폰을 찾을 수 없습니다'}</p>
          <button onClick={() => navigate('/phones')} className="retry-button">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const currentUserId = parseInt(localStorage.getItem('userId'));

  return (
    <div className="phone-detail-page">
      <header className="detail-header">
        <div className="header-content">
          <Link to="/phones" className="back-button">← 목록</Link>
          <h1>휴대폰 상세</h1>
          <div></div>
        </div>
      </header>

      <main className="detail-content">
        <div className="detail-container">
          <section className="image-section">
            <div className="main-image">
              <img 
                src={phone.imageUrl
                  ? (phone.imageUrl.startsWith('http') ? encodeURI(phone.imageUrl) : `${API_BASE_URL}${phone.imageUrl}`)
                  : `https://placehold.co/500x500/667eea/FFF?text=${encodeURIComponent(phone.name)}`
                }
                alt={phone.name}
                onError={(e) => {
                  if (!e.target.dataset.fallback) {
                    e.target.dataset.fallback = 'true';
                    e.target.src = `https://placehold.co/500x500/667eea/FFF?text=Image`;
                  }
                }}
              />
            </div>
          </section>

          <section className="info-section">
            <div className="brand-badge">{phone.brand}</div>
            <h2 className="phone-name">{phone.name}</h2>
            <p className="phone-price">{formatPrice(phone.price)}</p>
            
            {/* ===== 평균 별점 + 찜 개수 ===== */}
            <div className="phone-meta-stats">
              {averageRating > 0 && (
                <div className="average-rating">
                  <div className="stars">{renderStars(Math.round(averageRating))}</div>
                  <span className="rating-text">{averageRating.toFixed(1)}</span>
                  <span className="review-count">({reviews.length}개 리뷰)</span>
                </div>
              )}
              
              {/* 찜 개수 */}
              {favoriteCount > 0 && (
                <div className="favorite-count-badge">
                  <span className="favorite-icon">💗</span>
                  <span className="favorite-text">{favoriteCount}명이 찜했어요</span>
                </div>
              )}
            </div>

            {/* 수량 선택 */}
            <div className="option-section">
              <label>수량</label>
              <div className="quantity-control">
                <button onClick={decreaseQuantity} className="qty-button">-</button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="qty-input"
                  min="1"
                />
                <button onClick={increaseQuantity} className="qty-button">+</button>
              </div>
            </div>

            {/* 구매 버튼 */}
            <div className="action-buttons">
              <button onClick={toggleWishlist} className={`wishlist-button ${isWishlisted ? 'active' : ''}`}>
                {isWishlisted ? '❤️ 찜 완료' : '🤍 찜하기'}
              </button>
              <button onClick={handleAddToCart} className="cart-button">
                🛒 장바구니 담기
              </button>
              <button onClick={handleGoToCart} className="view-cart-button">
                📋 장바구니 보기
              </button>
              <button onClick={handleBuyNow} className="buy-button">
                구매하기
              </button>
            </div>
          </section>
        </div>

        <div className="product-info-container">
          <section className="product-info-section">
            <h3>📋 제품 정보</h3>
            <div className="info-card">
              <div className="info-row">
                <span className="info-label">제조사</span>
                <span className="info-value">{phone.brand}</span>
              </div>
              <div className="info-row">
                <span className="info-label">카테고리</span>
                <span className="info-value">플래그십</span>
              </div>
              <div className="info-row">
                <span className="info-label">출시일</span>
                <span className="info-value">2024. 1. 17.</span>
              </div>
              <div className="info-row">
                <span className="info-label">재고</span>
                <span className="info-value">50개</span>
              </div>
            </div>
          </section>

          {(phone.display || phone.processor || phone.ram) && (
            <section className="spec-info-section">
              <h3>⚙️ 사양</h3>
              <div className="spec-card">
                {phone.display && (
                  <div className="spec-row">
                    <span className="spec-label">디스플레이</span>
                    <span className="spec-value">{phone.display}</span>
                  </div>
                )}
                {phone.processor && (
                  <div className="spec-row">
                    <span className="spec-label">프로세서</span>
                    <span className="spec-value">{phone.processor}</span>
                  </div>
                )}
                {phone.ram && (
                  <div className="spec-row">
                    <span className="spec-label">RAM</span>
                    <span className="spec-value">{phone.ram}</span>
                  </div>
                )}
                {phone.storage && (
                  <div className="spec-row">
                    <span className="spec-label">저장공간</span>
                    <span className="spec-value">{phone.storage}</span>
                  </div>
                )}
                {phone.battery && (
                  <div className="spec-row">
                    <span className="spec-label">배터리</span>
                    <span className="spec-value">{phone.battery}</span>
                  </div>
                )}
                {phone.camera && (
                  <div className="spec-row">
                    <span className="spec-label">카메라</span>
                    <span className="spec-value">{phone.camera}</span>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <section className="review-section">
          <div className="review-header">
            <h3>⭐ 리뷰 ({reviews.length})</h3>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)} 
              className="write-review-button"
            >
              {showReviewForm ? '취소' : '리뷰 작성'}
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>별점</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star-input ${newReview.rating >= star ? 'selected' : ''}`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>리뷰 내용</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="이 제품에 대한 솔직한 리뷰를 남겨주세요"
                  rows="4"
                  maxLength="500"
                  className="review-textarea"
                />
                <div className="char-count">{newReview.content.length}/500</div>
              </div>
              <button type="submit" className="submit-review-button">
                리뷰 등록
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="review-placeholder">
              <p>아직 작성된 리뷰가 없습니다.</p>
              <p>첫 리뷰를 작성해보세요!</p>
            </div>
          ) : (
            <div className="review-list">
              {reviews.map((review) => (
                <div key={review.reviewId} className="review-item">
                  <div className="review-header-info">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.userName}</span>
                      <div className="review-stars">{renderStars(review.rating)}</div>
                    </div>
                    <div className="review-meta">
                      <span className="review-date">{formatDate(review.createdAt)}</span>
                      {currentUserId === review.userId && (
                        <button 
                          onClick={() => handleDeleteReview(review.reviewId)}
                          className="delete-review-button"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="comment-section">
          <div className="comment-header">
            <h3>💬 상품 문의 ({comments.length})</h3>
            <button 
              onClick={() => setShowCommentForm(!showCommentForm)} 
              className="write-comment-button"
            >
              {showCommentForm ? '취소' : '문의 작성'}
            </button>
          </div>

          {showCommentForm && (
            <form onSubmit={handleSubmitComment} className="comment-form">
              <div className="form-group">
                <label>문의 내용</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="제품에 대해 궁금한 점을 남겨주세요"
                  rows="4"
                  maxLength="500"
                  className="comment-textarea"
                />
                <div className="char-count">{newComment.length}/500</div>
              </div>
              <button type="submit" className="submit-comment-button">
                문의 등록
              </button>
            </form>
          )}

          {comments.length === 0 ? (
            <div className="comment-placeholder">
              <p>아직 작성된 문의가 없습니다.</p>
              <p>첫 문의를 남겨보세요!</p>
            </div>
          ) : (
            <div className="comment-list">
              {comments.map((comment) => (
                <div key={comment.commentId} className="comment-item">
                  <div className="comment-header-info">
                    <span className="commenter-name">{comment.userName}</span>
                    <div className="comment-meta">
                      {currentUserId === comment.userId && editingCommentId !== comment.commentId && (
                        <div className="comment-actions">
                          <button 
                            onClick={() => startEditComment(comment.commentId, comment.content)}
                            className="edit-comment-button"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="delete-comment-button"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingCommentId === comment.commentId ? (
                    <div className="comment-edit-form">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows="3"
                        maxLength="500"
                        className="comment-edit-textarea"
                      />
                      <div className="char-count">{editingContent.length}/500</div>
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleUpdateComment(comment.commentId)}
                          className="save-comment-button"
                        >
                          저장
                        </button>
                        <button 
                          onClick={cancelEditComment}
                          className="cancel-edit-button"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-content">{comment.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PhoneDetail;