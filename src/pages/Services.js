import React, { useState, useEffect } from 'react';
import { servicesCollection, getDocs } from '../firebase';
import BookingModal from '../components/BookingModal';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const snapshot = await getDocs(servicesCollection);
      const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesData);
      
      const uniqueCategories = ['all', ...new Set(servicesData.map(s => s.category).filter(c => c))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = filterCategory === 'all' 
    ? services 
    : services.filter(service => service.category === filterCategory);

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  return (
    <div className="servicesPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Наши услуги</h1>
        <p className="pageSubtitle">Профессиональная помощь вашим питомцам</p>
      </div>

      <div className="servicesFilter">
        <div className="filterContainer">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filterChip ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'Все услуги' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loadingServices">Загрузка услуг...</div>
      ) : (
        <div className="servicesGrid">
          {filteredServices.map((service) => (
            <div key={service.id} className="serviceCard">
              <div className="serviceIcon">{service.icon || ''}</div>
              <h3 className="serviceName">{service.name}</h3>
              <div className="servicePrice">{service.price}</div>
              {service.duration && (
                <div className="serviceDuration">⏱ {service.duration} мин</div>
              )}
              <p className="serviceDescription">{service.description || 'Профессиональная помощь в нашей клинике'}</p>
              <button className="bookServiceBtn" onClick={() => handleBookService(service)}>
                Записаться
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredServices.length === 0 && !loading && (
        <div className="noServicesMessage">
          Нет услуг в выбранной категории
        </div>
      )}

      {showModal && selectedService && (
        <BookingModal 
          service={selectedService}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Services;