import React, { useState, useEffect } from 'react';
import { addDoc, petsCollection } from '../firebase';
import { auth } from '../firebase';

function PetPassportForm({ onPetAdded }) {
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    petColor: '',
    ownerName: '',
    ownerPhone: '',
    ownerAddress: '',
    medicalNotes: ''
  });

  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        alert('Для создания паспорта необходимо войти в аккаунт');
        window.location.href = '/login';
      } else {
        setUser(currentUser);
        // Автоматически заполняем данные владельца из аккаунта
        setFormData(prev => ({
          ...prev,
          ownerName: currentUser.displayName || '',
          ownerPhone: '',
          ownerAddress: ''
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const animalTypes = [
    'Собака', 'Кошка', 'Попугай', 'Хомяк', 'Морская свинка',
    'Кролик', 'Хорек', 'Рыбка', 'Черепаха', 'Ящерица',
    'Крыса', 'Мышь', 'Енот', 'Лиса', 'Другое'
  ];

  const normalizePhone = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[\s\(\)\-]/g, '');
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

  const validatePhone = (phone) => {
    if (!phone) return 'Поле обязательно для заполнения';
    const normalized = normalizePhone(phone);
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!phoneRegex.test(normalized)) {
      return 'Введите корректный номер телефона (например: +79123456789)';
    }
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Поле обязательно для заполнения';
    const nameRegex = /^[А-Яа-яЁёA-Za-z\s\-]+$/;
    if (!nameRegex.test(name)) {
      return 'Имя должно содержать только буквы, пробелы и дефисы';
    }
    return '';
  };

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
    setFormData({
      ...formData,
      ownerPhone: formattedValue
    });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const error = validateName(value);
    setNameError(error);
    setFormData({
      ...formData,
      ownerName: value
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'ownerName') {
      setNameError(validateName(e.target.value));
    }
    if (e.target.name === 'ownerPhone') {
      setPhoneError(validatePhone(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Дополнительная проверка авторизации
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Для создания паспорта необходимо войти в аккаунт');
      window.location.href = '/login';
      return;
    }
    
    const phoneValid = !validatePhone(formData.ownerPhone);
    const nameValid = !validateName(formData.ownerName);
    
    if (!formData.petName) {
      alert('Пожалуйста, введите кличку питомца');
      return;
    }
    if (!formData.petType) {
      alert('Пожалуйста, выберите вид животного');
      return;
    }
    if (!nameValid) {
      alert('Пожалуйста, введите корректное ФИО владельца');
      return;
    }
    if (!phoneValid) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      const normalizedPhone = normalizePhone(formData.ownerPhone);
      
      await addDoc(petsCollection, {
        petName: formData.petName.trim(),
        petType: formData.petType,
        petBreed: formData.petBreed.trim(),
        petAge: formData.petAge.trim(),
        petColor: formData.petColor.trim(),
        ownerName: formData.ownerName.trim(),
        ownerPhone: normalizedPhone,
        ownerAddress: formData.ownerAddress.trim(),
        medicalNotes: formData.medicalNotes.trim(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email
      });
      
      alert('Паспорт питомца успешно создан');
      
      setFormData({
        petName: '',
        petType: '',
        petBreed: '',
        petAge: '',
        petColor: '',
        ownerName: currentUser.displayName || '',
        ownerPhone: '',
        ownerAddress: '',
        medicalNotes: ''
      });
      setPhoneError('');
      setNameError('');
      
      onPetAdded();
    } catch (error) {
      console.error('Ошибка при создании:', error);
      alert('Ошибка при создании паспорта: ' + error.message);
    }
  };

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <div className="loginRequiredCard">
        <p>Для создания паспорта питомца необходимо войти в аккаунт</p>
        <button className="loginRequiredBtn" onClick={() => window.location.href = '/login'}>
          Войти в аккаунт
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="formGrid">
        <div className="inputGroup">
          <label className="inputLabel">Кличка питомца *</label>
          <input
            type="text"
            name="petName"
            className="inputField"
            value={formData.petName}
            onChange={handleChange}
            required
            placeholder="Например: Бобик"
          />
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Вид животного *</label>
          <select
            name="petType"
            className="inputField"
            value={formData.petType}
            onChange={handleChange}
            required
          >
            <option value="">Выберите вид животного</option>
            {animalTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Порода</label>
          <input
            type="text"
            name="petBreed"
            className="inputField"
            value={formData.petBreed}
            onChange={handleChange}
            placeholder="Например: Немецкая овчарка"
          />
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Возраст</label>
          <input
            type="text"
            name="petAge"
            className="inputField"
            value={formData.petAge}
            onChange={handleChange}
            placeholder="Например: 3 года или 6 месяцев"
          />
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Окрас</label>
          <input
            type="text"
            name="petColor"
            className="inputField"
            value={formData.petColor}
            onChange={handleChange}
            placeholder="Например: Черный с белыми пятнами"
          />
        </div>

        <div className="inputGroup">
          <label className="inputLabel">ФИО владельца *</label>
          <input
            type="text"
            name="ownerName"
            className={`inputField ${nameError ? 'inputError' : ''}`}
            value={formData.ownerName}
            onChange={handleNameChange}
            required
            placeholder="Иванов Иван Иванович"
          />
          {nameError && <div className="errorText">{nameError}</div>}
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Телефон владельца *</label>
          <input
            type="tel"
            name="ownerPhone"
            className={`inputField ${phoneError ? 'inputError' : ''}`}
            value={formData.ownerPhone}
            onChange={handlePhoneChange}
            required
            placeholder="+7 999 123 45 67"
          />
          {phoneError && <div className="errorText">{phoneError}</div>}
          <div className="hintText">Пример: +7 999 123 45 67 или 89123456789</div>
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Адрес</label>
          <input
            type="text"
            name="ownerAddress"
            className="inputField"
            value={formData.ownerAddress}
            onChange={handleChange}
            placeholder="г. Москва, ул. Примерная, д. 1"
          />
        </div>

        <div className="inputGroup">
          <label className="inputLabel">Медицинские заметки</label>
          <textarea
            name="medicalNotes"
            className="inputField"
            rows="3"
            value={formData.medicalNotes}
            onChange={handleChange}
            placeholder="Прививки, аллергии, хронические заболевания..."
          />
        </div>
      </div>

      <button type="submit" className="submitButton">
        Создать паспорт
      </button>
    </form>
  );
}

export default PetPassportForm;