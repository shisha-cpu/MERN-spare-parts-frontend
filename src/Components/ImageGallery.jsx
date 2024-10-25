import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './card.css';
import { useDispatch, useSelector } from 'react-redux';
import Button from './elements/Button';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const user = useSelector(state => state.user);

  useEffect(() => {
    const tempImages = Array.from({ length: 737 }, (_, i) => ({
      id: i + 1,
      src: `/фото/${i + 1}.jpg`,
      triedPng: false
    }));
    setImages(tempImages);
  }, []);

  useEffect(() => {
    axios.get('http://62.217.181.247:4445/data')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

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

  const handleSubmit = async (item) => {
    const count = parseInt(prompt('Введите количество:'), 10);

    // Validate input
    if (!isNaN(count) && count > 0) {
      console.log('Sending data to server:', {
        product: item,
        username: user.userInfo.username,
        count: count,
      });

      try {
        const response = await axios.post('http://62.217.181.247:4445/add-to-basket', {
          product: item,
          username: user.userInfo.username,
          count: count,
        });
        console.log('Server response:', response.data);
      } catch (err) {
        console.error('Error adding to basket:', err);
      }
    } else {
      alert('Введите корректное количество.');
    }
  };

  const searchLink = `http://localhost:5174/catalog#search=${encodeURIComponent(searchQuery)}`;

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
                <div className="card_margin">
                  <p className="card_title">{item.Наименование}</p>
                </div>
                <p>Каталог: {item.Каталог}</p>
                <p>Производитель: {item.Производитель}</p>
                <p>Осталось: {item.Количество} шт.</p>
                <p>Артикул: {item.Артикул}</p>
                {user.userInfo.wholesale ? 
                  <p><strong>Цена: {item.ОПТ}</strong></p> : 
                  <p><strong>Цена: {item.РОЗНИЦА} рублей</strong></p>
                }
                <div className="img-container">
                  <img
                    src={`/фото/${item.id}.jpg`}
                    alt={`Изображение ${item.id}`}
                    onError={(e) => handleImageError(e, item.id)}
                  />
                </div>
              </div>
              {user.userInfo.username && 
                <Button text='Добавить в корзину' func={() => handleSubmit(item)} />
              }
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