import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // Подключение файла стилей
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { setUser } from '../store/slices/userSlice';
import Button from './elements/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4444/login', {
                email,
                password
            }
        );

            localStorage.setItem('token', response.data.token);
            setMessage('Вход выполнен успешно');
            dispatch(setUser({ email, username: response.data.username ,  }));
            setRedirect(true);
            console.log(response.data);
        } catch (error) {
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
        <div className="login-container">
            <h2>Вход</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="auth-btn">
                    <Button text='Войти' />
                </button>
            </form>
        </div>
    );
};

export default Login;
