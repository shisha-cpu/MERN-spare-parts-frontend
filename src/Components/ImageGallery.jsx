
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
    axios.get('http://62.113.108.165:4444/data')
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

  const handleSubmit = (item) => {
    const count = parseInt(prompt('Введите количество '), 10); 
    
    axios.post('http://62.113.108.165:4444/add-to-basket', { product: item, username: user.userInfo.username, count: count })
      .then(res => console.log(res))
      .catch(err => console.log(err));
};

  

  return (
    <div className="container">
      <div className="search-container">
        <input
          id="jaga"
          type="text"
          placeholder="Поиск по артикулу или названию"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
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
                {item.Количество > 5 ? <p>Осталось >5 шт.</p> : <p>Осталось: {item.Количество} шт.</p>}
                <p>Артикул: {item.Артикул}</p>
                {user.userInfo.wholesale ? <p>Цена: {item.ОПТ}</p> :  <p>Цена: {item.РОЗНИЦА} рублей </p>}
              
                <div className="img-container">
                  <img
                    src={`/фото/${item.id}.jpg`}
                    alt={`Изображение ${item.id}`}
                    onError={(e) => handleImageError(e, item.id)}
                  />
                </div>
              </div>
              {user.userInfo.username ? <Button text='Добавить' func={() => handleSubmit(item)} /> : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
