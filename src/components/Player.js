import React from "react"
import Card from "./Card"

class Player extends React.Component{

    constructor(props){
        super(props)

    }


    render(){
       
        return (
            <div className="player">
                <h1>Test</h1>
                <Card code="2D"></Card>
                <Card code="8D"></Card>

            </div>

        )
    }
}




export default Player