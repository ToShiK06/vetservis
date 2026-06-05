import React, { useState, useEffect } from 'react';
import { db, appointmentsCollection, getDocs, deleteDoc, doc, updateDoc, query, where } from '../firebase';

function AdminRequests() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      let q = appointmentsCollection;
      if (filter !== 'all') {
        q = query(appointmentsCollection, where('status', '==', filter));
      }
      const snapshot = await getDocs(q);
      const appointmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      appointmentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Удалить запись?')) {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      await loadAppointments();
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    await updateDoc(doc(db, 'appointments', appointmentId), { 
      status: newStatus,
      statusUpdatedAt: new Date().toISOString()
    });
    await loadAppointments();
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="requestStatusBadge confirmed">Подтверждена</span>;
      case 'pending':
        return <span className="requestStatusBadge pending">Ожидает</span>;
      case 'completed':
        return <span className="requestStatusBadge completed">Выполнена</span>;
      case 'cancelled':
        return <span className="requestStatusBadge cancelled">Отменена</span>;
      default:
        return <span className="requestStatusBadge pending">Новая</span>;
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'pending', label: 'Ожидает', color: '#ffc107' },
      { value: 'confirmed', label: 'Подтверждена', color: '#28a745' },
      { value: 'completed', label: 'Выполнена', color: '#4A7FA7' },
      { value: 'cancelled', label: 'Отменена', color: '#dc3545' }
    ];
  };

  if (loading) {
    return <div className="adminLoading">Загрузка записей...</div>;
  }

  return (
    <div className="adminRequestsSection">
      <div className="requestsHeader">
        <h2 className="sectionTitle">Записи на прием</h2>
        <div className="filterButtons">
          <button className={`filterBtn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Все ({appointments.length})
          </button>
          <button className={`filterBtn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
            Ожидают ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button className={`filterBtn ${filter === 'confirmed' ? 'active' : ''}`} onClick={() => setFilter('confirmed')}>
            Подтвержденные ({appointments.filter(a => a.status === 'confirmed').length})
          </button>
          <button className={`filterBtn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
            Выполненные ({appointments.filter(a => a.status === 'completed').length})
          </button>
          <button className={`filterBtn ${filter === 'cancelled' ? 'active' : ''}`} onClick={() => setFilter('cancelled')}>
            Отмененные ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>
      </div>
      
      {appointments.length === 0 ? (
        <div className="noRequests">Нет записей на прием</div>
      ) : (
        <div className="requestsList">
          {appointments.map(appointment => (
            <div key={appointment.id} className="requestCard">
              <div className="requestHeader">
                <div className="requestClient">
                  <strong>{appointment.clientName}</strong>
                  <span className="requestPhone">{appointment.clientPhone}</span>
                </div>
                <select
                  className={`statusSelectRequest ${appointment.status || 'pending'}`}
                  value={appointment.status || 'pending'}
                  onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                >
                  <option value="pending">Ожидает</option>
                  <option value="confirmed">Подтверждена</option>
                  <option value="completed">Выполнена</option>
                  <option value="cancelled">Отменена</option>
                </select>
              </div>
              
              <div className="requestDetails">
                <p><strong>Услуга:</strong> {appointment.serviceName}</p>
                <p><strong>Дата:</strong> {appointment.bookingDate}</p>
                <p><strong>Время:</strong> {appointment.bookingTime}</p>
                {appointment.petName && <p><strong>Питомец:</strong> {appointment.petName} {appointment.petType ? `(${appointment.petType})` : ''}</p>}
                {appointment.message && <p><strong>Сообщение:</strong> {appointment.message}</p>}
                <p className="requestDate"><strong>Дата заявки:</strong> {new Date(appointment.createdAt).toLocaleString('ru-RU')}</p>
                {appointment.statusUpdatedAt && (
                  <p className="requestDate"><strong>Статус изменен:</strong> {new Date(appointment.statusUpdatedAt).toLocaleString('ru-RU')}</p>
                )}
              </div>
              
              <div className="requestActions">
                <button onClick={() => handleDelete(appointment.id)} className="deleteRequestButton">
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRequests;