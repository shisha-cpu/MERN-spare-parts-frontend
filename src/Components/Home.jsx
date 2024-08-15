import { useSelector } from "react-redux"
import './home.css'
import Button from "./elements/Button"
import { Link } from "react-router-dom"
import Profit from "./elements/Profit"
import Title from "./elements/Title"

export default function Home(){

    const user = useSelector(state => state.user)

    return(
        <div className="container">
            <div className="header-title">
                 <h1 className="title" >Магазин запчастей для рефрижераторов</h1>
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
                        <p>Мы специализируемся на предоставлении качественных запчастей для рефрижераторов  Thermo king & Carrier. Наша команда обладает многолетним опытом и всегда готова помочь вам с выбором необходимых деталей.</p>
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
                            <p>"Большой выбор и хорошее качество запчастей!"</p>
                            <span>- Михаил Анатольевич</span>
                        </div>
                    </div>
                    <div className="feedback-card">
                        <div className="feedback-photo">
                            <img src="https://avatars.mds.yandex.net/i?id=e0c6c6c4cf38a67410ed4193b1cf69be_l-5288900-images-thumbs&n=13" alt="User 2" />
                        </div>
                        <div className="feedback-content">
                            <p>"Быстрая доставка и хорошие цены. Рекомендую."</p>
                            <span>- Денис Олегович</span>
                        </div>
                    </div>
                    <div className="feedback-card">
                        <div className="feedback-photo">
                            <img src="https://avatars.mds.yandex.net/get-entity_search/1244417/728434186/S600xU_2x" alt="User 3" />
                        </div>
                        <div className="feedback-content">
                            <p>"Профессиональный подход и отличная поддержка."</p>
                            <span>- Сергей Николаевич</span>
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

     
            <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
                    </div>
            </div>
          

        </div>
    )
}