import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, db, doc, setDoc } from '../firebase';
import { useNavigate } from 'react-router-dom';

function ClientRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Вход существующего клиента
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard'); // Перенаправляем в личный кабинет
      } else {
        // Регистрация нового клиента
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: name,
          email: email,
          phone: phone,
          role: 'client',
          createdAt: new Date().toISOString()
        });
        navigate('/dashboard'); // Перенаправляем в личный кабинет
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('Пользователь не найден');
      else if (err.code === 'auth/wrong-password') setError('Неверный пароль');
      else if (err.code === 'auth/email-already-in-use') setError('Email уже используется');
      else if (err.code === 'auth/invalid-email') setError('Неверный формат email');
      else if (err.code === 'auth/weak-password') setError('Пароль должен быть не менее 6 символов');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Введите email для сброса пароля');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError('Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clientRegisterOverlay">
      <div className="clientRegisterModal">
        <div className="clientRegisterHeader">
          <h2>{isLogin ? 'Вход в личный кабинет' : 'Регистрация'}</h2>
        </div>

        {resetSent ? (
          <div className="resetSentMessage">
            <p>Письмо для сброса пароля отправлено на {email}</p>
            <button onClick={() => setResetSent(false)}>Вернуться ко входу</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="clientRegisterForm">
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="errorMessageForm">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>
        )}

        <div className="clientRegisterFooter">
          {!resetSent && (
            <button className="switchAuthBtn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          )}
          {isLogin && !resetSent && (
            <button className="resetPasswordBtn" onClick={handleResetPassword}>
              Забыли пароль?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientRegister;