import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function Home() {
  const cardsRef = useRef([]);

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
  }, []);

  const slides = [
    {
      id: 1,
      badge: 'ВетСервис',
      title: 'Ветеринарный кабинет',
      address: 'г. Старая Русса, мкр Городок 10а',
      phone: '89116010139',
      rating: '5.0',
      subscribers: '91 подписчик',
      friends: '6 друзей',
      promoTitle: 'Выгодный чекап для щенков и котят',
      promoText: 'Комплексное обследование щенков (6 800 ₽) и котят (5 700 ₽) с консультациями терапевта, зоопсихолога, ортопеда',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&h=800&fit=crop'
    },
    {
      id: 2,
      badge: 'Все адреса',
      title: 'Микрорайон Городок, 10А',
      address: 'мкр. Городок, 10а',
      workingHours: 'Нет информации о времени работы',
      promoTitle: 'OpenStreetMap contributors',
      promoText: '14 км до центра',
      image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=1600&h=800&fit=crop'
    }
  ];

  return (
    <div className="homePage">
      <div className="sliderSection">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, el: '.slider-pagination', type: 'bullets' }}
          navigation={{ nextEl: '.slider-next', prevEl: '.slider-prev' }}
          loop={true}
          speed={800}
          className="fullSlider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="slideWrapper">
                <div className="slideBackground" style={{ backgroundImage: `url(${slide.image})` }}>
                  <div className="slideOverlay"></div>
                </div>
                <div className="slideContent">
                  <div className="slideContainer">
                    <div className="slideBadge">{slide.badge}</div>
                    <h2 className="slideMainTitle">{slide.title}</h2>
                    
                    {slide.address && (
                      <div className="slideAddress">{slide.address}</div>
                    )}
                    
                    {slide.phone && (
                      <div className="slidePhone">{slide.phone}</div>
                    )}
                    
                    {slide.rating && (
                      <div className="slideRating">
                        <span className="stars">★★★★★</span>
                        <span className="ratingValue">{slide.rating}</span>
                        <span className="reviewLink"> · Написать отзыв</span>
                      </div>
                    )}
                    
                    {slide.subscribers && (
                      <div className="slideSocial">
                        <span>{slide.subscribers}</span>
                        <span> · {slide.friends}</span>
                      </div>
                    )}
                    
                    {slide.workingHours && (
                      <div className="slideWorkingHours">{slide.workingHours}</div>
                    )}
                    
                    <div className="slidePromo">
                      <div className="promoTitle">{slide.promoTitle}</div>
                      <p className="promoText">{slide.promoText}</p>
                    </div>
                    
                    <div className="slideButtons">
                      <Link to="/services" className="slideButton primary">ПОДРОБНЕЕ</Link>
                      <button className="slideButton secondary">Подписаться</button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="sliderControls">
          <button className="slider-prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="slider-pagination"></div>
          <button className="slider-next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <section className="featuresSection">
        <h2 className="sectionTitle">Наши услуги</h2>
        <div className="featuresGrid">
          {[
            { icon: '', title: 'Прием терапевта', desc: 'Осмотр, диагностика, лечение' },
            { icon: '', title: 'Вакцинация', desc: 'Прививки для всех видов животных' },
            { icon: '', title: 'Лаборатория', desc: 'Анализы крови, мочи, цитология' },
            { icon: '', title: 'УЗИ диагностика', desc: 'Ультразвуковое исследование' },
            { icon: '', title: 'Стоматология', desc: 'Лечение зубов и полости рта' },
            { icon: '', title: 'Выезд на дом', desc: 'Ветеринарная помощь на дому' }
          ].map((service, idx) => (
            <div key={idx} className="featureCard" ref={el => cardsRef.current[idx] = el}>
              <div className="featureIcon">{service.icon}</div>
              <h3 className="featureTitle">{service.title}</h3>
              <p className="featureText">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="infoSection">
        <div className="infoGrid">
          <div className="infoCard" ref={el => cardsRef.current[6] = el}>
            <h3>Контакты</h3>
            <p> 89116010139</p>
            <p> г. Старая Русса, мкр Городок 10а</p>
            <p> Режим работы: по записи</p>
          </div>
          <div className="infoCard" ref={el => cardsRef.current[7] = el}>
            <h3>О нас</h3>
            <p> 5.0 на основе отзывов</p>
            <p> 91 подписчик · 6 друзей</p>
            <p> Ветеринарный кабинет «ВетСервис»</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;