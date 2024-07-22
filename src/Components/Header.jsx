import { useEffect, useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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

    console.log(user);

    return (
        <header className="header">
            <div className="logo">
                <img src="path-to-your-logo.png" alt="Logo" />
            </div>
            <div className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
                <div className="merge">
                    <ul>
                        <li><Link to='/'>Главная</Link></li>
                        <li><Link to='/catalog'>Каталог</Link></li>
                        <li><Link to='/about'>О нас</Link></li>
                        <li><Link to='/contact'>Контакты</Link></li>
                    </ul>
                </div>
                <ul>
                    {!user.isLoggin ? (
                        <>
                            <li><Link to='/register'>Регистрация</Link></li>
                            <li><Link to='/login'>Вход</Link></li>
                        </>
                    ) : (
                        <li>Пользователь: {user.userInfo.username}</li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
