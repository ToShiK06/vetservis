import React, { useState, useEffect } from 'react';
import { addDoc, appointmentsCollection, query, where, getDocs } from '../firebase';
import { auth } from '../firebase';

function BookingForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    petName: '',
    petType: '',
    serviceType: '',
    bookingDate: '',
    bookingTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const serviceTypes = [
    'Прием терапевта',
    'Вакцинация',
    'Хирургия',
    'УЗИ диагностика',
    'Лабораторные анализы',
    'Стоматология',
    'Выезд на дом',
    'Консультация'
  ];

  const petTypes = ['Собака', 'Кошка', 'Птица', 'Грызун', 'Рептилия', 'Другое'];

  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setSubmitError('Для отправки заявки необходимо войти в аккаунт');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setIsAuthenticated(true);
      // Автоматически заполняем email и имя, если есть
      setFormData(prev => ({
        ...prev,
        clientEmail: user.email || '',
        clientName: user.displayName || ''
      }));
    }
  }, []);

  useEffect(() => {
    if (formData.bookingDate && isAuthenticated) {
      loadBookedTimes(formData.bookingDate);
    }
  }, [formData.bookingDate, isAuthenticated]);

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
      console.error('Ошибка загрузки занятых слотов:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка авторизации
    const user = auth.currentUser;
    if (!user) {
      setSubmitError('Для отправки заявки необходимо войти в аккаунт');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    if (!formData.clientName) {
      setSubmitError('Пожалуйста, введите ваше имя');
      return;
    }
    
    if (!formData.clientPhone || !validatePhone(formData.clientPhone)) {
      setSubmitError('Пожалуйста, введите корректный номер телефона');
      return;
    }
    
    if (!formData.serviceType) {
      setSubmitError('Пожалуйста, выберите услугу');
      return;
    }
    
    if (!formData.bookingDate) {
      setSubmitError('Пожалуйста, выберите дату');
      return;
    }
    
    if (!formData.bookingTime) {
      setSubmitError('Пожалуйста, выберите время');
      return;
    }
    
    if (bookedTimes.includes(formData.bookingTime)) {
      setSubmitError('Это время уже занято. Пожалуйста, выберите другое время.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await addDoc(appointmentsCollection, {
        ...formData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        userId: user.uid,
        userEmail: user.email
      });
      
      setSubmitSuccess(true);
      setFormData({
        clientName: '',
        clientPhone: '',
        clientEmail: user.email || '',
        petName: '',
        petType: '',
        serviceType: '',
        bookingDate: '',
        bookingTime: '',
        message: ''
      });
      setBookedTimes([]);
      setAvailableTimes([]);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка при бронировании:', error);
      setSubmitError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    const year = max.getFullYear();
    const month = String(max.getMonth() + 1).padStart(2, '0');
    const day = String(max.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="bookingFormSection">
        <div className="bookingFormContainer">
          <div className="bookingFormHeader">
            <h2 className="bookingFormTitle">Запись на прием</h2>
            <p className="bookingFormSubtitle">Выберите удобную дату и время</p>
          </div>
          <div className="errorMessageForm">
            Для записи на прием необходимо войти в аккаунт
          </div>
          <button 
            className="submitBookingButton" 
            onClick={() => window.location.href = '/login'}
            style={{ marginTop: '20px' }}
          >
            Перейти к входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookingFormSection">
      <div className="bookingFormContainer">
        <div className="bookingFormHeader">
          <h2 className="bookingFormTitle">Запись на прием</h2>
          <p className="bookingFormSubtitle">Выберите удобную дату и время</p>
        </div>
        
        {submitSuccess && (
          <div className="successMessage">
            Запись успешно создана! Мы свяжемся с вами для подтверждения.
          </div>
        )}
        
        {submitError && (
          <div className="errorMessageForm">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bookingForm">
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Ваше имя *</label>
              <input
                type="text"
                name="clientName"
                className="formInput"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Иван Иванов"
                required
              />
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Телефон *</label>
              <input
                type="tel"
                name="clientPhone"
                className="formInput"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+7 999 123 45 67"
                required
              />
            </div>
          </div>
          
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Email</label>
              <input
                type="email"
                name="clientEmail"
                className="formInput"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="ivan@example.com"
              />
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Вид питомца</label>
              <select
                name="petType"
                className="formInput"
                value={formData.petType}
                onChange={handleChange}
              >
                <option value="">Выберите вид</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Кличка питомца</label>
              <input
                type="text"
                name="petName"
                className="formInput"
                value={formData.petName}
                onChange={handleChange}
                placeholder="Бобик"
              />
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Услуга *</label>
              <select
                name="serviceType"
                className="formInput"
                value={formData.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Выберите услугу</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Дата приема *</label>
              <input
                type="date"
                name="bookingDate"
                className="formInput"
                value={formData.bookingDate}
                onChange={handleChange}
                min={getMinDate()}
                max={getMaxDate()}
                required
              />
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Время приема *</label>
              <select
                name="bookingTime"
                className="formInput"
                value={formData.bookingTime}
                onChange={handleChange}
                required
                disabled={!formData.bookingDate}
              >
                <option value="">Выберите время</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {formData.bookingDate && availableTimes.length === 0 && (
                <p className="noSlotsMessage">На выбранную дату нет свободных слотов</p>
              )}
            </div>
          </div>
          
          <div className="formGroup">
            <label className="formLabel">Дополнительная информация</label>
            <textarea
              name="message"
              className="formTextarea"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Опишите проблему или пожелания..."
            />
          </div>
          
          <button type="submit" className="submitBookingButton" disabled={isSubmitting}>
            {isSubmitting ? 'Бронирование...' : 'Забронировать время'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;