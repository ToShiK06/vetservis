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
        </div>

        <div className="contactMap">
          <h2 className="contactSectionTitle">Как нас найти</h2>
          <div className="mapPlaceholder">
            <p> Микрорайон Городок, 10А</p>
            <p className="mapAddress">мкр. Городок, 10а</p>
            <p>г. Старая Русса</p>
          </div>
        </div>
      </div>
      
      <BookingForm />
    </div>
  );
}

export default Contacts;