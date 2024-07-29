import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "./elements/Button";
import './dashboard.css';

export default function Dashboard() {
    const [basket, setBasket] = useState([]);
    const user = useSelector(state => state.user);
    let price = 0;
    console.log(user.userInfo.username);
    useEffect(() => {
        if (user.userInfo.username) {
            axios.get(`http://45.90.34.238:4444/user/${user.userInfo.username}/basket`)
                .then(res => setBasket(res.data))
                .catch(err => console.log(err));
        }
    }, [user.userInfo.username]);
    console.log(user);
    const handleOrder = async () => {
        const orderDetails = basket.map(item => ({
            name: item.Наименование,
            catalog: item.Каталог,
            manufacturer: item.Производитель,
            article: item.Артикул,
            price: item.РОЗНИЦА,
        }));

        const message = `
          Заказ от пользователя: ${user.userInfo.username}
          Телефон: ${user.userInfo.phone}
          Почта: ${user.userInfo.email}
          Товары:
          ${orderDetails.map(item => `Наименование: ${item.name}, Каталог: ${item.catalog}, Производитель: ${item.manufacturer}, Артикул: ${item.article}, Цена: ${item.price}`).join('\n')}
          Общая сумма: ${price}
        `;

        try {
            // Замените `YOUR_BOT_TOKEN` и `YOUR_CHAT_ID` на ваши значения
            const botToken = '6905722948:AAFcLUxKVCJ1tIF03S8l2xLbjo50buyYYoU';
            const chatId = '1137493485';

            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
            });

            // Очистка корзины на сервере
            await axios.post('http://45.90.34.238:4444/get-order', { username: user.userInfo.username });
            //http://localhost:4444/get-order
            setBasket([]);  // Clear local basket state
            alert('Ваш заказ был успешно отправлен!');
        } catch (error) {
            console.log(error);
            alert('Ошибка при отправке заказа');
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Личный кабинет пользователя: {user.userInfo.username}</h1>
            <div className="user-basket">
                {basket.map((item, index) => (
                    <div key={index} className="basket-item">
                        <div className="basket-item-header">
                            <p>{item.Наименование}</p>
                        </div>
                        <p>Каталог: {item.Каталог}</p>
                        <p>Производитель: {item.Производитель}</p>
                        <p>Артикул: {item.Артикул}</p>
                        {user.userInfo.wholesale && <p>Оптовая цена: {item.ОПТ}</p>}
                        <p>Розничная цена: {item.РОЗНИЦА}</p>
                        <hr />
                        <div style={{ display: 'none' }}>{price += item.РОЗНИЦА}</div>
                    </div>
                ))}
                <h3> Итог : {price} рублей</h3>
            </div>
            <Button text='Заказать' func={handleOrder} />
        </div>
    );
}
