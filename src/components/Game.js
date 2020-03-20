import React from "react"
import Card from "./Card"
import Player from "./Player"

class Game extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="Game">
                <Player/>
                <Player/>
            
            
            </div>
        )
    }
}





export default Game