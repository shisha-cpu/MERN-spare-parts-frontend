import React, { useEffect, useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/slices/userSlice';

export default function Header() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        dispatch(clearUser());
        closeMenu();
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to='/' onClick={closeMenu}><img src="../../public/logo.png" alt="Logo" /></Link>
            </div>
            <div className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
       
                <div className="contact-links">
                    <p>
                    <a href="tel:+79515515625">+79515515625</a> <br />
                <a href="https://wa.me/+79515515625">WhatsApp</a><br/>
                     <a href="https://t.me/Refvrn">Telegram</a>
                    </p>
                </div>
                <ul>
                        <li><Link to='/' onClick={closeMenu}>Главная</Link></li>
                        <li><Link to='/catalog' onClick={closeMenu}>Каталог</Link></li>
                        <li><Link to='/about' onClick={closeMenu}>О нас</Link></li>
                        <li><Link to='/contact' onClick={closeMenu}>Контакты</Link></li>
                    </ul>
                <ul>
                    {!user.isLoggin ? (
                        <>
                            <li><Link to='/register' onClick={closeMenu}>Регистрация</Link></li>
                            <li><Link to='/login' onClick={closeMenu}>Вход</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to='/basket' onClick={closeMenu}>Корзина</Link></li>
                            <li><Link to='/dashboard' onClick={closeMenu}>Личный кабинет</Link></li>
                            <li><button onClick={handleLogout}>Выйти</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
