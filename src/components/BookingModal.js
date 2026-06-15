import React, { useState, useEffect } from 'react';
import { addDoc, appointmentsCollection, query, where, getDocs } from '../firebase';
import { auth } from '../firebase';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

const EMAILJS_SERVICE_ID = 'service_xg0uah9';      
const EMAILJS_TEMPLATE_ID = 'template_3gpkrh1';    
const EMAILJS_PUBLIC_KEY = 'AIHGwDRKwVMI3nK-P';       
const ADMIN_EMAIL = 'vetservis.st.rus@gmail.com';         

function BookingModal({ service, onClose }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    petName: '',
    petType: '',
    bookingDate: '',
    bookingTime: '',
    message: ''
  });
  
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const petTypes = ['Собака', 'Кошка', 'Птица', 'Грызун', 'Рептилия', 'Другое'];

  const normalizePhone = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[\s\(\)\-]/g, '');
    cleaned = cleaned.replace('+', '');
    
    if (cleaned.startsWith('8')) {
      cleaned = '+7' + cleaned.slice(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('9')) {
      cleaned = '+7' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 1)} ${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Поле обязательно для заполнения';
    const normalized = normalizePhone(phone);
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!phoneRegex.test(normalized)) {
      return 'Введите корректный номер телефона (10 цифр после кода страны)';
    }
    return '';
  };

  useEffect(() => {
    if (formData.bookingDate) {
      loadBookedTimes(formData.bookingDate);
    }
  }, [formData.bookingDate]);

  const loadBookedTimes = async (date) => {
    try {
      const q = query(
        appointmentsCollection,
        where('bookingDate', '==', date),
        where('status', 'in', ['confirmed', 'pending'])
      );
      const snapshot = await getDocs(q);
      const booked = snapshot.docs.map(doc => doc.data().bookingTime);
      setBookedTimes(booked);
      
      const available = allTimeSlots.filter(time => !booked.includes(time));
      setAvailableTimes(available);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhone(rawValue);
    const error = validatePhone(formattedValue);
    setPhoneError(error);
    setFormData({
      ...formData,
      clientPhone: formattedValue
    });
  };

  const sendEmailToAdmin = async () => {
    try {
      const templateParams = {
        to_email: ADMIN_EMAIL,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail || 'Не указан',
        serviceName: service.name,
        servicePrice: service.price,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        petName: formData.petName || 'Не указан',
        petType: formData.petType || 'Не указан',
        message: formData.message || 'Нет сообщения'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log('Письмо администратору отправлено');
      return true;
    } catch (error) {
      console.error('Ошибка отправки письма:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (!formData.clientName) {
      setSubmitError('Введите ваше имя');
      return;
    }
    
    const phoneValid = validatePhone(formData.clientPhone);
    if (phoneValid) {
      setPhoneError(phoneValid);
      setSubmitError(phoneValid);
      return;
    }
    
    if (!formData.bookingDate) {
      setSubmitError('Выберите дату');
      return;
    }
    if (!formData.bookingTime) {
      setSubmitError('Выберите время');
      return;
    }
    if (bookedTimes.includes(formData.bookingTime)) {
      setSubmitError('Это время уже занято');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await addDoc(appointmentsCollection, {
        ...formData,
        clientPhone: normalizePhone(formData.clientPhone),
        serviceName: service.name,
        servicePrice: service.price,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        adminNotified: false,
        userId: user.uid,
        userEmail: user.email
      });
      
      await sendEmailToAdmin();
      
      alert('Запись успешно создана! Уведомление отправлено.');
      onClose();
    } catch (error) {
      console.error('Ошибка:', error);
      setSubmitError('Ошибка при бронировании. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <h2>Запись на услугу</h2>
            <button className="modalCloseBtn" onClick={onClose}>×</button>
          </div>
          
          <div className="modalServiceInfo">
            <span className="modalServiceIcon">{service.icon || ''}</span>
            <div>
              <h3>{service.name}</h3>
              <p className="modalServicePrice">{service.price}</p>
            </div>
          </div>
          
          {submitError && <div className="errorMessageForm">{submitError}</div>}
          
          <form onSubmit={handleSubmit} className="modalForm">
            <div className="formRow">
              <div className="formGroup">
                <label>Ваше имя *</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required />
              </div>
              <div className="formGroup">
                <label>Телефон *</label>
                <input 
                  type="tel" 
                  name="clientPhone" 
                  value={formData.clientPhone} 
                  onChange={handlePhoneChange} 
                  className={phoneError ? 'inputError' : ''}
                  required 
                  placeholder="+7 999 123 45 67" 
                />
                {phoneError && <div className="errorText">{phoneError}</div>}
                <div className="hintText">Введите 10 цифр после +7</div>
              </div>
            </div>
            
            <div className="formRow">
              <div className="formGroup">
                <label>Email</label>
                <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} />
              </div>
              <div className="formGroup">
                <label>Вид питомца</label>
                <select name="petType" value={formData.petType} onChange={handleChange}>
                  <option value="">Выберите</option>
                  {petTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            
            <div className="formRow">
              <div className="formGroup">
                <label>Дата *</label>
                <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} min={getMinDate()} max={getMaxDate()} required />
              </div>
              <div className="formGroup">
                <label>Время *</label>
                <select name="bookingTime" value={formData.bookingTime} onChange={handleChange} required disabled={!formData.bookingDate}>
                  <option value="">Выберите время</option>
                  {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>
            
            <div className="formGroup">
              <label>Кличка питомца</label>
              <input type="text" name="petName" value={formData.petName} onChange={handleChange} />
            </div>
            
            <div className="formGroup">
              <label>Дополнительная информация</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="3" />
            </div>
            
            <button type="submit" className="submitModalBtn" disabled={isSubmitting}>
              {isSubmitting ? 'Бронирование...' : 'Подтвердить запись'}
            </button>
          </form>
        </div>
      </div>

      {/* Модальное окно с предложением войти */}
      {showLoginModal && (
        <div className="modalOverlay" onClick={() => setShowLoginModal(false)}>
          <div className="modalContent" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>Требуется авторизация</h2>
              <button className="modalCloseBtn" onClick={() => setShowLoginModal(false)}>×</button>
            </div>
            <div style={{ padding: '30px' }}>
              <p style={{ marginBottom: '20px', color: '#1A3D63' }}>
                Для записи на услугу необходимо войти в аккаунт.
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <Link to="/login" className="submitButton" style={{ textDecoration: 'none' }} onClick={() => setShowLoginModal(false)}>
                  Войти
                </Link>
                <button className="cancelButton" onClick={() => setShowLoginModal(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingModal;