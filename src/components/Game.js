import React from "react"

import Player from "./Player"

class Game extends React.Component{

    constructor(props){
        super(props)

        this.state={
            deckId:null
        }
    }

    componentDidMount(){
        fetch('https://deckofcardsapi.com/api/deck/new/')
        .then(res => res.json())
        .then((data) => {
          this.setState({ deckId: data["deck_id"] })
          console.log(this.state)
        })
        .catch(console.log)
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