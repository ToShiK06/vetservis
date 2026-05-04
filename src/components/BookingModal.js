import React, { useState, useEffect } from 'react';
import { addDoc, appointmentsCollection, query, where, getDocs } from '../firebase';
import emailjs from '@emailjs/browser';
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

  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const petTypes = ['Собака', 'Кошка', 'Птица', 'Грызун', 'Рептилия', 'Другое'];

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

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\(\)\-]/g, '');
    const phoneRegex = /^(\+7|7|8)?\d{10}$/;
    return phoneRegex.test(cleanPhone);
  };

  // ========== ФУНКЦИЯ ОТПРАВКИ ПИСЬМА АДМИНУ ==========
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
      console.log('✅ Письмо администратору отправлено');
      return true;
    } catch (error) {
      console.error('❌ Ошибка отправки письма:', error);
      return false;
    }
  };
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientName) {
      setSubmitError('Введите ваше имя');
      return;
    }
    if (!formData.clientPhone || !validatePhone(formData.clientPhone)) {
      setSubmitError('Введите корректный номер телефона');
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
      // 1. Сохраняем запись в Firebase
      await addDoc(appointmentsCollection, {
        ...formData,
        serviceName: service.name,
        servicePrice: service.price,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        adminNotified: false
      });
      
      // 2. Отправляем письмо администратору
      await sendEmailToAdmin();
      
      // 3. Успех
      alert('Запись успешно создана! Уведомление отправлено администратору.');
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
              <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required placeholder="+7 999 123 45 67" />
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
  );
}

export default BookingModal;