import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Button from "./elements/Button";
import Modal from "./Modal.jsx";
import './dashboard.css';
import './basket.css';
import RegisterModal from "./RegisterModal.jsx";
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
    const [registerModalOpen, setRegisterModalOpen] = useState(false); // Add state for RegisterModal
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (user.userInfo.username) {
          axios.get(`https://refvrn.ru:4446/user/${user.userInfo.username}/basket`)
            .then(res => {
              setBasket(res.data);
            })
            .catch(err => console.log(err));
        } else {
          const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
          setBasket(storedBasket);
          console.log(storedBasket);
        }
      }, [user.userInfo.username]);  

    const totalPrice = useMemo(() => {
        return basket.reduce((sum, item) => {
            const price = user.userInfo.wholesale ? item.product?.ОПТ : item.product?.РОЗНИЦА;
            return sum + (price || 0) * item.count;
        }, 0);
    }, [basket, user.userInfo.wholesale]);

    const handleOrder = async () => {
        if (!user.userInfo.username) {
            setRegisterModalOpen(true); // Open RegisterModal if not logged in
            return;
        }
        axios.post('https://refvrn.ru:4446/get-order', { email: user.userInfo.email })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

            const orderDetails = basket.map(item => {
                const price = user.userInfo.wholesale ? item.product?.ОПТ : item.product?.РОЗНИЦА;
                return {
                    article: item.product?.Артикул || "не указан",
                    name: item.product?.Наименование_заказа || "не указано",
                    count: item.count,
                    price: price || 0, 
                    total: (price || 0) * item.count 
                };
            });
            
        const totalOrderSum = totalPrice;

        const message = `Заказ от пользователя: ${user.userInfo.username}\n` +
                        `Телефон: ${user.userInfo.phone}\n` +
                        `Почта: ${user.userInfo.email}\n` +
                        `Товары:\n` + orderDetails.map(item => `${item.name}`).join('\n') +
                        `\nИтог: ${totalOrderSum} рублей`;

                        try {
                            const res = await axios.post('https://refvrn.ru:4446/api/send-order', {
                                username: user.userInfo.username,
                                phone: user.userInfo.phone,
                                email: user.userInfo.email,
                                orderDetails,
                                totalOrderSum
                            });
                        
                            const data = res.data; // Здесь используется res.data вместо response.json()
                            

                            if (data.success) {
                                await sendTelegramMessage(message);
                                setModal({
                                    isOpen: true,
                                    title: 'Ваш заказ успешно отправлен!',
                                    message: 'Ожидайте звонка менеджера',
                                });
                                setBasket([]);
                                localStorage.removeItem('basket');
                            } else {
                                setModal({
                                    isOpen: true,
                                    title: 'Ошибка при отправке заказа',
                                    message: 'Попробуйте снова позже.',
                                });
                            }
                        } catch (error) {
                            console.log(error);
                            setModal({
                                isOpen: true,
                                title: 'Ошибка при отправке заказа',
                                message: 'Попробуйте снова позже.',
                            });
                        }
    };

    const handleDelete = async (index) => {
        try {
            await axios.delete(`https://refvrn.ru:4446/${user.userInfo.username}/basket/${index}`);
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
            await axios.put(`https://refvrn.ru:4446/${user.userInfo.username}/basket/${index}`, {
                count: newCount,
            });
        } catch (error) {
            console.error('Ошибка при обновлении количества:', error);
        }
    };

    return (
        <div className="basket-container basket">
            <h1 className="basket-header">Корзина </h1>
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
                                    {/* <div className="basket-item-header">
                                        <p>{productName}</p>
                                    </div> */}
            
                                    <p className="basket-artic">Артикул: <span ><strong>{article}</strong></span> </p>
                                    <p>Наименание : {productName} </p>
                      
                                    <p>Производитель: {manufacturer}</p>
                                    {user.userInfo.wholesale ? <p>Цена: <span><strong>{item.product.ОПТ} ₽</strong></span>  </p> : <p>Цена:  <span ><strong>{retailPrice}₽</strong></span></p>}
                                    {/* <p>Каталог: {catalog}</p> */}
                            
                               
                          
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
                    <h3 className="basket-total-txt">Итог: {totalPrice} рублей</h3>
                    <Button text='Заказать' func={handleOrder} />
                </div>
            )}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => {
                    setModal({ ...modal, isOpen: false });
                    window.location.reload();
                    return false;
                }}
                title={modal.title}
                message={modal.message}
            />
            <RegisterModal isOpen={registerModalOpen} onClose={() => setRegisterModalOpen(false)} /> {/* Add RegisterModal component */}
        </div>
    );
}
