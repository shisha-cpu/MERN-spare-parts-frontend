import { useSelector } from "react-redux"

export default function Home(){

    const user = useSelector(state => state.user)

    return(
        <div className="container">
            <h1 style={{color: 'white'}}>Главная</h1>
        </div>
    )
}