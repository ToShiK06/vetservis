import React, { useState } from 'react';
import { addDoc, requestsCollection } from '../firebase';

function RequestForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    petName: '',
    petType: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const serviceTypes = [
    'Прием терапевта',
    'Вакцинация',
    'Хирургия',
    'УЗИ диагностика',
    'Лабораторные анализы',
    'Стоматология',
    'Выезд на дом',
    'Консультация',
    'Другое'
  ];

  const petTypes = [
    'Собака',
    'Кошка',
    'Попугай',
    'Хомяк',
    'Морская свинка',
    'Кролик',
    'Хорек',
    'Другое'
  ];

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
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await addDoc(requestsCollection, {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'new'
      });
      
      setSubmitSuccess(true);
      setFormData({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        petName: '',
        petType: '',
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      setSubmitError('Произошла ошибка при отправке. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="requestFormSection">
      <div className="requestFormContainer">
        <div className="requestFormHeader">
          <h2 className="requestFormTitle">Запись на прием</h2>
          <p className="requestFormSubtitle">Оставьте заявку, и мы свяжемся с вами в ближайшее время</p>
        </div>
        
        {submitSuccess && (
          <div className="successMessage">
            Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.
          </div>
        )}
        
        {submitError && (
          <div className="errorMessageForm">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="requestForm">
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
              <label className="formLabel">Удобная дата</label>
              <input
                type="date"
                name="preferredDate"
                className="formInput"
                value={formData.preferredDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Удобное время</label>
              <select
                name="preferredTime"
                className="formInput"
                value={formData.preferredTime}
                onChange={handleChange}
              >
                <option value="">Выберите время</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
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
          
          <button type="submit" className="submitRequestButton" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestForm;