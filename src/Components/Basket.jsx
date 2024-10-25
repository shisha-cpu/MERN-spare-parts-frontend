import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Button from "./elements/Button";
import Modal from "./Modal.jsx";
import './dashboard.css';

const botToken = '6905722948:AAFcLUxKVCJ1tIF03S8l2xLbjo50buyYYoU';
const chatId = '1137493485';

const sendTelegramMessage = async (message) => {
    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
};

export default function Basket() {
    const [basket, setBasket] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
    const user = useSelector(state => state.user);

    useEffect(() => {
        const savedBasket = localStorage.getItem('basket');
        if (savedBasket) {
            setBasket(JSON.parse(savedBasket));
        }
    }, []);

    useEffect(() => {
        if (user.userInfo.username) {
            axios.get(`http://62.217.181.247:4445/user/${user.userInfo.username}/basket`)
                .then(res => {
                    setBasket(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [user.userInfo.username]);

    useEffect(() => {
        localStorage.setItem('basket', JSON.stringify(basket));
    }, [basket]);

    const totalPrice = useMemo(() => {
        return basket.reduce((sum, item) => {
            const price = user.userInfo.wholesale ? item.product?.ОПТ : item.product?.РОЗНИЦА;
            return sum + (price || 0) * item.count;
        }, 0);
    }, [basket, user.userInfo.wholesale]);

    const handleOrder = async () => {
        console.log(user.userInfo.email);
        axios.post('http://62.217.181.247:4445/get-order', { email: user.userInfo.email })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

        const orderDetails = basket.map(item => ({
            article: item.product?.Артикул || "не указан",
            name: item.product?.Наименование_заказа || "не указано",
            count: item.count,
            price: item.product?.РОЗНИЦА || 0,
            total: (item.product?.РОЗНИЦА || 0) * item.count
        }));

        const totalOrderSum = totalPrice;

        const message = `Заказ от пользователя: ${user.userInfo.username}\n` +
                        `Телефон: ${user.userInfo.phone}\n` +
                        `Почта: ${user.userInfo.email}\n` +
                        `Товары:\n` + orderDetails.map(item => `${item.name}`).join('\n') +
                        `\nИтог: ${totalOrderSum} рублей`;

        try {
            const response = await fetch('http://62.217.181.247:4445/api/send-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user.userInfo.username,
                    phone: user.userInfo.phone,
                    email: user.userInfo.email,
                    orderDetails,
                    totalOrderSum
                })
            });

            const data = await response.json();
            if (data.success) {
                await sendTelegramMessage(message);
                setModal({
                    isOpen: true,
                    title: 'Успех',
                    message: 'Ваш заказ был успешно отправлен!',
                });

                setBasket([]);
                localStorage.removeItem('basket');
            } else {
                setModal({
                    isOpen: true,
                    title: 'Ошибка',
                    message: 'Ошибка при отправке заказа',
                });
            }
        } catch (error) {
            console.log(error);
            setModal({
                isOpen: true,
                title: 'Ошибка',
                message: 'Ошибка при отправке заказа',
            });
        }
    };

    const handleDelete = async (index) => {
        try {
            await axios.delete(`http://62.217.181.247:4445/${user.userInfo.username}/basket/${index}`);
            setBasket(basket.filter((_, i) => i !== index));
        } catch (error) {
            console.log(error);
            setModal({
                isOpen: true,
                title: 'Ошибка',
                message: 'Ошибка при удалении товара из корзины',
            });
        }
    };

    const updateCount = async (index, newCount) => {
        const updatedBasket = basket.map((item, i) =>
            i === index ? { ...item, count: newCount } : item
        );
        setBasket(updatedBasket);

        try {
            await axios.put(`http://62.217.181.247:4445/${user.userInfo.username}/basket/${index}`, {
                count: newCount,
            });
        } catch (error) {
            console.error('Ошибка при обновлении количества:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Корзина пользователя: {user.userInfo.username}</h1>
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
                                    {user.userInfo.wholesale ? <p>Цена: {item.product.ОПТ}</p> : <p>Цена: {retailPrice}</p>}
                                    <div className="quantity-container">
                                        <p>Количество : </p>
                                        <div className="quantity-section">
                                        <button className="minus" onClick={() => updateCount(index, item.count > 1 ? item.count - 1 : 1)}>- </button>
                                        <div className="input-container">
                                        <input
                                            className="quantity-input"
                                            type="number"
                                            value={item.count  == 0 ? '' : item.count }
                                            min="1"
                                            onChange={(e) => updateCount(index, Math.max(0, Number(e.target.value)))}
                                        />
                                        </div>
                                        <button onClick={() => updateCount(index, item.count + 1)}>+</button>
                                        </div>
                                    </div>
                                </div>
                                <button className="delete-button" onClick={() => handleDelete(index)}>Удалить</button>
                            </div>
                        );
                    })}
                    <h3 className="total-txt">Итог: {totalPrice} рублей</h3>
                    <Button text='Заказать' func={handleOrder} />
                </div>
            )}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
}
