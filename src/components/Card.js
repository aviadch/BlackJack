import React from "react";

class Card extends React.Component {
  //Constructor is useless
  /*constructor(props){
        super(props)
    }*/

  render() {
    return (
      <img
        src={
          "https://deckofcardsapi.com/static/img/" + this.props.code + ".png"
        }
        alt={this.props.code}
      ></img>
    );
  }
}

export default Card;
