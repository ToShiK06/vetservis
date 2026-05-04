import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import ReviewsSection from '../components/ReviewsSection';
import 'swiper/css';
import 'swiper/css/pagination';

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
      title: 'ВетСервис',
      subtitle: 'Профессиональная ветеринарная помощь',
      description: 'Современная клиника с высокоточным оборудованием и опытными специалистами. Забота о здоровье ваших питомцев - наша главная задача 24/7.',
      stats: [
        { value: '10+', label: 'лет опыта' },
        { value: '5000+', label: 'счастливых питомцев' },
        { value: '24/7', label: 'круглосуточно' }
      ],
      buttonText: 'Записаться на прием',
      buttonLink: '/contacts',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&h=900&fit=crop'
    },
    {
      id: 2,
      title: 'Вакцинация',
      subtitle: 'Надежная защита для вашего питомца',
      description: 'Современные вакцины европейского качества. Индивидуальный график прививок. Защитите своего любимца от опасных заболеваний.',
      stats: [
        { value: '100%', label: 'гарантия качества' },
        { value: 'от 800 ₽', label: 'доступные цены' },
        { value: '1 год', label: 'защита' }
      ],
      buttonText: 'Узнать о вакцинации',
      buttonLink: '/services',
      image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=1600&h=900&fit=crop'
    },
    {
      id: 3,
      title: 'Хирургия',
      subtitle: 'Опытные хирурги-ветеринары',
      description: 'Операции любой сложности. Современная анестезия. Реабилитация под круглосуточным наблюдением. Безопасность превыше всего.',
      stats: [
        { value: '98%', label: 'успешных операций' },
        { value: 'современно', label: 'оборудование' },
        { value: 'безопасно', label: 'для питомца' }
      ],
      buttonText: 'Записаться на консультацию',
      buttonLink: '/services',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1600&h=900&fit=crop'
    },
    {
      id: 4,
      title: 'УЗИ диагностика',
      subtitle: 'Точная диагностика здоровья',
      description: 'Ультразвуковое исследование всех органов. Расшифровка сразу после осмотра. Безболезненно и информативно для питомцев любого возраста.',
      stats: [
        { value: '100%', label: 'безболезненно' },
        { value: 'за 30 мин', label: 'быстрый результат' },
        { value: 'точно', label: 'диагностика' }
      ],
      buttonText: 'Записаться на УЗИ',
      buttonLink: '/contacts',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&h=900&fit=crop'
    }
  ];

  return (
    <div className="homePage">
      <div className="premiumSliderSection">
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          speed={800}
          className="premiumSwiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div 
                className="premiumSlide"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="premiumOverlay"></div>
                <div className="premiumContent">
                  <div className="premiumContainer">
                    <div className="premiumText">
                      <div className="premiumBadge">
                        Ветеринарная клиника
                      </div>
                      <h1 className="premiumTitle">
                        {slide.title}
                      </h1>
                      <p className="premiumSubtitle">
                        {slide.subtitle}
                      </p>
                      <p className="premiumDescription">
                        {slide.description}
                      </p>
                      
                      <div className="premiumStats">
                        {slide.stats.map((stat, index) => (
                          <div key={index} className="premiumStat">
                            <span className="statValue">{stat.value}</span>
                            <span className="statLabel">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Link to={slide.buttonLink} className="premiumButton">
                        {slide.buttonText}
                        <svg className="buttonArrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
      
      <ReviewsSection />
    </div>
  );
}

export default Home;