import React from "react"
import Card from "./Card"
import Game from "./Game"
class App extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        return (
            <div className="App">
                <Game/>
            </div>
        )
    }


}



export default App