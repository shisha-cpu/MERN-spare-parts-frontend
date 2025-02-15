import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './card.css';
import { useDispatch, useSelector } from 'react-redux';
import Button from './elements/Button';
import { Navigate } from 'react-router-dom';
import { addToBasket } from '../store/slices/basketSlice'; // Импортируем addToBasket
import { Link } from 'react-router-dom';
import Modal from './Modal';
import { retry } from '@reduxjs/toolkit/query';
import { useLocation } from 'react-router-dom';
const TIMEOUT_DURATION = 5 * 60 * 1000; 

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const user = useSelector(state => state.user);
  const [redirect, setRedirect] = useState(false);
  const [quantities, setQuantities] = useState({}); 
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const tempImages = Array.from({ length: 737 }, (_, i) => ({
      id: i + 1,
      src: `/фото/${i + 1}.jpg`,
      triedPng: false
    }));
    setImages(tempImages);
  }, []);

  useEffect(() => {
    axios.get('https://refvrn.ru:4446/data/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Восстанавливаем поиск
    const savedSearchQuery = sessionStorage.getItem('searchQuery');
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }

    // Следим за активностью
    const updateActivity = () => setLastActiveTime(Date.now());

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, []);
  useEffect(() => {
    if (location.pathname === '/') {
      sessionStorage.removeItem('searchQuery');
      setSearchQuery('');
    } else if (location.pathname.includes('/catalog')) {
      const savedSearchQuery = sessionStorage.getItem('searchQuery');
      setSearchQuery(savedSearchQuery || '');
    }
  }, [location.pathname]);
  
  useEffect(() => {
    // Сохраняем поиск при изменении
    sessionStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTimeout(() => {
          if (Date.now() - lastActiveTime > TIMEOUT_DURATION) {
            window.location.reload();
          }
        }, TIMEOUT_DURATION);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastActiveTime]);
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const normalizedQuery = lowercasedQuery.replace(/[^a-zа-яё0-9]/gi, '');

    setFilteredData(data.filter(item => {
      const article = String(item.Артикул).toLowerCase().replace(/[^a-z0-9]/g, '');
      const name = String(item.Наименование).toLowerCase().replace(/[^a-zа-яё0-9]/g, '');
      return article.includes(normalizedQuery) || name.includes(normalizedQuery);
    }));
  }, [data, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#search=')) {
      const query = hash.split('=')[1];
      setSearchQuery(decodeURIComponent(query));
    }
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleImageError = (e, id) => {
    const img = e.target;
    const newSrc = img.src.endsWith('.jpg') ? `/фото/${id}.png` : '';
    if (newSrc) {
      img.src = newSrc;
    } else {
      console.error(`Ошибка загрузки изображения: ${id}`);
    }
  };

  const handleIncrease = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleDecrease = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const handleSubmit = async (item) => {
    const count = quantities[item.id] || 1;

    
    if (count > 0) {
      if (user.userInfo.username) {
        try {
          const response = await axios.post('https://refvrn.ru:4446/add-to-basket', {
            product: item,
            username: user.userInfo.username,
            count: count,
          });
          console.log('Ответ от сервера:', response.data);

       
          dispatch(addToBasket({ product: item, count })); // Используем addToBasket
          alert('Товар добавлен успешно')
        } catch (err) {
          console.error('Ошибка добавления в корзину:', err);
        }
      } else {
        const basket = JSON.parse(localStorage.getItem('basket')) || [];
        const updatedBasket = [...basket, { product: item, count }];
        localStorage.setItem('basket', JSON.stringify(updatedBasket));

        // Обновляем корзину в Redux
        dispatch(addToBasket({ product: item, count })); // Используем addToBasket
        alert('Товар добавлен успешно')
      }
    } else {
      alert('Введите корректное количество.');
    }
  };

  const searchLink = `http://localhost:5174/catalog#search=${encodeURIComponent(searchQuery)}`;

  if (redirect) {
    return <Navigate to='/register' />;
  }
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="container">
      <div className="search-container">
        <input
          id="search"
          type="text"
          placeholder="Поиск по артикулу или названию"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="search-link-container">
          <a href={searchLink} className="search-link" style={{ display: 'none' }}>
            Искать
          </a>
        </div>
      </div>
      <div className="card_container">
        {filteredData.map((item, index) => (
          <div key={index} className="card">
            <div className="card_content">
              <div className="img-flex">
                <div className="img-container">
                  <img
                    src={`/фото/${item.id}.jpg`}
                    alt={`Изображение ${item.id}`}
                    onError={(e) => handleImageError(e, item.id)}
                  />
                </div>
                <Link className='img-container-link' to={`/catalog/${item.Артикул}_n|o`}>
                  <p className='card-title-name'>{item.Наименование}</p>
                </Link>
                <p>
  Артикул:{" "}
  <Link to={`/catalog#search=${encodeURIComponent(item.Артикул)}`} className="article-link">
    {item.Артикул}
  </Link>
</p>

                <p>Производитель: {item.Производитель}</p>
                <p>На складе: {user.userInfo.email === '122121wdw2t@testtest.ru' || user.userInfo.email === 'Sanankan@yandex.ru' || user.userInfo.email === 'ark4da.vrn@yandex.ru' ? item.Количество : item.Количество > 5 ? '> 5' : item.Количество} шт.</p>
               { item.Avito == undefined || item.Avito == 'Н/Д' ? '' :  <p>Купить на  <u><a className='img-container-link' href={item.Avito}>Avito</a></u> </p>}
               {
  user.userInfo.wholesale ? (
    <div className="card_margin">
      <p className="card_title">
        <strong>
          <span className='light-blue'>{formatPrice(item.ОПТ)} ₽</span>
        </strong>
      </p>
    </div>
  ) : (
    <div className="card_margin">
      <p className="card_title">
        <strong>
          <span className='light-blue'>{formatPrice(item.РОЗНИЦА)} ₽</span>
        </strong>
      </p>
    </div>
  )
}
        

              <div className="quantity-control">
                <button onClick={() => handleDecrease(item.id)}>-</button>
                <span>{quantities[item.id] || 1} шт.</span>
                <button onClick={() => handleIncrease(item.id)}>+</button>
              </div>
              </div>
              {1 === 1 ? (
                <Button text='Купить' func={() => handleSubmit(item)} />
              ) : (
                <Button text='Зарегистрироваться для заказа' func={() => { setRedirect(true) }} onClick={() => { setRedirect(false) }} />
              )}
            </div>
          </div>
        ))}
      </div>
      {showScrollToTop && (
        <button
          className="scroll-to-top"
          onClick={handleScrollToTop}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default ImageGallery;