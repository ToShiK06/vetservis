import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase';

function Login({ setAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setAdmin(userCredential.user);
      navigate('/admin');
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <>
      <Helmet>
        <title>Вход для администратора | ВетСервис</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Страница входа в административную панель ветеринарной клиники ВетСервис. Только для авторизованных сотрудников." />
      </Helmet>

      <div className="loginContainer">
        <div className="loginCard">
          <h2 className="loginTitle">Вход для администратора</h2>
          <form onSubmit={handleLogin}>
            <div className="inputGroup">
              <label className="inputLabel">Email</label>
              <input
                type="email"
                className="inputField"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="inputGroup">
              <label className="inputLabel">Пароль</label>
              <input
                type="password"
                className="inputField"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="loginButton">
              Войти
            </button>
            {error && <div className="errorMessage">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;