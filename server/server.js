var express = require("express");
var fetch = require("node-fetch");
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get("/newGame", function(req, res) {
  console.log("I got a mission to start a new game");
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle")
    .then(apiRes => apiRes.json()).then(jsonRes=> {
      console.log("Succeed!! move the response", jsonRes)
      var deckId = jsonRes["deck_id"]
      console.log("Ret deck id:", deckId)
      res.send(deckId);
    });


    
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
