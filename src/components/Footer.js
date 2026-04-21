import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="footerSection">
          <h3 className="footerTitle">ВетМастер</h3>
          <p className="footerText">Забота о здоровье ваших питомцев</p>
        </div>
        
        <div className="footerSection">
          <h4 className="footerSubtitle">Навигация</h4>
          <Link to="/" className="footerLink">Главная</Link>
          <Link to="/services" className="footerLink">Услуги</Link>
          <Link to="/contacts" className="footerLink">Контакты</Link>
          <Link to="/about" className="footerLink">О нас</Link>
        </div>
        
        <div className="footerSection">
          <h4 className="footerSubtitle">Контакты</h4>
          <p className="footerText">Телефон: +7 (999) 123-45-67</p>
          <p className="footerText">Email: info@vetmaster.ru</p>
          <p className="footerText">Адрес: г. Москва, ул. Ветеринарная, 15</p>
        </div>
        
        <div className="footerSection">
          <h4 className="footerSubtitle">Часы работы</h4>
          <p className="footerText">Пн-Пт: 9:00 - 21:00</p>
          <p className="footerText">Сб-Вс: 10:00 - 18:00</p>
        </div>
      </div>
      
      <div className="footerBottom">
        <p className="copyright">© 2024 ВетМастер. Все права защищены</p>
      </div>
    </footer>
  );
}

export default Footer;