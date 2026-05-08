import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { servicesCollection, getDocs } from '../firebase';
import BookingModal from '../components/BookingModal';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['all']);
  const cardsRef = useRef([]);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [services, filterCategory, searchQuery]);

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

  const filteredServices = services.filter(service => {
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesSearch = !searchQuery.trim() || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const defaultServices = [
    { name: 'Прием терапевта', price: 'от 1000 ₽', description: 'Осмотр, диагностика, назначение лечения. Опытные врачи с 10-летним стажем.', duration: '30 мин', category: 'Диагностика' },
    { name: 'Вакцинация', price: 'от 800 ₽', description: 'Прививки для кошек и собак. Только импортные вакцины.', duration: '20 мин', category: 'Вакцинация' },
    { name: 'Лаборатория', price: 'от 500 ₽', description: 'Анализы крови, мочи, цитология. Быстрые результаты.', duration: '15 мин', category: 'Лаборатория' },
    { name: 'УЗИ диагностика', price: 'от 1500 ₽', description: 'Ультразвуковое исследование органов. Расшифровка сразу.', duration: '30 мин', category: 'Диагностика' },
    { name: 'Стоматология', price: 'от 2000 ₽', description: 'Лечение зубов и полости рта. Профессиональная чистка.', duration: '45 мин', category: 'Стоматология' },
    { name: 'Выезд на дом', price: 'от 1500 ₽', description: 'Ветеринарная помощь на дому. Экономия вашего времени.', duration: '60 мин', category: 'Уход' },
    { name: 'Хирургия', price: 'от 5000 ₽', description: 'Операции любой сложности. Современная анестезия.', duration: '90 мин', category: 'Хирургия' },
    { name: 'Лечение', price: 'от 1000 ₽', description: 'Комплексное лечение заболеваний любой сложности.', duration: '30 мин', category: 'Лечение' }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <>
      <Helmet>
        <title>Услуги | ВетСервис - Ветеринарная клиника в Старой Руссе</title>
        <meta name="description" content="Услуги ветеринарной клиники ВетСервис: прием терапевта, вакцинация, хирургия, УЗИ-диагностика, лабораторные анализы. Доступные цены от 500 ₽." />
      </Helmet>

      <div className="servicesPageModern">
        {/* Hero секция */}
        <div className="servicesHeroModern">
          <div className="servicesHeroContentModern">
            <h1 className="servicesHeroTitleModern">Наши услуги</h1>
            <p className="servicesHeroSubtitleModern">Профессиональная помощь вашим питомцам</p>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="servicesFilterModern">
          <div className="searchBoxModern">
            <svg className="searchIconModern" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="searchInputModern"
              placeholder="Поиск услуги..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="searchClearModern" onClick={clearSearch}>✕</button>
            )}
          </div>

          <div className="filterContainerModern">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filterChipModern ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat === 'all' ? 'Все услуги' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка услуг */}
        {loading ? (
          <div className="loadingServicesModern">Загрузка услуг...</div>
        ) : filteredServices.length === 0 ? (
          <div className="noServicesFoundModern">
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поисковый запрос</p>
            <button className="resetFiltersBtnModern" onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="servicesGridModern">
            {filteredServices.map((service, idx) => (
              <div 
                key={service.id || idx} 
                className="serviceCardModern" 
                ref={el => cardsRef.current[idx] = el}
              >
                <div className="serviceCardHeader">
                  <h3 className="serviceNameModern">{service.name}</h3>
                  <div className="servicePriceModern">{service.price}</div>
                </div>
                <div className="serviceDurationModern">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {service.duration || '30 мин'}
                </div>
                <p className="serviceDescriptionModern">{service.description || 'Профессиональная помощь в нашей клинике'}</p>
                <button className="bookServiceBtnModern" onClick={() => handleBookService(service)}>
                  Записаться
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CTA Блок */}
        <div className="servicesCtaModern">
          <div className="servicesCtaContentModern">
            <h2>Не нашли нужную услугу?</h2>
            <p>Свяжитесь с нами, и мы подберем индивидуальное решение</p>
            <button className="servicesCtaBtnModern" onClick={() => window.location.href = '/contacts'}>
              Связаться с нами
            </button>
          </div>
        </div>

        {showModal && selectedService && (
          <BookingModal service={selectedService} onClose={() => setShowModal(false)} />
        )}
      </div>
    </>
  );
}

export default Services;