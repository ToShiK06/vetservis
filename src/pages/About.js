import React from 'react';

function About() {
  return (
    <div className="aboutPage">
      <div className="pageHeader">
        <h1 className="pageTitle">О клинике ВетМастер</h1>
        <p className="pageSubtitle">История, миссия и ценности</p>
      </div>

      <div className="aboutContent">
        <div className="aboutSection">
          <h2 className="aboutTitle">Наша история</h2>
          <p className="aboutText">
            ВетМастер основан в 2010 году группой ветеринарных врачей с многолетним опытом. 
            За это время мы вылечили тысячи питомцев и помогли их владельцам.
          </p>
        </div>

        <div className="aboutSection">
          <h2 className="aboutTitle">Наша миссия</h2>
          <p className="aboutText">
            Обеспечить доступную и качественную ветеринарную помощь, используя современные 
            методы диагностики и лечения. Мы заботимся не только о животных, но и об их владельцах.
          </p>
        </div>

        <div className="aboutSection">
          <h2 className="aboutTitle">Наши преимущества</h2>
          <ul className="aboutList">
            <li>Собственная лаборатория и аптека</li>
            <li>Круглосуточный стационар</li>
            <li>Выезд ветеринара на дом</li>
            <li>Современное оборудование экспертного класса</li>
            <li>Опытные врачи узких специализаций</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;