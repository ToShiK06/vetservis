import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function EditPetModal({ pet, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    petName: pet.petName || '',
    petType: pet.petType || '',
    petBreed: pet.petBreed || '',
    petAge: pet.petAge || '',
    petColor: pet.petColor || '',
    ownerName: pet.ownerName || '',
    ownerPhone: pet.ownerPhone || '',
    ownerAddress: pet.ownerAddress || '',
    medicalNotes: pet.medicalNotes || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const petRef = doc(db, 'pets', pet.id);
      await updateDoc(petRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Ошибка обновления:', err);
      setError('Ошибка при сохранении');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent editPetModal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Редактировать паспорт питомца</h2>
          <button className="modalCloseBtn" onClick={onClose}>×</button>
        </div>

        {error && <div className="errorMessageForm">{error}</div>}

        <form onSubmit={handleSubmit} className="modalForm">
          <div className="formRow">
            <div className="formGroup">
              <label>Кличка питомца *</label>
              <input type="text" name="petName" value={formData.petName} onChange={handleChange} required />
            </div>
            <div className="formGroup">
              <label>Вид животного *</label>
              <input type="text" name="petType" value={formData.petType} onChange={handleChange} required />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Порода</label>
              <input type="text" name="petBreed" value={formData.petBreed} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label>Возраст</label>
              <input type="text" name="petAge" value={formData.petAge} onChange={handleChange} />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Окрас</label>
              <input type="text" name="petColor" value={formData.petColor} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label>ФИО владельца *</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Телефон владельца *</label>
              <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required />
            </div>
            <div className="formGroup">
              <label>Адрес</label>
              <input type="text" name="ownerAddress" value={formData.ownerAddress} onChange={handleChange} />
            </div>
          </div>

          <div className="formGroup">
            <label>Медицинские заметки</label>
            <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} rows="3" />
          </div>

          <div className="formButtons">
            <button type="submit" className="submitButton" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button type="button" className="cancelButton" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPetModal;