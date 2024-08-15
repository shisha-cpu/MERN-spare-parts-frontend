import './contact.css';

export default function Contact() {
    return (
        <div className="contact-container">
            <h1 className="contact-title">Контакты</h1>
            <div className="contact-content">
                <div className="map-container">
                <div style={{ position: 'relative', overflow: 'hidden' }}>
      <a 
        href="https://yandex.ru/maps/193/voronezh/?utm_medium=mapframe&utm_source=maps" 
        style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}
        target="_blank" 
        rel="noopener noreferrer"
      >
        Воронеж
      </a>
      <a 
        href="https://yandex.ru/maps/193/voronezh/house/olimpiyskiy_bulvar_6/Z0AYdw5oT0UAQFtrfXtwc3RjZw==/?ll=39.198607%2C51.712803&utm_medium=mapframe&utm_source=maps&z=17" 
        style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}
        target="_blank" 
        rel="noopener noreferrer"
      >
        Олимпийский бульвар, 6 на карте Воронежа — Яндекс Карты
      </a>
      <iframe 
        src="https://yandex.ru/map-widget/v1/?ll=39.198607%2C51.712803&mode=whatshere&whatshere%5Bpoint%5D=39.198607%2C51.712803&whatshere%5Bzoom%5D=17&z=17" 
        width="560" 
        height="400" 
        frameBorder="1" 
        allowFullScreen
        style={{ position: 'relative' }}
      ></iframe>
    </div>
                </div>
                <div className="contact-info">
                    <p>
                        Режим работы: 7 дней в неделю с 9:00 до 21:00<br/>
                        E-mail: ark4da.vrn@yandex.ru<br/>
                        Телефоны отдела продаж:<a href="tel:+79515515625">+79515515625</a> <br/>
                 
                <a href="https://wa.me/+79515515625">WhatsApp</a><br/>
                     <a href="https://t.me/Refvrn">Telegram</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
