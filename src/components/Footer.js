import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="luxuryFooter">
      <div className="luxuryFooterWave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,64V0h1200v64c-50,10-100,20-150,20s-100-10-150-20c-50-10-100-20-150-20s-100,10-150,20c-50,10-100,20-150,20S300,74,250,64s-100-20-150-20S0,54,0,64z" fill="#0A1931"></path>
        </svg>
      </div>
      
      <div className="luxuryFooterContainer">
        <div className="luxuryFooterGrid">
          {/* Колонка 1 - О компании */}
          <div className="luxuryFooterCol">
            <div className="luxuryFooterLogo">
              <div className="luxuryFooterLogoIcon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L4 12L20 20L36 12L20 4Z" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20L20 28L36 20" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 28L20 36L36 28" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4A7FA7"/>
                      <stop offset="100%" stopColor="#B3CFE5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="luxuryFooterLogoMain">ВетСервис</h3>
                <p className="luxuryFooterLogoSub">Ветеринарный кабинет</p>
              </div>
            </div>
            <p className="luxuryFooterDescription">
              Профессиональная ветеринарная помощь с 2025 года. Забота о здоровье ваших питомцев - наша главная задача.
            </p>
          </div>

          <div className="luxuryFooterCol">
            <h4 className="luxuryFooterTitle">Навигация</h4>
            <ul className="luxuryFooterLinks">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
              <li><Link to="/about">О нас</Link></li>
            </ul>
          </div>

          <div className="luxuryFooterCol">
            <h4 className="luxuryFooterTitle">Услуги</h4>
            <ul className="luxuryFooterLinks">
              <li><Link to="/services">Прием терапевта</Link></li>
              <li><Link to="/services">Вакцинация</Link></li>
              <li><Link to="/services">УЗИ диагностика</Link></li>
              <li><Link to="/services">Лаборатория</Link></li>
              <li><Link to="/services">Хирургия</Link></li>
            </ul>
          </div>

          <div className="luxuryFooterCol">
            <h4 className="luxuryFooterTitle">Контакты</h4>
            <div className="luxuryFooterContact">
              <div className="luxuryContactItem">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>г. Старая Русса, мкр Городок 10а</span>
              </div>
              <div className="luxuryContactItem">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>8 (911) 601-01-39</span>
              </div>
              <div className="luxuryContactItem">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>info@vetservice.ru</span>
              </div>
              <div className="luxuryContactItem">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Пн-Сб: 9:00 - 21:00, Вс: 10:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Подвал футера */}
        <div className="luxuryFooterBottom">
          <div className="luxuryFooterBottomContent">
            <p>© {currentYear} ВетСервис. Все права защищены.</p>
            <div className="luxuryFooterBottomLinks">
              <Link to="#">Политика конфиденциальности</Link>
              <Link to="#">Пользовательское соглашение</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;