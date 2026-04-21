import React from 'react';

function Services() {
  const services = [
    { name: 'Прием терапевта', price: '1000 руб', description: 'Осмотр, консультация, назначение лечения' },
    { name: 'Вакцинация', price: '800 руб', description: 'Прививки для кошек и собак' },
    { name: 'Хирургия', price: 'от 3000 руб', description: 'Оперативные вмешательства любой сложности' },
    { name: 'УЗИ диагностика', price: '1500 руб', description: 'Ультразвуковое исследование органов' },
    { name: 'Лаборатория', price: 'от 500 руб', description: 'Анализы крови, мочи, цитология' },
    { name: 'Стоматология', price: 'от 2000 руб', description: 'Лечение зубов и полости рта' },
    { name: 'Рентген', price: '1200 руб', description: 'Рентгенологическое исследование' },
    { name: 'Стационар', price: '1000 руб/сут', description: 'Круглосуточное наблюдение' }
  ];

  return (
    <div className="servicesPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Наши услуги</h1>
        <p className="pageSubtitle">Полный спектр ветеринарных услуг</p>
      </div>

      <div className="servicesGrid">
        {services.map((service, index) => (
          <div key={index} className="serviceCard">
            <h3 className="serviceName">{service.name}</h3>
            <div className="servicePrice">{service.price}</div>
            <p className="serviceDescription">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;