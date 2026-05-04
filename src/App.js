import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import About from './pages/About';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './firebase';
import './App.css';
import ClientDashboard from './pages/ClientDashboard';
import ClientRegister from './components/ClientRegister';

// Компонент для отслеживания скролла
function ScrollProgress() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollWidth(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="scrollProgress" style={{ width: `${scrollWidth}%` }}></div>;
}

// Компонент для анимации страниц
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Жесткая проверка: админ только если email = admin@vetmaster.com
        if (user.email === 'admin@vetmaster.com') {
          console.log('Админ вошел:', user.email);
          setAdmin(user);
        } else {
          console.log('Клиент вошел:', user.email);
          setAdmin(null); // Важно! Обычный клиент - не админ
        }
      } else {
        console.log('Пользователь не авторизован');
        setAdmin(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="appContainer">
        <div className="loadingScreen">
          <div className="loadingSpinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="appContainer">
        <ScrollProgress />
        <ScrollToTop />
        <Header admin={admin} setAdmin={setAdmin} />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login setAdmin={setAdmin} />} />
            <Route path="/admin" element={
              <PrivateRoute admin={admin}>
                <AdminPanel setAdmin={setAdmin} />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/client-login" element={<ClientRegister />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;