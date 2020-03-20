import React from "react"
import Card from "./Card"
class App extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        return (
            <div className="App">
                <h1>Test</h1>
                <Card code="2D"></Card>
                <Card code="8D"></Card>
            </div>
        )
    }


}



export default App