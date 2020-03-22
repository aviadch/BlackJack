import React from "react";
import Card from "./Card";

class Player extends React.Component {
  /*constructor(props){
        super(props)
        
    }*/

  render() {
    //Traverse the card list and add Card component for each
    const cardCompList = this.props.cards.map(cardCode => {
      return <Card key={cardCode} code={cardCode} />;
    });

    let buttons = (
      <div>
        <button onClick={this.props.hitHandler}>Hit</button>
        <button onClick={this.props.stayHandler}>Stay</button>
      </div>
    );

    if (this.props.name === "Dealer"){
        buttons=<br></br>
    }

    return (
      <div className="player">
        <h1>{this.props.name}</h1>
        {cardCompList}
        <h2>Score:{this.props.score}</h2>
        <br />
        {buttons}
      </div>
    );
  }
}

export default Player;
