import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { article } = useParams(); // Получаем артикул из URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!article) return;

    // Убираем _n/o из артикула
    const cleanArticle = article.replace(/_n\|o$/, '');

    // Загружаем данные о товаре
    axios.get(`https://refvrn.ru:4446/data`)
      .then(res => {
        console.log(cleanArticle);
        
        const foundProduct = res.data.find(item => item.Артикул === cleanArticle);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error('Товар не найден');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки данных:', err);
        setLoading(false);
      });
  }, [article]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!product) {
    return <div>Товар не найден</div>;
  }
  console.log(product);
  
  return (
    <div className="product-page">
      <h1>{product.Наименование}</h1>
      <p>Артикул: {product.Артикул}</p>
      <p>Производитель: {product.Производитель}</p>
      <p>На складе: {product.Количество} шт.</p>
      <p>Цена: {product.РОЗНИЦА} ₽</p>
      <img src={`/фото/${product.id}.jpg`} alt={product.Наименование} />
    </div>
  );
};

export default ProductPage;
