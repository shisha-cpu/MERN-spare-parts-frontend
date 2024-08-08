import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Button from "./elements/Button";
import './dashboard.css';

export default function Dashboard() {
    const [basket, setBasket] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (user.userInfo.username) {
            axios.get(`http://62.113.108.165:4444/user/${user.userInfo.username}/basket`)
                .then(res => {
                    console.log(res.data); // Для проверки данных
                    setBasket(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [user.userInfo.username]);

    const totalPrice = useMemo(() => {
        return basket.reduce((sum, item) => {
            const price = user.userInfo.wholesale ? item.product?.ОПТ : item.product?.РОЗНИЦА;
            return sum + (price || 0) * item.count;
        }, 0);
    }, [basket, user.userInfo.wholesale]);

    const handleOrder = async () => {
        const orderDetails = basket.map(item => ({
            name: item.product?.Наименование,
            catalog: item.product?.Каталог,
            manufacturer: item.product?.Производитель,
            article: item.product?.Артикул,
            price: item.product?.РОЗНИЦА,
            count: item.count
        }));

        const message = `
          Заказ от пользователя: ${user.userInfo.username}
          Телефон: ${user.userInfo.phone}
          Почта: ${user.userInfo.email}
          Товары:
          ${orderDetails.map(item => 
              `Наименование: ${item.name || "не указано"}, Каталог: ${item.catalog || "не указан"}, Производитель: ${item.manufacturer || "не указан"}, Артикул: ${item.article || "не указан"}, Цена: ${item.price || "не указана"}, Количество: ${item.count}`).join('\n')}
          Общая сумма: ${totalPrice}
        `;

        try {
            const botToken = 'YOUR_BOT_TOKEN';
            const chatId = 'YOUR_CHAT_ID';
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
            });

            await axios.post('http://62.113.108.165:4444/get-order', { username: user.userInfo.username });
            alert('Ваш заказ был успешно отправлен!');
            setBasket([]); // Очистите корзину после заказа
        } catch (error) {
            console.log(error);
            alert('Ошибка при отправке заказа');
        }
    };

    const handleDelete = async (index) => {
        try {
            await axios.delete(`http://62.113.108.165:4444/${user.userInfo.username}/basket/${index}`);
            setBasket(basket.filter((_, i) => i !== index)); // Обновите состояние здесь
        } catch (error) {
            console.log(error);
            alert('Ошибка при удалении товара из корзины');
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Личный кабинет пользователя: {user.userInfo.username}</h1>
            {basket.length === 0 ? (
                <h3>Для заказа нужно добавить товары в корзину</h3>
            ) : (
                <div className="user-basket">
                    {basket.map((item, index) => {
                        const product = item.product || {};
                        const productName = product.Наименование || "не указано";
                        const catalog = product.Каталог || "не указан";
                        const manufacturer = product.Производитель || "не указан";
                        const article = product.Артикул || "не указан";
                        const retailPrice = product.РОЗНИЦА || 0;

                        return (
                            <div key={index} className="basket-item">
                                <div className="basket-content">
                                    <div className="basket-item-header">
                                        <p>{productName}</p>
                                    </div>
                                    <p>Каталог: {catalog}</p>
                                    <p>Производитель: {manufacturer}</p>
                                    <p>Артикул: {article}</p>
                                    {user.userInfo.wholesale ? <p>Цена: {item.product.ОПТ}</p> : <p>Цена: {retailPrice}</p> }
                                    <p>Количество: {item.count}</p>
                                </div>
                                <button className="delete-button" onClick={() => handleDelete(index)}>Удалить</button>
                            </div>
                        );
                    })}
                    <h3>Итог: {totalPrice} рублей</h3>
                    <Button text='Заказать' func={handleOrder} />
                </div>
            )}
        </div>
    );
}
