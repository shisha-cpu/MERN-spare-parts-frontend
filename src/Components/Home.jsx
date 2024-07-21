import { useSelector } from "react-redux"
import './header.css'
export default function Home(){

    const user = useSelector(state => state.user)

    return(
        <div className="">
            <div className="header-title">
                 <h1 className="title" >Запчасти для Грузовых Холодильных  Установок</h1>
            </div>
            <div className="home-content">
                <button>Перейти в каталог </button>
            </div>
        </div>
    )
}