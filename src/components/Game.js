import React from "react";

import Player from "./Player";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckId: null,
      playersCards: {
        Dealer: [],
        Aviad: []
      },
      turn: "Start",
      winner: null
    };

    this.draw = this.draw.bind(this);
    this.stayHandler = this.stayHandler.bind(this);
    this.hitHandler = this.hitHandler.bind(this);
    this.dealerStopTerm = this.dealerStopTerm.bind(this);
    this.dealerDraw = this.dealerDraw.bind(this);
    this.announceWinner = this.announceWinner.bind(this);
    //this.startGame = this.startGame.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  //Make a new deck
  componentDidMount() {
    this.newGame();
  }

  newGame() {
    fetch("http://localhost:8081/newGame")
      .then(resp => resp.text())
      .then(data => {
        debugger;
        this.setState({
          deckId: data,
          playersCards: {
            Dealer: [],
            Aviad: []
          },
          turn: "Aviad",
          winner: null
        });
      })
      .then(data => {
        this.draw("Dealer");
      })
      .catch(console.log);
  }

  //Draw a card from  the current deck for the playername
  draw(playerName) {
    let promiseToDraw = fetch(
      "https://deckofcardsapi.com/api/deck/" + this.state.deckId + "/draw/"
    );
    //Convert to Json
    let promiseToJson = promiseToDraw.then(response => response.json());

    //After converting to Json - paste it in the state.
    let promiseToUpdateState = promiseToJson
      .then(data => {
        this.setState(prevState => {
          //console.log(data);
          let newCardCode = data.cards[0]["code"];
          let newState = { players: { ...prevState.playersCards } };
          newState.players[playerName].push(newCardCode);
          //console.log("New Card code: " + newCardCode);
          //TODO Game.cardMapper(newCardCode)
          return newState;
        });
      })
      .catch(console.log);

    return promiseToUpdateState;
  }

  hitHandler(playerName) {
    //we hit just if its player turn
    if (this.state.turn !== playerName) {
      alert("not your turn basterd");
    } else {
      //We draw
      let promiseToDraw = this.draw(playerName);

      //After the draw we update state if busted:
      promiseToDraw.then(data => {
        let playerScore = Game.calcScore(this.state.playersCards[playerName]);
        if (playerScore === "Bust") {
          this.setState({ turn: "Bust" });
          this.announceWinner();
        }
      });
    }
  }

  announceWinner() {
    debugger;
    //Announce winner:
    let playerScore = Game.calcScore(this.state.playersCards["Aviad"]);
    let dealerScore = Game.calcScore(this.state.playersCards["Dealer"]);
    let isPlayerWin = Game.isPlayerWin(dealerScore, playerScore);
    this.setState({ winner: isPlayerWin ? "Aviad" : "Dealer" });
  }

  stayHandler() {
    //If we busted - we cant do nothing

    //Changing turns
    this.setState({ turn: "Dealer" });

    //Dealer draw untill finish
    this.dealerDraw(() => this.announceWinner());
  }

  dealerStopTerm() {
    let curDealerScore = Game.calcScore(this.state.playersCards["Dealer"]);

    //If black jack, if 17 or more, if busted
    if (
      curDealerScore === "BJ" ||
      curDealerScore === "Bust" ||
      curDealerScore >= 17
    ) {
      return true;
    } else {
      return false;
    }
  }

  //BlackJack logic -dealer will draw untill he get 17 or busted
  dealerDraw(finishCallback) {
    if (!this.dealerStopTerm()) {
      this.draw("Dealer").then(() =>
        setTimeout(() => this.dealerDraw(finishCallback), 1000)
      );
    } else {
      finishCallback();
    }
  }

  /*startGame() {
    this.draw("Dealer");
  }*/

  //BlackJack logic - return the correct number for each card
  //Aces return array as they can be 1 or 11 depends on current score situation withoutthem
  static cardMapper(cardCode) {
    //Cut the last letter (we dont care about suites)
    let cardValue = cardCode.slice(0, -1);
    let retValue = 0;
    //If we have picutre (KingQueenPrince) - we count it as 10
    if (
      cardValue === "K" ||
      cardValue === "Q" ||
      cardValue === "J" ||
      cardValue === "0"
    ) {
      retValue = 10;
    }

    //If we have ace - we count it as 1 or 11
    else if (cardValue === "A") {
      retValue = "A";
    } else {
      retValue = Number(cardValue);
    }

    //console.log("Mapper observation:" + retValue);
    return retValue;
  }

  //BlackJack logic - on given two scores which one is gonna win the game?
  // BJ - blackjack which mean 21 from pic+ace
  static isPlayerWin(dealer, player) {
    //console.log("dealer: " + dealer + " player: " + player);
    let playerWin = false;
    //  dealer with BJ - Dealer win
    if (dealer === "BJ") {
      playerWin = false;
    }

    // Black

    // Tie without BJ - Split
    else if (dealer === player && dealer !== "BJ") {
      playerWin = "Split";
    }

    // player is busted - Dealer win
    else if (player > 21) {
      playerWin = false;
    }

    // dealer is busted and player isnt - Player win
    else if (
      ((dealer > 21 || dealer === "Bust") && player <= 21) ||
      (player <= 21 && dealer < player)
    ) {
      playerWin = true;
    }
    //console.log("did player win: " + playerWin);
    return playerWin;
  }

  static cardListReducer(currentVal, addedVal) {
    // If we handle just a normal card (not an array) - we just add it:
    if (!Array.isArray(addedVal)) {
      return currentVal + addedVal;
    }

    // Else - we choose the better
    else {
    }
  }

  //Getting list of cards and return the option we can do
  static aceOptions(cardList) {
    let options = [];
    //stop term - no aces
    if (cardList.every(x => x !== "A")) {
      //console.log("No Aces!");
      options.push(cardList);
      return options;
    } else {
      //console.log("Aces!");
      //replace the first ace with 1\11 and re run
      let i = cardList.indexOf("A");

      let oneOption = cardList.slice();
      oneOption[i] = 1;

      let elevenOption = cardList.slice();
      elevenOption[i] = 11;

      let v1 = Game.aceOptions(oneOption);
      let v11 = Game.aceOptions(elevenOption);

      //console.log(v1);
      // console.log(v11);

      options.push(...v1);
      options.push(...v11);

      //console.log(options);
      return options;
    }
  }

  //Given options according to aces we chose the best
  static chooseBestOption(optionsList) {
    //console.log(optionsList);

    //Get raw score for each list
    let sumsOfOptions = optionsList.map(optionArray => {
      if (false) {
        // TODO Game.isBlackJack(optionArray)) {
        return "BJ";
      } else {
        //console.log(optionArray);
        let rawSum = optionArray.reduce((a, b) => {
          //console.log(b);
          return a + b;
        }, 0);
        //console.log("rawSum:" + rawSum);
        return rawSum;
      }
    });
    //console.log(sumsOfOptions);

    //reduce by checking each element against each other like it was the dealer
    let chosen = sumsOfOptions.reduce((prev, cur) => {
      if (!Game.isPlayerWin(prev, cur)) {
        return prev;
      } else {
        return cur;
      }
    }, -1);

    return chosen === -1 ? "Bust" : chosen;
  }
  static calcScore(cardList) {
    //console.log("cardList: " + cardList);
    //get only score (numbers and A)
    const scoreOnlyArray = cardList.map(Game.cardMapper);

    //console.log("ScoreOnly: " + scoreOnlyArray);

    let options = Game.aceOptions(scoreOnlyArray);

    let bestOptionSum = Game.chooseBestOption(options);
    /*console.log(
      "Best option: " + bestOptionSum + "Based on options: " + options
    );*/

    //BlackJack check:
    if (bestOptionSum === 21 && cardList.length === 2) {
      return "BJ";
    } else {
      return bestOptionSum;
    }
  }

  static isBlackJack(cardList) {
    // Must be 2 cards:
    if (cardList.length !== 2) {
      return false;
    }

    // 21 can be from 2 cards only if its black jack
    if (Game.calcScore(cardList) === 21) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    //Traverse the player list and add Player component for each
    let playerListComps = [];
    for (let player in this.state.playersCards) {
      let curComp = (
        <Player
          key={player}
          name={player}
          cards={this.state.playersCards[player]}
          score={Game.calcScore(this.state.playersCards[player])}
          hitHandler={() => this.hitHandler(player)}
          stayHandler={this.stayHandler}
        />
      );
      playerListComps.push(curComp);
    }

    //A player for testing
    /*const playerTest = (
      <Player
        key="test2"
        name="test"
        cards={["AS", "0D"]}
        score={Game.calcScore(["AS", "0D"])}
      />
    );*/

    let winnerMessage = this.state.winner ? (
      <h1>The winner is:{this.state.winner}</h1>
    ) : null;

    return (
      <div className="Game">
        {winnerMessage}
        {playerListComps}
        <button onClick={this.newGame}>Start Game</button>
      </div>
    );
  }
}

export default Game;
