import React, { useState, useEffect } from 'react';
import { db, reviewsCollection, getDocs, deleteDoc, doc, updateDoc } from '../firebase';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const snapshot = await getDocs(reviewsCollection);
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reviewsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Удалить отзыв?')) {
      await deleteDoc(doc(db, 'reviews', reviewId));
      await loadReviews();
    }
  };

  const handleToggleStatus = async (review) => {
    const newStatus = review.status === 'approved' ? 'pending' : 'approved';
    await updateDoc(doc(db, 'reviews', review.id), {
      status: newStatus
    });
    await loadReviews();
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="reviewStatusBadge approved">Опубликован</span>;
      case 'pending':
        return <span className="reviewStatusBadge pending">На модерации</span>;
      default:
        return <span className="reviewStatusBadge pending">На модерации</span>;
    }
  };

  if (loading) {
    return <div className="adminLoading">Загрузка отзывов...</div>;
  }

  return (
    <div className="adminReviewsSection">
      <div className="reviewsAdminHeader">
        <h2 className="sectionTitle">Управление отзывами</h2>
        <div className="filterButtons">
          <button className={`filterBtn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Все ({reviews.length})
          </button>
          <button className={`filterBtn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
            На модерации ({reviews.filter(r => r.status === 'pending').length})
          </button>
          <button className={`filterBtn ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>
            Опубликованные ({reviews.filter(r => r.status === 'approved').length})
          </button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="noReviews">Нет отзывов</div>
      ) : (
        <div className="reviewsList">
          {filteredReviews.map(review => (
            <div key={review.id} className="adminReviewCard">
              <div className="adminReviewHeader">
                <div className="reviewUserInfo">
                  <strong className="reviewAuthorName">{review.name}</strong>
                  <div className="reviewStars">{renderStars(review.rating)}</div>
                </div>
                <div className="reviewStatus">
                  {getStatusBadge(review.status)}
                </div>
              </div>
              
              <p className="adminReviewText">"{review.text}"</p>
              
              <div className="adminReviewFooter">
                <span className="reviewDate">
                  {new Date(review.date).toLocaleDateString('ru-RU')}
                </span>
                <div className="adminReviewActions">
                  <button 
                    className={`toggleStatusBtn ${review.status === 'approved' ? 'unapprove' : 'approve'}`}
                    onClick={() => handleToggleStatus(review)}
                  >
                    {review.status === 'approved' ? 'Снять с публикации' : 'Опубликовать'}
                  </button>
                  <button 
                    className="deleteReviewBtn"
                    onClick={() => handleDelete(review.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;