import React, { useState } from 'react';
import { addDoc, petsCollection } from '../firebase';

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

  // Список видов животных
  const animalTypes = [
    'Собака',
    'Кошка',
    'Попугай',
    'Хомяк',
    'Морская свинка',
    'Кролик',
    'Хорек',
    'Рыбка',
    'Черепаха',
    'Ящерица',
    'Крыса',
    'Мышь',
    'Енот',
    'Лиса',
    'Другое'
  ];

  // Валидация номера телефона (российские номера)
  const validatePhone = (phone) => {
    // Удаляем все пробелы, скобки, дефисы и плюсы
    const cleanPhone = phone.replace(/[\s\(\)\-]/g, '');
    
    // Регулярное выражение для российских номеров
    // Поддерживает: +7XXXXXXXXXX, 8XXXXXXXXXX, 7XXXXXXXXXX, 9XXXXXXXXXX
    const phoneRegex = /^(\+7|7|8)?9\d{9}$/;
    
    if (!phone) return 'Поле обязательно для заполнения';
    if (!phoneRegex.test(cleanPhone)) {
      return 'Введите корректный номер телефона (например: +79123456789 или 89123456789)';
    }
    return '';
  };

  // Валидация имени (только буквы, пробелы и дефисы)
  const validateName = (name) => {
    if (!name) return 'Поле обязательно для заполнения';
    const nameRegex = /^[А-Яа-яЁёA-Za-z\s\-]+$/;
    if (!nameRegex.test(name)) {
      return 'Имя должно содержать только буквы, пробелы и дефисы';
    }
    return '';
  };

  // Форматирование телефона при вводе
  const formatPhone = (value) => {
    // Удаляем все нецифровые символы
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
    
    // Очищаем ошибки при изменении полей
    if (e.target.name === 'ownerName') {
      setNameError(validateName(e.target.value));
    }
    if (e.target.name === 'ownerPhone') {
      setPhoneError(validatePhone(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка всех обязательных полей
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
      await addDoc(petsCollection, {
        petName: formData.petName.trim(),
        petType: formData.petType,
        petBreed: formData.petBreed.trim(),
        petAge: formData.petAge.trim(),
        petColor: formData.petColor.trim(),
        ownerName: formData.ownerName.trim(),
        ownerPhone: formData.ownerPhone.trim(),
        ownerAddress: formData.ownerAddress.trim(),
        medicalNotes: formData.medicalNotes.trim(),
        createdAt: new Date().toISOString()
      });
      
      alert('Паспорт питомца успешно создан');
      
      // Очистка формы
      setFormData({
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
      setPhoneError('');
      setNameError('');
      
      onPetAdded();
    } catch (error) {
      console.error('Ошибка при создании:', error);
      alert('Ошибка при создании паспорта: ' + error.message);
    }
  };

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
              <option key={type} value={type}>
                {type}
              </option>
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
          ></textarea>
        </div>
      </div>

      <button type="submit" className="submitButton">
        Создать паспорт
      </button>
    </form>
  );
}

export default PetPassportForm;