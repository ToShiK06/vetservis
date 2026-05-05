import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { auth, db, appointmentsCollection, petsCollection, getDocs, query, where, deleteDoc, doc, getDoc } from '../firebase';
import ClientPetPassport from '../components/ClientPetPassport';

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [userData, setUserData] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPassport, setShowPassport] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        email: user.email,
        uid: user.uid
      });
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userPhoneNumber = userDoc.data().phone;
        setUserPhone(userPhoneNumber);
        await loadPets(userPhoneNumber);
      }
    }
    await loadAppointments();
    setLoading(false);
  };

  const loadAppointments = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(appointmentsCollection, where('clientEmail', '==', user.email));
      const snapshot = await getDocs(q);
      const appointmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      appointmentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    }
  };

  const loadPets = async (phoneNumber) => {
    if (!phoneNumber) return;
    
    try {
      const normalizedPhone = phoneNumber.replace(/[\s\(\)\-]/g, '');
      const q = query(petsCollection, where('ownerPhone', '==', normalizedPhone));
      const snapshot = await getDocs(q);
      const petsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsData);
    } catch (error) {
      console.error('Ошибка загрузки питомцев:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('Отменить запись?')) {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      loadAppointments();
    }
  };

  const openPassport = (pet) => {
    setSelectedPet(pet);
    setShowPassport(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="statusBadge confirmed">Подтверждена</span>;
      case 'completed': return <span className="statusBadge completed">Выполнена</span>;
      case 'cancelled': return <span className="statusBadge cancelled">Отменена</span>;
      default: return <span className="statusBadge pending">Ожидает</span>;
    }
  };

  if (loading) {
    return <div className="loadingServices">Загрузка...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Личный кабинет | ВетСервис - Ветеринарная клиника</title>
        <meta name="description" content="Личный кабинет клиента ветеринарной клиники ВетСервис. Просмотр записей на прием, электронные паспорта питомцев, история обращений." />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Личный кабинет - ВетСервис" />
        <meta property="og:description" content="Управляйте записями и паспортами ваших питомцев в личном кабинете." />
      </Helmet>

      <div className="clientDashboard">
        <div className="pageHeader">
          <h1 className="pageTitle">Личный кабинет</h1>
          <p className="pageSubtitle">Добро пожаловать, {userData?.email}</p>
        </div>

        <div className="dashboardTabs">
          <button className={`dashboardTab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            Мои записи
          </button>
          <button className={`dashboardTab ${activeTab === 'pets' ? 'active' : ''}`} onClick={() => setActiveTab('pets')}>
            Мои питомцы
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className="dashboardAppointments">
            {appointments.length === 0 ? (
              <div className="noAppointments">
                <p>У вас пока нет записей</p>
                <button className="bookBtn" onClick={() => window.location.href = '/services'}>Записаться</button>
              </div>
            ) : (
              appointments.map(app => (
                <div key={app.id} className="dashboardAppointmentCard">
                  <div className="appointmentInfo">
                    <h3>{app.serviceName}</h3>
                    <p><strong>Дата:</strong> {app.bookingDate}</p>
                    <p><strong>Время:</strong> {app.bookingTime}</p>
                    <p><strong>Цена:</strong> {app.servicePrice}</p>
                    {app.petName && <p><strong>Питомец:</strong> {app.petName}</p>}
                  </div>
                  <div className="appointmentStatus">
                    {getStatusBadge(app.status)}
                    {app.status !== 'cancelled' && app.status !== 'completed' && (
                      <button className="cancelAppointmentBtn" onClick={() => cancelAppointment(app.id)}>
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'pets' && (
          <div className="dashboardPets">
            {pets.length === 0 ? (
              <div className="noPets">
                <p>У вас пока нет зарегистрированных питомцев</p>
                <p className="hintText">При создании паспорта питомца введите ваш номер телефона, и питомец появится здесь</p>
              </div>
            ) : (
              <div className="clientPetsGrid">
                {pets.map(pet => (
                  <div key={pet.id} className="dashboardPetCard">
                    <h3>{pet.petName}</h3>
                    <p><strong>Вид:</strong> {pet.petType}</p>
                    <p><strong>Порода:</strong> {pet.petBreed || '-'}</p>
                    <p><strong>Возраст:</strong> {pet.petAge || '-'}</p>
                    <p><strong>Окрас:</strong> {pet.petColor || '-'}</p>
                    <p><strong>Владелец:</strong> {pet.ownerName}</p>
                    <button className="viewPassportBtn" onClick={() => openPassport(pet)}>
                      Смотреть паспорт
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showPassport && selectedPet && (
          <ClientPetPassport 
            pet={selectedPet}
            onClose={() => setShowPassport(false)}
          />
        )}
      </div>
    </>
  );
}

export default ClientDashboard;