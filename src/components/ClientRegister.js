import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, db, doc, setDoc } from '../firebase';
import { useNavigate } from 'react-router-dom';

function ClientRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  // Нормализация номера телефона в формат +7XXXXXXXXXX
  const normalizePhone = (phoneNumber) => {
    if (!phoneNumber) return '';
    let cleaned = phoneNumber.replace(/[\s\(\)\-]/g, '');
    cleaned = cleaned.replace('+', '');
    
    if (cleaned.startsWith('8')) {
      cleaned = '+7' + cleaned.slice(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('9')) {
      cleaned = '+7' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  // Валидация телефона
  const validatePhone = (phoneNumber) => {
    if (!phoneNumber && !isLogin) {
      return 'Поле обязательно для заполнения';
    }
    if (!phoneNumber) return '';
    
    const normalized = normalizePhone(phoneNumber);
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!phoneRegex.test(normalized)) {
      return 'Введите корректный номер телефона (например: +79123456789)';
    }
    return '';
  };

  // Форматирование телефона при вводе
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 1)} ${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhone(rawValue);
    const error = validatePhone(formattedValue);
    setPhoneError(error);
    setPhone(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        // Проверка телефона при регистрации
        const phoneValid = !validatePhone(phone);
        if (!phoneValid) {
          setError('Пожалуйста, введите корректный номер телефона');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: name,
          email: email,
          phone: normalizePhone(phone), // Сохраняем в нормализованном формате
          role: 'client',
          createdAt: new Date().toISOString()
        });
        navigate('/dashboard');
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
    <>
      <Helmet>
        <title>{isLogin ? 'Вход в личный кабинет' : 'Регистрация'} | ВетСервис</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Страница входа и регистрации в личном кабинете ветеринарной клиники ВетСервис. Только для зарегистрированных клиентов." />
      </Helmet>

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
                    placeholder="Ваше имя *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Телефон *"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={phoneError ? 'inputError' : ''}
                    required
                  />
                  {phoneError && <div className="errorText">{phoneError}</div>}
                </>
              )}
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль (минимум 6 символов) *"
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
    </>
  );
}

export default ClientRegister;