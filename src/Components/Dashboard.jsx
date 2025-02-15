import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./elements/Button";
import Modal1 from "./Modal1"; // Assuming you have a modal component for editing
import './dashboard.css';
import { setUser } from "../store/slices/userSlice";

export default function Dashboard() {
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', userData: {} });
    const [historyOrders, setHistoryOrder] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState([]); // To keep track of which order is expanded
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    // Fetch order history
    useEffect(() => {
        axios.get(`https://refvrn.ru:4446/user/${user.userInfo.username}/order-history`)
            .then(res => {
                // Sort orders by the date in descending order
                const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setHistoryOrder(sortedOrders);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [user.userInfo.username]);

    const openEditModal = () => {
        setModal({
            isOpen: true,
            title: 'Изменить данные пользователя',
            message: 'Пожалуйста, внесите изменения:',
            userData: { ...user.userInfo }
        });
    };

    const updateUserData = (updatedData) => {
        const { username, email, phone } = updatedData;
        axios.put(`https://refvrn.ru:4446/user/${user.userInfo.username}/update`, {
            newUsername: username, 
            email,
            phone,
        })
        .then(res => {
            setModal({ ...modal, isOpen: false });
            dispatch(setUser(res.data.user));
            console.log("Данные пользователя успешно обновлены:", res.data);
        })
        .catch(err => {
            console.error("Ошибка при обновлении данных:", err);
        });
    };

    // Handle toggle of order visibility
    const toggleOrder = (orderId) => {
        setExpandedOrders(prevState => 
            prevState.includes(orderId) 
                ? prevState.filter(id => id !== orderId) 
                : [...prevState, orderId]
        );
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Личный кабинет пользователя: {user.userInfo.username}</h1>

            <div className="user-data-list">
                <ul>
                    <li><strong>Имя:</strong> {user.userInfo.username}</li>
                    <li><strong>Email:</strong> {user.userInfo.email}</li>
                    <li><strong>Телефон:</strong> {user.userInfo.phone}</li>
                    <li><strong>Оптовик:</strong> {user.userInfo.wholesale ? 'Да' : 'Нет'}</li>
                </ul>

                <Button text='Изменить данные' func={openEditModal} />
                <h4>История заказов:</h4>
                {isLoading ? (
                    <p>Загрузка истории заказов...</p>
                ) : historyOrders.length > 0 ? (
                    <ul className="order-history">
                    {historyOrders.map((order, index) => {
                        // Рассчитываем totalAmount для каждого заказа
                        const totalAmount = order.products.reduce((total, product) => {
                            const productPrice = user.userInfo.wholesale 
                                ? product.product.ОПТ // Оптовая цена
                                : product.product.РОЗНИЦА; // Розничная цена
                            return total + (productPrice * product.count); // Суммируем стоимость каждого продукта
                        }, 0);
                
                        // Номер заказа, начиная с последнего
                        const orderNumber = historyOrders.length - index;
                
                        return (
                            <li key={order._id}>
                                <div 
                                    onClick={() => toggleOrder(order._id)} 
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    <h5>
                                        Заказ #{orderNumber} - Сумма: {totalAmount} ₽ - Дата: {new Date(order.orderDate).toLocaleString()}
                                    </h5>
                                    <span 
                                        style={{ 
                                            transform: expandedOrders.includes(order._id) ? 'rotate(180deg)' : 'rotate(0)', 
                                            transition: 'transform 0.3s ease', 
                                            marginLeft: '10px', 
                                            fontSize: '16px', 
                                            color: '#333' 
                                        }}
                                    >
                                        ▼
                                    </span>
                                </div>
                                {expandedOrders.includes(order._id) && (
                                    <ul>
                                        {order.products.map((product, productIndex) => (
                                            <li key={product._id}>
                                                <strong>Наименование:</strong> {product.product.Наименование} <br />
                                                <strong>Артикул:</strong> {product.product.Артикул} <br />
                                                <strong>Количество:</strong> {product.count} <br />
                                                <strong>Производитель:</strong> {product.product.Производитель} <br />
                                                {user.userInfo.wholesale 
                                                    ? <><strong>Оптовая цена:</strong> {product.product.ОПТ} ₽ <br /></>
                                                    : <><strong>Розничная цена:</strong> {product.product.РОЗНИЦА} ₽ <br /></>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
                
                
                
                
                
                
                
                ) : (
                    <p>Нет истории заказов.</p>
                )}
            </div>

            {/* Modal for editing user data */}
            <Modal1 
                isOpen={modal.isOpen} 
                title={modal.title} 
                message={modal.message} 
                userData={modal.userData}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onSave={updateUserData}
            />
        </div>
    );
}
