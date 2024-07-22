import React from 'react';
import './profit.css';

export default function Profit() {
    const cards = [
        { 
          id: 1, 
          title: 'Высокое качество', 
          content: 'Мы предлагаем только высококачественные запчасти для грузовых холодильных установок.', 
          backContent: 'Каждая деталь проходит строгий контроль качества для обеспечения надежности.' 
        },
        { 
          id: 2, 
          title: 'Конкурентные цены', 
          content: 'Наши цены одни из самых конкурентоспособных на рынке.', 
          backContent: 'Мы предлагаем лучшее соотношение цены и качества.' 
        },
        { 
          id: 3, 
          title: 'Широкий ассортимент', 
          content: 'В нашем каталоге вы найдете все необходимые запчасти.', 
          backContent: 'Мы постоянно обновляем наш ассортимент, чтобы удовлетворить все потребности клиентов.' 
        },
        { 
          id: 4, 
          title: 'Быстрая доставка', 
          content: 'Мы обеспечиваем быструю и надежную доставку по всей стране.', 
          backContent: 'Ваш заказ будет доставлен в кратчайшие сроки.' 
        },
      ];

  return (
    <div className="cards-container">
      {cards.map((card) => (
        <ProfitCard key={card.id} title={card.title} content={card.content} backContent={card.backContent} />
      ))}
    </div>
  );
}

function ProfitCard({ title, content, backContent }) {
  return (
    <div className="profit-card">
      <div className="profit-card-inner">
        <div className="profit-card-front">
          <div className="profit-card-title">{title}</div>
          <div className="profit-card-content">{content}</div>
        </div>
        <div className="profit-card-back">
          <div className="profit-card-title">{title}</div>
          <div className="profit-card-content">{backContent}</div>
        </div>
      </div>
    </div>
  );
}
