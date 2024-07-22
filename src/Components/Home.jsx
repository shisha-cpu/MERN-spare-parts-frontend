import { useSelector } from "react-redux"
import './home.css'
import Button from "./elements/Button"
import { Link } from "react-router-dom"
export default function Home(){

    const user = useSelector(state => state.user)

    return(
        <div className="">
            <div className="header-title">
                 <h1 className="title" >Запчасти для Грузовых Холодильных  Установок</h1>
            </div>
            <div className="home-content">
               <Link to='/catalog'> <Button text='Перейти в каталог' /></Link>
              

            </div>
        </div>
    )
}