// ImageGallery.js
import React, { useState, useEffect } from 'react';
import  axios from 'axios';
import './card.css';
import { useSelector } from 'react-redux';
import Button from './elements/Button';
const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const user = useSelector(state => state.user )

  // Load images
  useEffect(() => {
    const tempImages = Array.from({ length: 737 }, (_, i) => ({
      id: i + 1,
      src: `/фото/${i + 1}.jpg`,
      triedPng: false
    }));
    setImages(tempImages);
  }, []);
  useEffect(() => {
    axios.get('http://localhost:4444/data')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);


  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredData(data.filter(item => {
      const article = String(item.Артикул).toLowerCase();
      const name = String(item.Наименование).toLowerCase();
      return article.includes(lowercasedQuery) || name.includes(lowercasedQuery);
    }));
  }, [data, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleImageError = (image) => {
    if (!image.triedPng) {
      image.src = `/фото/${image.id}.png`;
      image.triedPng = true;
      setImages([...images]);
    } else {
      console.error(`Ошибка загрузки изображения: ${image.id}`);
    }
  };
  console.log( user);
  const handleSubmit = (item)=>{
    console.log(item);
    axios.post('http://localhost:4444/add-to-basket' , {product : item, username : user.userInfo.username})
    .then(res => console.log(res))
    .catch(err => console.log(err))
  } 
  return (
    <div className="container">
      <div className="search-container">
        <input
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
              {/* {index + 1 } */}
              <div className="card_margin">
                <p className="card_title">{item.Наименование}</p>
              </div>
              <p>Каталог: {item.Каталог}</p>
              <p>Производитель: {item.Производитель}</p>
              {item.Количество > 5 ?  <p>Осталось >5 шт.</p> : <p>Осталось: {item.Количество} шт.</p>}
              <p>Артикул: {item.Артикул}</p>
              {user.userInfo.wholesale?   <p>Оптовая цена: {item.ОПТ}</p> : ''}
              <p>Розничная цена: {item.РОЗНИЦА}</p>
              <div className="img-container">
                {images[index] && (
                  <img
                    src={images[index].src}
                    alt={`image-${images[index].id}`}
                    onError={() => handleImageError(images[index])}
                    className="card_image"
                  />
                )}
              </div>
              {user.userInfo.username ? <Button text='Добавить' func={()=>handleSubmit(item)} /> : ''}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
