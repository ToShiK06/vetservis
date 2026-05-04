import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';

function Header({ admin, setAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [client, setClient] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    setActiveLink(location.pathname);
    
    // Следим за состоянием клиента (обычный пользователь, НЕ админ)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email !== 'admin@vetmaster.com') {
        setClient(user);
      } else {
        setClient(null);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, [location]);

  const handleAdminLogout = async () => {
    await auth.signOut();
    setAdmin(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleClientLogout = async () => {
    await auth.signOut();
    setClient(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Главная',  },
    { to: '/services', label: 'Услуги',  },
    { to: '/contacts', label: 'Контакты',  },
    { to: '/about', label: 'О нас',  }
  ];

  return (
    <>
      <header className={`luxuryHeader ${isScrolled ? 'luxuryHeaderScrolled' : ''}`}>
        <div className="luxuryHeaderContainer">
          <Link to="/" className="luxuryLogo">
            <div className="luxuryLogoIcon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 4L4 12L20 20L36 12L20 4Z" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20L20 28L36 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 28L20 36L36 28" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4A7FA7"/>
                    <stop offset="100%" stopColor="#B3CFE5"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="luxuryLogoPulse"></div>
            </div>
            <div className="luxuryLogoText">
              <span className="luxuryLogoMain">ВетСервис</span>
              <span className="luxuryLogoSub">Ветеринарный кабинет</span>
            </div>
          </Link>

          <nav className={`luxuryNav ${isMobileMenuOpen ? 'luxuryNavOpen' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`luxuryNavLink ${activeLink === link.to ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="luxuryNavIcon">{link.icon}</span>
                <span className="luxuryNavLabel">{link.label}</span>
                <span className="luxuryNavGlow"></span>
              </Link>
            ))}
            
            {/* ТОЛЬКО ДЛЯ АДМИНА */}
            {admin && (
              <>
                <Link to="/admin" className="luxuryNavLink adminSpecial" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="luxuryNavLabel">Админ панель</span>
                  <span className="luxuryNavGlow"></span>
                </Link>
                <button onClick={handleAdminLogout} className="luxuryButton luxuryButtonOutline">
                  <span>Выйти</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
            
            {/* ТОЛЬКО ДЛЯ КЛИЕНТОВ (НЕ АДМИН) */}
            {!admin && client && (
              <>
                <Link to="/dashboard" className="luxuryNavLink" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="luxuryNavLabel">Личный кабинет</span>
                  <span className="luxuryNavGlow"></span>
                </Link>
                <button onClick={handleClientLogout} className="luxuryButton luxuryButtonOutline">
                  <span>Выйти</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
            
            {/* ЕСЛИ НЕТ НИ АДМИНА, НИ КЛИЕНТА */}
            {!admin && !client && (
              <div className="luxuryAuthButtons">
                <Link to="/client-login" className="luxuryButton luxuryButtonSecondary">
                  <span>Вход для клиентов</span>
                </Link>
                <Link to="/login" className="luxuryButton luxuryButtonPrimary">
                  <span>Администратор</span>
                </Link>
              </div>
            )}
          </nav>

          <button 
            className={`luxuryMenuBtn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header> 
      
      <div className="luxuryHeaderDecoration"></div>
    </>
  );
}

export default Header;