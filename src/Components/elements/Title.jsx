import './title.css'

export default function Title(props){
    return(
        <div className="title-container">
            <h1 style={{color: 'white'}}>{props.text} </h1>
            <div className="line"></div>
        </div>
    )
}