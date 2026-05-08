import React, { useState, useEffect } from 'react';
import { reviewsCollection, getDocs, addDoc, query, where } from '../firebase';
import { auth } from '../firebase';

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      // Показываем только опубликованные отзывы
      const q = query(reviewsCollection, where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reviewsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(reviewsCollection, {
        name: newReview.name,
        rating: parseInt(newReview.rating),
        text: newReview.text,
        date: new Date().toISOString(),
        status: 'pending' // На модерации
      });
      setNewReview({ name: '', rating: 5, text: '' });
      alert('Спасибо за отзыв! Он будет опубликован после модерации.');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="loadingReviews">Загрузка отзывов...</div>;
  }

  return (
    <div className="reviewsSection">
      <div className="reviewsHeader">
        <h2>Отзывы наших клиентов</h2>
        <p>Что говорят о нас</p>
      </div>
      
      <div className="reviewsGrid">
        {reviews.length === 0 ? (
          <div className="noReviewsMessage">Пока нет отзывов. Будьте первым!</div>
        ) : (
          reviews.slice(0, 6).map((review, idx) => (
            <div key={idx} className="reviewCard">
              <div className="reviewStars">{renderStars(review.rating)}</div>
              <p className="reviewText">"{review.text}"</p>
              <div className="reviewAuthor">
                <strong>{review.name}</strong>
                <span>{new Date(review.date).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="reviewForm">
        <h3>Оставить отзыв</h3>
        <form onSubmit={handleSubmitReview}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            required
          />
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          >
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} звезд</option>)}
          </select>
          <textarea
            placeholder="Ваш отзыв"
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            required
            rows="3"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Оставить отзыв'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewsSection;