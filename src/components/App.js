import React from "react";
import Game from "./Game";
class App extends React.Component {
  //Constructor is useless
  /*constructor(props){
        super(props)

    }*/

  render() {
    return (
      <div className="app">
        <Game />
      </div>
    );
  }
}

export default App;
