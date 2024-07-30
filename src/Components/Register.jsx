import React, { useState } from 'react';
import axios from 'axios';
import './register.css'; // Подключение файла стилей
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Пароли не совпадают');
            return;
        }

        try {
            const response = await axios.post('http://62.113.108.165:4444/register', {
                username,
                email,
                password, 
                wholesale: false,
                phone
            });

            console.log('Server response:', response.data);
            setMessage(response.data.message);
            // localStorage.setItem('user', JSON.stringify(userData));
            if (response.data.message === 'User registered successfully') {
                const basket = []; // Initialize basket as an empty array
                dispatch(setUser({ username, email, wholesale: false, basket, phone }));
                setRedirect(true);
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Произошла ошибка. Попробуйте еще раз.');
            }
        }
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="register-container">
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
                        type='tel'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="register-button">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
