import React, { useState, useEffect } from 'react';
import { db, appointmentsCollection, getDocs, deleteDoc, doc, query, where } from '../firebase';

function AdminRequests() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

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

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="statusBadge confirmed">Подтверждено</span>;
      case 'pending':
        return <span className="statusBadge pending">Ожидает</span>;
      case 'completed':
        return <span className="statusBadge completed">Выполнено</span>;
      case 'cancelled':
        return <span className="statusBadge cancelled">Отменено</span>;
      default:
        return <span className="statusBadge pending">Новая</span>;
    }
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
            Все
          </button>
          <button className={`filterBtn ${filter === 'confirmed' ? 'active' : ''}`} onClick={() => setFilter('confirmed')}>
            Подтвержденные
          </button>
          <button className={`filterBtn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
            Ожидают
          </button>
          <button className={`filterBtn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
            Выполненные
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
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="requestDetails">
                <p><strong>Услуга:</strong> {appointment.serviceType}</p>
                <p><strong>Дата:</strong> {appointment.bookingDate}</p>
                <p><strong>Время:</strong> {appointment.bookingTime}</p>
                {appointment.petName && <p><strong>Питомец:</strong> {appointment.petName} ({appointment.petType || 'не указан'})</p>}
                {appointment.message && <p><strong>Сообщение:</strong> {appointment.message}</p>}
                <p className="requestDate"><strong>Дата заявки:</strong> {new Date(appointment.createdAt).toLocaleString('ru-RU')}</p>
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