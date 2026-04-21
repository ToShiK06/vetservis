import React, { useState, useEffect } from 'react';
import { db, requestsCollection, getDocs, deleteDoc, doc } from '../firebase';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const snapshot = await getDocs(requestsCollection);
      const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      requestsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(requestsData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Удалить заявку?')) {
      await deleteDoc(doc(db, 'requests', requestId));
      await loadRequests();
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new':
        return <span className="statusBadge new">Новая</span>;
      case 'processed':
        return <span className="statusBadge processed">Обработана</span>;
      default:
        return <span className="statusBadge new">Новая</span>;
    }
  };

  if (loading) {
    return <div className="adminLoading">Загрузка заявок...</div>;
  }

  return (
    <div className="adminRequestsSection">
      <h2 className="sectionTitle">Заявки от клиентов</h2>
      {requests.length === 0 ? (
        <div className="noRequests">Нет заявок</div>
      ) : (
        <div className="requestsList">
          {requests.map(request => (
            <div key={request.id} className="requestCard">
              <div className="requestHeader">
                <div className="requestClient">
                  <strong>{request.clientName}</strong>
                  <span className="requestPhone">{request.clientPhone}</span>
                </div>
                {getStatusBadge(request.status)}
              </div>
              
              <div className="requestDetails">
                <p><strong>Услуга:</strong> {request.serviceType}</p>
                {request.petName && <p><strong>Питомец:</strong> {request.petName} ({request.petType || 'не указан'})</p>}
                {request.preferredDate && <p><strong>Желаемая дата:</strong> {request.preferredDate}</p>}
                {request.preferredTime && <p><strong>Желаемое время:</strong> {request.preferredTime}</p>}
                {request.message && <p><strong>Сообщение:</strong> {request.message}</p>}
                <p className="requestDate"><strong>Дата заявки:</strong> {new Date(request.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              
              <div className="requestActions">
                <button onClick={() => handleDelete(request.id)} className="deleteRequestButton">
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