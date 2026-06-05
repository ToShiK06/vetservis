import React, { useState, useEffect } from 'react';
import { db, servicesCollection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '../firebase';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    duration: '30',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Диагностика',
    'Лечение',
    'Хирургия',
    'Вакцинация',
    'Лаборатория',
    'Стоматология',
    'Уход',
    'Другое'
  ];

  const statuses = [
    { value: 'active', label: 'Активна', color: '#28a745' },
    { value: 'pending', label: 'Ожидание', color: '#ffc107' },
    { value: 'inactive', label: 'Неактивна', color: '#dc3545' }
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const snapshot = await getDocs(servicesCollection);
      const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      servicesData.sort((a, b) => {
        const statusOrder = { active: 1, pending: 2, inactive: 3 };
        return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
      });
      setServices(servicesData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), formData);
        alert('Услуга обновлена');
      } else {
        await addDoc(servicesCollection, {
          ...formData,
          createdAt: new Date().toISOString()
        });
        alert('Услуга добавлена');
      }
      
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        duration: '30',
        status: 'active'
      });
      setEditingService(null);
      await loadServices();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price,
      description: service.description || '',
      category: service.category || '',
      duration: service.duration || '30',
      status: service.status || 'active'
    });
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Удалить услугу?')) {
      await deleteDoc(doc(db, 'services', serviceId));
      await loadServices();
    }
  };

  const handleStatusChange = async (serviceId, newStatus) => {
    await updateDoc(doc(db, 'services', serviceId), { status: newStatus });
    await loadServices();
  };

  const handleCancel = () => {
    setEditingService(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      duration: '30',
      status: 'active'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="serviceStatusBadge active">Активна</span>;
      case 'pending':
        return <span className="serviceStatusBadge pending">Ожидание</span>;
      case 'inactive':
        return <span className="serviceStatusBadge inactive">Неактивна</span>;
      default:
        return <span className="serviceStatusBadge pending">Ожидание</span>;
    }
  };

  return (
    <div className="adminServicesSection">
      <div className="serviceFormSection">
        <h3 className="sectionTitle">{editingService ? 'Редактировать услугу' : 'Добавить услугу'}</h3>
        <form onSubmit={handleSubmit} className="serviceForm">
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Название услуги *</label>
              <input
                type="text"
                name="name"
                className="formInput"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Например: Прием терапевта"
              />
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Цена *</label>
              <input
                type="text"
                name="price"
                className="formInput"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Например: 1000 руб или от 1000 руб"
              />
            </div>
          </div>
          
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Категория</label>
              <select
                name="category"
                className="formInput"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="formGroup">
              <label className="formLabel">Длительность (мин)</label>
              <select
                name="duration"
                className="formInput"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="15">15 минут</option>
                <option value="30">30 минут</option>
                <option value="45">45 минут</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут</option>
                <option value="120">120 минут</option>
              </select>
            </div>
          </div>
          
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Статус</label>
              <select
                name="status"
                className="formInput"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div className="formGroup"></div>
          </div>
          
          <div className="formGroup">
            <label className="formLabel">Описание</label>
            <textarea
              name="description"
              className="formTextarea"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Подробное описание услуги..."
            />
          </div>
          
          <div className="formButtons">
            <button type="submit" className="submitButton" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : (editingService ? 'Обновить' : 'Добавить')}
            </button>
            {editingService && (
              <button type="button" className="cancelButton" onClick={handleCancel}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="servicesListSection">
        <h3 className="sectionTitle">Список услуг</h3>
        {loading ? (
          <div className="adminLoading">Загрузка...</div>
        ) : services.length === 0 ? (
          <div className="noServices">Нет добавленных услуг</div>
        ) : (
          <div className="servicesTableWrapper">
            <table className="servicesTable">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Категория</th>
                  <th>Длительность</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                      {service.description && <div className="serviceDescSmall">{service.description.substring(0, 50)}...</div>}
                    </td>
                    <td className="servicePriceCell">{service.price}</td>
                    <td>{service.category || '-'}</td>
                    <td>{service.duration} мин</td>
                    <td>
                      <select
                        className={`statusSelect ${service.status || 'pending'}`}
                        value={service.status || 'pending'}
                        onChange={(e) => handleStatusChange(service.id, e.target.value)}
                      >
                        <option value="active">Активна</option>
                        <option value="pending">Ожидание</option>
                        <option value="inactive">Неактивна</option>
                      </select>
                    </td>
                    <td className="serviceActionsCell">
                      <button className="editServiceBtn" onClick={() => handleEdit(service)}>
                        Редактировать
                      </button>
                      <button className="deleteServiceBtn" onClick={() => handleDelete(service.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminServices;