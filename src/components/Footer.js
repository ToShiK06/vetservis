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
              Профессиональная ветеринарная помощь с 2010 года. Забота о здоровье ваших питомцев - наша главная задача.
            </p>
            <div className="luxuryFooterSocial">
              <a href="#" className="luxurySocialLink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="luxurySocialLink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="luxurySocialLink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="6" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="luxurySocialLink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Колонка 2 - Быстрые ссылки */}
          <div className="luxuryFooterCol">
            <h4 className="luxuryFooterTitle">Навигация</h4>
            <ul className="luxuryFooterLinks">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
              <li><Link to="/about">О нас</Link></li>
            </ul>
          </div>

          {/* Колонка 3 - Услуги */}
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

          {/* Колонка 4 - Контакты */}
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