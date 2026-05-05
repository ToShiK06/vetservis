import React from 'react';
import { Helmet } from 'react-helmet-async';

function About() {
  return (
    <>
      <Helmet>
        <title>О клинике ВетСервис | Ветеринарная клиника в Старой Руссе</title>
        <meta name="description" content="Ветеринарная клиника ВетСервис в Старой Руссе: история, миссия и преимущества. Современное оборудование, опытные врачи, собственная лаборатория. Забота о здоровье ваших питомцев с 2010 года." />
        <meta name="keywords" content="ветеринарная клиника Старая Русса, ветклиника, о нас, история, преимущества" />
        <meta property="og:title" content="О клинике ВетСервис" />
        <meta property="og:description" content="Узнайте больше о нашей ветеринарной клинике. Опыт с 2010 года, современное оборудование, забота о питомцах." />
        <meta property="og:url" content="https://vetservis.vercel.app/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="aboutPage">
        <div className="pageHeader">
          <h1 className="pageTitle">О клинике ВетСервис</h1>
          <p className="pageSubtitle">История, миссия и ценности</p>
        </div>

        <div className="aboutContent">
          <div className="aboutSection">
            <h2 className="aboutTitle">Наша история</h2>
            <p className="aboutText">
              ВетСервис основан в 2010 году группой ветеринарных врачей с многолетним опытом. 
              За это время мы вылечили тысячи питомцев и помогли их владельцам. Наша клиника 
              начиналась с небольшого кабинета, а сегодня это современный медицинский центр 
              с высокоточным оборудованием и собственной лабораторией.
            </p>
          </div>

          <div className="aboutSection">
            <h2 className="aboutTitle">Наша миссия</h2>
            <p className="aboutText">
              Обеспечить доступную и качественную ветеринарную помощь, используя современные 
              методы диагностики и лечения. Мы заботимся не только о животных, но и об их владельцах, 
              предоставляя полную информацию о состоянии здоровья питомца и вариантах лечения.
            </p>
          </div>

          <div className="aboutSection">
            <h2 className="aboutTitle">Наши преимущества</h2>
            <ul className="aboutList">
              <li>Собственная лаборатория и аптека - результаты анализов за 2 часа</li>
              <li>Круглосуточный стационар с наблюдением врачей</li>
              <li>Выезд ветеринара на дом 24/7</li>
              <li>Современное оборудование экспертного класса</li>
              <li>Опытные врачи узких специализаций (хирурги, офтальмологи, дерматологи)</li>
              <li>Индивидуальный подход к каждому питомцу</li>
            </ul>
          </div>

          <div className="aboutSection">
            <h2 className="aboutTitle">Наши врачи</h2>
            <p className="aboutText">
              В штате клиники работают специалисты с высшим ветеринарным образованием, 
              регулярно повышающие квалификацию на международных конференциях и курсах. 
              Каждый врач имеет опыт работы от 5 лет.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;