import { useSelector } from "react-redux"
import './home.css'
import Button from "./elements/Button"
import { Link } from "react-router-dom"
import Profit from "./elements/Profit"
import Title from "./elements/Title"
import photo from '../../public/фотосклада .jpg'
export default function Home(){

    const user = useSelector(state => state.user)

    return(
        <div className="container">
            <div className="header-title">
                 <h1 className="title" >Запчасти для Грузовых Холодильных  Установок</h1>
            </div>

            <div className="home-content">
               <div className="home-btn">
                   <Link to='/catalog'>
                     <Button text='Перейти в каталог' />
                   </Link>
               </div>
             
               <div className="cards-container">
                    <Title text='Наши приемущества' />
                    <Profit  />
                </div>
                <Title  text='О нас ' />
                <div className="about-block">
                    <div className="about-photo">
                        <img src="../../public/фотосклада .jpg" alt="About us" />
                    </div>
                    <div className="about-content">
                        <p>Мы специализируемся на предоставлении качественных запчастей для грузовых холодильных установок. Наша команда обладает многолетним опытом и всегда готова помочь вам с выбором необходимых деталей.</p>
                        <div className="home-btn">
                            <Link to='/about'>
                                <Button text='Узнать больше' />
                            </Link>
                        </div>
                    </div>
                </div>
                <Title text='Отзывы' />
                <div className="feedback">
                    <div className="feedback-card">
                        <div className="feedback-photo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Ivan_Petrov-.jpg" alt="User 1" />
                        </div>
                        <div className="feedback-content">
                            <p>"Отличный сервис и качество запчастей. Очень доволен!"</p>
                            <span>- Иван Петров</span>
                        </div>
                    </div>
                    <div className="feedback-card">
                        <div className="feedback-photo">
                            <img src="https://static.tvmaze.com/uploads/images/original_untouched/299/748132.jpg" alt="User 2" />
                        </div>
                        <div className="feedback-content">
                            <p>"Быстрая доставка и хорошие цены. Рекомендую."</p>
                            <span>- Ольга Иванова</span>
                        </div>
                    </div>
                    <div className="feedback-card">
                        <div className="feedback-photo">
                            <img src="https://avatars.mds.yandex.net/get-entity_search/1244417/728434186/S600xU_2x" alt="User 3" />
                        </div>
                        <div className="feedback-content">
                            <p>"Профессиональный подход и отличная поддержка."</p>
                            <span>- Сергей Смирнов</span>
                        </div>
                    </div>
                    <footer className="footer">
                <div className="waves">
                    <div className="wave" id="wave1"></div>
                    <div className="wave" id="wave2"></div>
                    <div className="wave" id="wave3"></div>
                    <div className="wave" id="wave4"></div>
                </div>
                <ul className="social-icon">
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <ion-icon name="logo-facebook"></ion-icon>
                    </a></li>
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <ion-icon name="logo-twitter"></ion-icon>
                    </a></li>
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </a></li>
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <ion-icon name="logo-instagram"></ion-icon>
                    </a></li>
                </ul>
                <ul className="menu">
                    <li className="menu__item"><a className="menu__link" href="#">Главная</a></li>
                    <li className="menu__item"><a className="menu__link" href="#">Каталог</a></li>
                    <li className="menu__item"><a className="menu__link" href="#">О нас</a></li>
                    <li className="menu__item"><a className="menu__link" href="#">Контакты</a></li>
                </ul>
                <p>&copy;2021 Все права защищены </p>
            </footer>

            {/* Ionicons Script */}
            <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
                    </div>
            </div>
          

        </div>
    )
}