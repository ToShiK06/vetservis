import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { auth } from '../firebase';
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
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      heroObserver.observe(heroRef.current);
    }

    return () => heroObserver.disconnect();
  }, []);

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
      let servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Показываем только активные услуги
      servicesData = servicesData.filter(service => service.status === 'active');
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
    const user = auth.currentUser;
    if (!user) {
      alert('Для записи на услугу необходимо войти в аккаунт');
      window.location.href = '/login';
      return;
    }
    setSelectedService(service);
    setShowModal(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <Helmet>
        <title>Услуги | ВетСервис - Ветеринарная клиника в Старой Руссе</title>
        <meta name="description" content="Услуги ветеринарной клиники ВетСервис: прием терапевта, вакцинация, хирургия, УЗИ-диагностика." />
      </Helmet>

      <div className="servicesPageAnimated">
        {/* Hero секция с анимацией */}
        <div ref={heroRef} className={`servicesHeroAnimated ${isVisible ? 'visible' : ''}`}>
          <div className="servicesHeroContentAnimated">
            <h1 className="servicesHeroTitleAnimated">Наши услуги</h1>
            <div className="servicesHeroDividerAnimated"></div>
            <p className="servicesHeroSubtitleAnimated">Профессиональная помощь вашим питомцам</p>
          </div>
        </div>

        {/* Поиск и фильтры с анимацией */}
        <div className={`servicesFilterAnimated ${isVisible ? 'visible' : ''}`}>
          <div className="searchBoxAnimated">
            <svg className="searchIconAnimated" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              className="searchInputAnimated"
              placeholder="Поиск услуги..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="searchClearAnimated" onClick={clearSearch}>✕</button>
            )}
          </div>

          <div className="filterContainerAnimated">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`filterChipAnimated ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {cat === 'all' ? 'Все услуги' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка услуг */}
        {loading ? (
          <div className="loadingServicesAnimated">
            <div className="loader"></div>
            <p>Загрузка услуг...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="noServicesFoundAnimated">
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поисковый запрос</p>
            <button className="resetFiltersBtnAnimated" onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="servicesGridAnimated">
            {filteredServices.map((service, idx) => (
              <div 
                key={service.id || idx} 
                className="serviceCardAnimated" 
                ref={el => cardsRef.current[idx] = el}
                style={{ transitionDelay: `${idx * 0.05}s` }}
              >
                <div className="serviceCardHeaderAnimated">
                  <h3 className="serviceNameAnimated">{service.name}</h3>
                  <div className="servicePriceAnimated">{service.price}</div>
                </div>
                <div className="serviceDurationAnimated">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {service.duration || '30 мин'}
                </div>
                <p className="serviceDescriptionAnimated">{service.description || 'Профессиональная помощь в нашей клинике'}</p>
                <button className="bookServiceBtnAnimated" onClick={() => handleBookService(service)}>
                  Записаться
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedService && (
          <BookingModal service={selectedService} onClose={() => setShowModal(false)} />
        )}
      </div>
    </>
  );
}

export default Services;