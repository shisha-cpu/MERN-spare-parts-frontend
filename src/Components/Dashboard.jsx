import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "./elements/Button";
import './dashboard.css';

export default function Dashboard() {
    const [basket, setBasket] = useState([]);
    // const [price ,setPrice ] = useState(0)
    let price = 0
    useEffect(() => {
        axios.get('http://localhost:4444/user-basket')
            .then(res => setBasket(res.data))
            .catch(err => console.log(err));
    }, []);
    
    const user = useSelector(state => state.user);

    const handleOrder = () => {
        axios.post('http://localhost:4444/get-order', { username : user.userInfo.username})
            .then(res => {
                console.log(res.data.message);
                setBasket([]);  // Clear local basket state
            })
            .catch(err => console.log(err));
    };
    
    console.log(basket);
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Личный кабинет пользователя: {user.userInfo.username}</h1>
            <div className="user-basket">
                {basket.map((item, index) => (
                    <div key={index} className="basket-item">
                        <div className="basket-item-header">
                            <p>{item.Наименование}</p>
                        </div>
                        <p>Каталог: {item.Каталог}</p>
                        <p>Производитель: {item.Производитель}</p>
                        <p>Артикул: {item.Артикул}</p>
                        {user.userInfo.wholesale && <p>Оптовая цена: {item.ОПТ}</p>}
                        <p>Розничная цена: {item.РОЗНИЦА}</p>
                        <hr />
                        <div style={{display: 'none'}}>{price += item.РОЗНИЦА}</div>
                    </div>
                ))}
                <h3> Итог : {price}</h3>
            </div>
            <Button text='Заказать'  func={handleOrder} />
        </div>
    );
}
