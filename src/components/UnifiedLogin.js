import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { auth, signInWithEmailAndPassword, db, doc, getDoc } from '../firebase';

function UnifiedLogin({ setAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Проверяем, админ ли это
      if (user.email === 'admin@vetmaster.com') {
        setAdmin(user);
        navigate('/admin');
      } else {
        // Проверяем, существует ли пользователь в коллекции users
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          navigate('/dashboard');
        } else {
          setError('Аккаунт не найден. Пожалуйста, зарегистрируйтесь.');
          await auth.signOut();
        }
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Пользователь не найден. Зарегистрируйтесь, если у вас нет аккаунта.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Неверный пароль');
      } else if (err.code === 'auth/invalid-email') {
        setError('Неверный формат email');
      } else {
        setError('Ошибка входа. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Вход | ВетСервис</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="unifiedLoginContainer">
        <div className="unifiedLoginCard">
          <div className="unifiedLoginHeader">
            <div className="unifiedLoginLogo">
              <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
                <path d="M20 4L4 12L20 20L36 12L20 4Z" stroke="#4A7FA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20L20 28L36 20" stroke="#4A7FA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 28L20 36L36 28" stroke="#4A7FA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="unifiedLoginTitle">Вход в систему</h1>
            <p className="unifiedLoginSubtitle">Введите email и пароль</p>
          </div>

          <form onSubmit={handleLogin} className="unifiedLoginForm">
            <div className="unifiedInputGroup">
              <label className="unifiedInputLabel">Email</label>
              <input
                type="email"
                className="unifiedInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@mail.ru"
              />
            </div>

            <div className="unifiedInputGroup">
              <label className="unifiedInputLabel">Пароль</label>
              <input
                type="password"
                className="unifiedInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && <div className="unifiedError">{error}</div>}

            <button type="submit" className="unifiedLoginButton" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="unifiedLoginFooter">
            <p>
              Нет аккаунта? <a href="/client-login">Зарегистрироваться</a>
            </p>
            <button 
              className="unifiedBackBtn"
              onClick={() => window.location.href = '/'}
            >
              ← Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnifiedLogin;