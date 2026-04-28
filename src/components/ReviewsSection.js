import React, { useState, useEffect } from 'react';
import { reviewsCollection, getDocs, addDoc } from '../firebase';
import { auth } from '../firebase';

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const snapshot = await getDocs(reviewsCollection);
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    try {
      await addDoc(reviewsCollection, {
        ...newReview,
        date: new Date().toISOString(),
        verified: true
      });
      setNewReview({ name: '', rating: 5, text: '' });
      loadReviews();
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="reviewsSection">
      <div className="reviewsHeader">
        <h2>Отзывы наших клиентов</h2>
        <p>Что говорят о нас</p>
      </div>
      
      <div className="reviewsGrid">
        {reviews.slice(0, 4).map((review, idx) => (
          <div key={idx} className="reviewCard">
            <div className="reviewStars">{renderStars(review.rating)}</div>
            <p className="reviewText">"{review.text}"</p>
            <div className="reviewAuthor">
              <strong>{review.name}</strong>
              <span>{new Date(review.date).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        ))}
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
          <button type="submit">Оставить отзыв</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewsSection;