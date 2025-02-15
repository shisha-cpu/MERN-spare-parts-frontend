import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';

const RegisterModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if user is already logged in (if there's a user object)
        const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
        if (storedBasket.length) {
            console.log("Stored basket found:", storedBasket);
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Пароли не совпадают');
            return;
        }

        try {
            console.log('Начали регистрацию');

            const response = await axios.post('https://refvrn.ru:4446/register', {
                username,
                email,
                password,
                wholesale: false,
                phone
            });

            if (response.status === 200 || response.status === 201) {
                console.log('Регистрация успешна');

                const basket = JSON.parse(localStorage.getItem('basket')) || [];
                // Sending the basket to the server for the registered user
                if (basket.length > 0) {
                    // Send each item from the local basket to the server
                    for (const item of basket) {
                        await axios.post('https://refvrn.ru:4446/add-to-basket', {
                            username,
                            product: item.product,
                            count: item.count
                        });
                    }
                    console.log('Basket successfully added to the user!');
                }

                dispatch(setUser({ username, email, wholesale: false, basket, phone }));
                setRedirect(true);
                onClose();
            }

            const notificationMessage = `
                Новый пользователь: ${username}
                Телефон: ${phone}
                Почта: ${email}
            `;

            const botToken = '6905722948:AAFcLUxKVCJ1tIF03S8l2xLbjo50buyYYoU';
            const chatId = '1137493485';

            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: notificationMessage,
            });

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Произошла ошибка. Попробуйте еще раз.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="register-modal-overlay">
            <div className="register-modal">
                <h2>Регистрация</h2>
                {message && <p className="message">{message}</p>}
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Имя пользователя:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Подтвердите пароль:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="register-button">Зарегистрироваться</button>
                </form>
                {/* <button className="delete-button" onClick={onClose} >Закрыть</button> */}
            </div>
        </div>
    );
};

export default RegisterModal;
