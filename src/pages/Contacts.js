import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BookingForm from '../components/BookingForm';

function Contacts() {
  const [isVisible, setIsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const infoRef = useRef(null);
  const mapRef = useRef(null);
  const formRef = useRef(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const infoObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInfoVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    const mapObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMapVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const formObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFormVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (infoRef.current) infoObserver.observe(infoRef.current);
    if (mapRef.current) mapObserver.observe(mapRef.current);
    if (formRef.current) formObserver.observe(formRef.current);

    return () => {
      infoObserver.disconnect();
      mapObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Контакты | ВетСервис - Ветеринарная клиника в Старой Руссе</title>
        <meta name="description" content="Контакты ветеринарной клиники ВетСервис. Адрес: мкр Городок 10а. Телефон: 8 (911) 601-01-39." />
      </Helmet>

      <div className="contactsPageAnimated">
        {/* Hero секция */}
        <div className={`contactsHeroAnimated ${isVisible ? 'visible' : ''}`}>
          <div className="contactsHeroContentAnimated">
            <h1 className="contactsHeroTitleAnimated">Контакты</h1>
            <div className="contactsHeroDividerAnimated"></div>
            <p className="contactsHeroSubtitleAnimated">Свяжитесь с нами любым удобным способом</p>
          </div>
        </div>

        {/* Информация */}
        <div ref={infoRef} className={`contactsInfoAnimated ${infoVisible ? 'visible' : ''}`}>
          <div className="contactsGridAnimated">
            <div className="contactInfoCardAnimated">
              <h2 className="contactSectionTitleAnimated">Контактная информация</h2>
              
              <div className="contactItemAnimated">
                <strong>Адрес:</strong>
                <p>г. Старая Русса, мкр Городок 10а</p>
              </div>
              
              <div className="contactItemAnimated">
                <strong>Телефон:</strong>
                <p><a href="tel:+79116010139">8 (911) 601-01-39</a></p>
              </div>
              
              <div className="contactItemAnimated">
                <strong>Email:</strong>
                <p><a href="mailto:info@vetservice.ru">info@vetservice.ru</a></p>
              </div>
              
              <div className="contactItemAnimated">
                <strong>Режим работы:</strong>
                <p>Понедельник - Суббота: 9:00 - 21:00</p>
                <p>Воскресенье: 10:00 - 18:00</p>
              </div>

              <div className="contactItemAnimated">
                <strong>Рейтинг:</strong>
                <p>5.0 на основе отзывов</p>
              </div>
            </div>

            <div ref={mapRef} className={`contactMapCardAnimated ${mapVisible ? 'visible' : ''}`}>
              <h2 className="contactSectionTitleAnimated">Как нас найти</h2>
              <div className="mapContainerAnimated">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d573.9480662052816!2d31.360799747312818!3d57.974033380510214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sru!2sru!4v1777025530364!5m2!1sru!2sru" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0, borderRadius: '16px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  title="Карта клиники ВетСервис"
                ></iframe>
                <p className="mapAddressAnimated">Микрорайон Городок, 10А, г. Старая Русса</p>
                <div className="mapLinksAnimated">
                  <a href="https://yandex.ru/maps/?text=Старая+Русса+Городок+10а" target="_blank" rel="noopener noreferrer">
                    Построить маршрут
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Форма записи */}
        <div ref={formRef} className={`contactsFormSectionAnimated ${formVisible ? 'visible' : ''}`}>
          <div className="contactsFormContainerAnimated">
            <div className="contactsFormHeaderAnimated">
              <h2>Запись на прием</h2>
              <p>Заполните форму и мы свяжемся с вами</p>
            </div>
            <BookingForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default Contacts;