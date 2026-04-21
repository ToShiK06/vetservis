import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Header({ admin, setAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setAdmin(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/services', label: 'Услуги' },
    { to: '/contacts', label: 'Контакты' },
    { to: '/about', label: 'О нас' }
  ];

  return (
    <header className={`header ${isScrolled ? 'headerScrolled' : ''}`}>
      <div className="headerContainer">
        <Link to="/" className="logo">
          ВетСервис
        </Link>

        <nav className={`navigation ${isMobileMenuOpen ? 'navigationOpen' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="navLink"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {admin ? (
            <>
              <Link to="/admin" className="navLink adminLink" onClick={() => setIsMobileMenuOpen(false)}>
                Админ панель
              </Link>
              <button onClick={handleLogout} className="navButton">
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" className="navButton" onClick={() => setIsMobileMenuOpen(false)}>
              Вход для админа
            </Link>
          )}
        </nav>

        <button 
          className={`mobileMenuBtn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;