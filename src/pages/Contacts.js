import React from 'react';
import BookingForm from '../components/BookingForm';

function Contacts() {
  return (
    <div className="contactsPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Контакты</h1>
        <p className="pageSubtitle">Свяжитесь с нами любым удобным способом</p>
      </div>

      <div className="contactsGrid">
        <div className="contactInfo">
          <h2 className="contactSectionTitle">Контактная информация</h2>
          
          <div className="contactItem">
            <strong> Адрес:</strong>
            <p>г. Старая Русса, мкр Городок 10а</p>
          </div>
          
          <div className="contactItem">
            <strong> Телефон:</strong>
            <p>8 (911) 601-01-39</p>
          </div>
          
          <div className="contactItem">
            <strong> Email:</strong>
            <p>info@vetservice.ru</p>
          </div>
          
          <div className="contactItem">
            <strong> Режим работы:</strong>
            <p>Понедельник - Суббота: 9:00 - 21:00</p>
            <p>Воскресенье: 10:00 - 18:00</p>
          </div>

          <div className="contactItem">
            <strong> Рейтинг:</strong>
            <p>5.0 на основе отзывов</p>
            <p>91 подписчик · 6 друзей</p>
          </div>
        </div>

        <div className="contactMap">
          <h2 className="contactSectionTitle">Как нас найти</h2>
          <div className="mapContainer">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d573.9480662052816!2d31.360799747312818!3d57.974033380510214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sru!2sru!4v1777025530364!5m2!1sru!2sru" 
              width="100%" 
              height="350" 
              style={{ border: 0, borderRadius: '12px' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта клиники ВетСервис"
            ></iframe>
            <p className="mapAddress"> Микрорайон Городок, 10А, г. Старая Русса</p>
          </div>
        </div>
      </div>
      
      {/* Форма бронирования */}
      <BookingForm />
    </div>
  );
}

export default Contacts;