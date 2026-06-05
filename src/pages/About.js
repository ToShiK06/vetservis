import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    info: false,
    faq: false,
    contact: false
  });
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    setIsVisible(prev => ({ ...prev, hero: true }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'infoSection' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, info: true }));
          }
          if (entry.target.id === 'faqSection' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, faq: true }));
          }
          if (entry.target.id === 'contactSection' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, contact: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (infoRef.current) observer.observe(infoRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Какие услуги вы оказываете?',
      answer: 'Мы оказываем полный спектр ветеринарных услуг: прием терапевта, вакцинация, хирургия, УЗИ-диагностика, лабораторные анализы, стоматология, выезд на дом.'
    },
    {
      question: 'Нужно ли записываться заранее?',
      answer: 'Да, запись на прием обязательна. Вы можете записаться через форму на сайте, по телефону 8 (911) 601-01-39 или в нашем личном кабинете.'
    },
    {
      question: 'Как подготовить питомца к приему?',
      answer: 'Рекомендуется взять с собой предыдущие медицинские документы, если они есть. Для анализов может потребоваться голодная диета за 8-12 часов. Уточните необходимость подготовки при записи.'
    },
    {
      question: 'Вы принимаете экстренные случаи?',
      answer: 'Да, мы принимаем экстренных пациентов. При острых состояниях звоните по телефону 8 (911) 601-01-39, мы примем вас вне очереди.'
    },
    {
      question: 'Есть ли выезд на дом?',
      answer: 'Да, мы осуществляем выезд ветеринара на дом для осмотра, вакцинации и несложных процедур. Услуга доступна по предварительной записи.'
    },
    {
      question: 'Какие документы нужны для приема?',
      answer: 'Достаточно паспорта владельца. Если у питомца есть ветеринарный паспорт, возьмите его с собой. При первичном приеме мы заведем электронную карту.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>О клинике | ВетСервис - Ветеринарная клиника в Старой Руссе</title>
        <meta name="description" content="Ветеринарная клиника ВетСервис. ИП Шевкунова Анна Владимировна. Часто задаваемые вопросы о нашей работе." />
      </Helmet>

      <div className="aboutPageSimple">
        {/* Hero секция */}
        <div className={`aboutHeroSimple ${isVisible.hero ? 'animate' : ''}`}>
          <div className="aboutHeroContentSimple">
            <h1 className="aboutHeroTitleSimple">ВетСервис</h1>
            <div className="aboutHeroDividerSimple"></div>
            <p className="aboutHeroDescSimple">
              Ветеринарная клиника в Старой Руссе
            </p>
            <p className="aboutHeroOwnerSimple">
              ИП Шевкунова Анна Владимировна
            </p>
          </div>
        </div>

        {/* О нас */}
        <div 
          id="infoSection" 
          ref={infoRef} 
          className={`aboutInfoSimple ${isVisible.info ? 'animate' : ''}`}
        >
          <div className="aboutInfoContainerSimple">
            <div className="aboutInfoTextSimple">
              <h2>О нас</h2>
              <p>
                ВетСервис основан в 2025 году ветеринарным врачом Шевкуновой Анной Владимировной.
                За это время мы вылечили тысячи питомцев и помогли их владельцам.
              </p>
              <p>
                Мы работаем для того, чтобы ваши питомцы были здоровы, а вы — спокойны.
                Индивидуальный подход к каждому пациенту, современные методы лечения
                и искренняя забота — наши главные принципы.
              </p>
            </div>
            <div className="aboutInfoFeaturesSimple">
              <div className="featureItemSimple">
                <span className="featureIconSimple">✓</span>
                <span>Современное оборудование</span>
              </div>
              <div className="featureItemSimple">
                <span className="featureIconSimple">✓</span>
                <span>Собственная лаборатория</span>
              </div>
              <div className="featureItemSimple">
                <span className="featureIconSimple">✓</span>
                <span>Выезд на дом</span>
              </div>
              <div className="featureItemSimple">
                <span className="featureIconSimple">✓</span>
                <span>Круглосуточный стационар</span>
              </div>
            </div>
          </div>
        </div>

        {/* Часто задаваемые вопросы */}
        <div 
          id="faqSection" 
          ref={faqRef} 
          className={`aboutFaqSimple ${isVisible.faq ? 'animate' : ''}`}
        >
          <div className="aboutFaqContainerSimple">
            <h2>Часто задаваемые вопросы</h2>
            <div className="faqListSimple">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faqItemSimple ${openFaq === index ? 'open' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button 
                    className={`faqQuestionSimple ${openFaq === index ? 'open' : ''}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      className={`faqArrowSimple ${openFaq === index ? 'rotate' : ''}`}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="faqAnswerSimple">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Контакты */}
        <div 
          id="contactSection" 
          ref={contactRef} 
          className={`aboutContactSimple ${isVisible.contact ? 'animate' : ''}`}
        >
          <div className="aboutContactContainerSimple">
            <h2>Свяжитесь с нами</h2>
            <div className="contactItemsSimple">
              <div className="contactItemSimple">
                <span className="contactLabelSimple">Адрес:</span>
                <span>г. Старая Русса, мкр Городок 10а</span>
              </div>
              <div className="contactItemSimple">
                <span className="contactLabelSimple">Телефон:</span>
                <span>8 (911) 601-01-39</span>
              </div>
              <div className="contactItemSimple">
                <span className="contactLabelSimple">Email:</span>
                <span>info@vetservice.ru</span>
              </div>
              <div className="contactItemSimple">
                <span className="contactLabelSimple">Режим работы:</span>
                <span>Пн-Сб: 9:00 - 21:00, Вс: 10:00 - 18:00</span>
              </div>
            </div>
            <Link to="/contacts" className="aboutContactBtnSimple">
              Записаться на прием
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;