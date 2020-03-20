import React from "react"



class Card extends React.Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            <img src={"https://deckofcardsapi.com/static/img/" + this.props.code + ".png"}></img>
        )
    }


}


export default Card