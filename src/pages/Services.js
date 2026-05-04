import React, { useState, useEffect, useRef } from 'react';
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

  // Фильтрация по категории и поиску
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
    { name: 'Прием терапевта', price: 'от 1000 ₽', description: 'Осмотр, диагностика, назначение лечения. Опытные врачи с 10-летним стажем.', duration: '30 мин', category: 'Диагностика', icon: '🏥' },
    { name: 'Вакцинация', price: 'от 800 ₽', description: 'Прививки для кошек и собак. Только импортные вакцины.', duration: '20 мин', category: 'Вакцинация', icon: '💉' },
    { name: 'Лаборатория', price: 'от 500 ₽', description: 'Анализы крови, мочи, цитология. Быстрые результаты.', duration: '15 мин', category: 'Лаборатория', icon: '🔬' },
    { name: 'УЗИ диагностика', price: 'от 1500 ₽', description: 'Ультразвуковое исследование органов. Расшифровка сразу.', duration: '30 мин', category: 'Диагностика', icon: '📊' },
    { name: 'Стоматология', price: 'от 2000 ₽', description: 'Лечение зубов и полости рта. Профессиональная чистка.', duration: '45 мин', category: 'Стоматология', icon: '🦷' },
    { name: 'Выезд на дом', price: 'от 1500 ₽', description: 'Ветеринарная помощь на дому. Экономия вашего времени.', duration: '60 мин', category: 'Уход', icon: '🏠' },
    { name: 'Хирургия', price: 'от 5000 ₽', description: 'Операции любой сложности. Современная анестезия.', duration: '90 мин', category: 'Хирургия', icon: '⚕️' },
    { name: 'Лечение', price: 'от 1000 ₽', description: 'Комплексное лечение заболеваний любой сложности.', duration: '30 мин', category: 'Лечение', icon: '💊' }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;
  const finalServices = displayServices.length > 0 ? filteredServices : [];

  return (
    <div className="servicesPageNew">
      {/* Hero секция */}
      <div className="servicesHero">
        <div className="servicesHeroContent">
          <h1 className="servicesHeroTitle">Наши услуги</h1>
          <p className="servicesHeroSubtitle">Профессиональная помощь вашим питомцам</p>
          <div className="servicesHeroStats">
            <div className="heroStat">
              <span className="heroStatValue">15+</span>
              <span className="heroStatLabel">лет опыта</span>
            </div>
            <div className="heroStat">
              <span className="heroStatValue">5000+</span>
              <span className="heroStatLabel">довольных клиентов</span>
            </div>
            <div className="heroStat">
              <span className="heroStatValue">24/7</span>
              <span className="heroStatLabel">круглосуточно</span>
            </div>
          </div>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="servicesFilterNew">
        {/* Строка поиска */}
        <div className="searchBoxNew">
          <svg className="searchIconNew" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="searchInputNew"
            placeholder="Поиск по названию, описанию или категории..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="searchClearNew" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>

        {/* Фильтр по категориям */}
        <div className="filterContainerNew">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filterChipNew ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'Все услуги' : cat}
            </button>
          ))}
        </div>

        {/* Результат поиска */}
        {searchQuery && (
          <div className="searchResultInfo">
            Найдено услуг: {filteredServices.length}
          </div>
        )}
      </div>

      {/* Сетка услуг */}
      {loading ? (
        <div className="loadingServicesNew">
          <div className="loader"></div>
          <p>Загрузка услуг...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="noServicesFoundNew">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
          <button className="resetFiltersBtn" onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}>
            Сбросить все фильтры
          </button>
        </div>
      ) : (
        <div className="servicesGridNew">
          {filteredServices.map((service, idx) => (
            <div 
              key={service.id || idx} 
              className="serviceCardNew" 
              ref={el => cardsRef.current[idx] = el}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="serviceCardFront">
                <div className="serviceIconWrapper">
                  <span className="serviceIconNew">{service.icon || ''}</span>
                </div>
                <h3 className="serviceNameNew">{service.name}</h3>
                <div className="servicePriceNew">{service.price}</div>
                <div className="serviceDurationNew">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {service.duration || '30 мин'}
                </div>
                <p className="serviceDescriptionNew">{service.description}</p>
                <button className="bookServiceBtnNew" onClick={() => handleBookService(service)}>
                  Записаться
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Блок */}
      <div className="servicesCta">
        <div className="servicesCtaContent">
          <h2>Не нашли нужную услугу?</h2>
          <p>Свяжитесь с нами, и мы подберем индивидуальное решение для вашего питомца</p>
          <button className="servicesCtaBtn" onClick={() => window.location.href = '/contacts'}>
            Связаться с нами
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

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