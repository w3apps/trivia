exports = (typeof window !== "undefined" && window !== null) ? window : global;

exports.Game = function() {
  "use strict";

  // === GAME CONSTANTS ===
  var requiredPointsToWin = 6; // this is the required points a player needs to win
  var questionsPerCategory = 50; // the number of questions in each category

  // === VARIABLES that will be manipulated ===
  var players          = [];
  var places           = new Array(6);
  var purses           = new Array(6);
  var inPenaltyBox     = new Array(6);

  var popQuestions     = [];
  var scienceQuestions = [];
  var sportsQuestions  = [];
  var rockQuestions    = [];

  var currentPlayer    = 0;
  var isGettingOutOfPenaltyBox = false;

  /**
   * This method initialises the game
   */
  this.init = function () {

    // generate questions
    for (var i = 0; i < questionsPerCategory; i++) {
      popQuestions.push("Pop Question " + i);
      scienceQuestions.push("Science Question " + i);
      sportsQuestions.push("Sports Question " + i);
      rockQuestions.push("Rock Question " + i);
    }

  };

  /**
   * This method adds a player to the game
   * @param playerName {String}
   * @returns {boolean}
   */
  this.addPlayer = function(playerName){

    players.push(playerName);
    places[players.length - 1] = 0;
    purses[players.length - 1] = 0;
    inPenaltyBox[players.length - 1] = false;

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

  };

  /**
   * This method rolls the dice
   * @param roll {Number}
   */
  this.roll = function(roll){
    console.log(players[currentPlayer] + " is the current player");
    console.log("They have rolled a " + roll);

    // if the player is in the penalty box, check if he will be stuck there or not
    if (inPenaltyBox[currentPlayer] && roll % 2 === 0) {
      isGettingOutOfPenaltyBox = false;
      console.log(players[currentPlayer] + " is not getting out of the penalty box");
    }
    else if (inPenaltyBox[currentPlayer]) {
      isGettingOutOfPenaltyBox = true;
      console.log(players[currentPlayer] + " is getting out of the penalty box");
    }

    // calculate new location
    places[currentPlayer] = places[currentPlayer] + roll;

    // if it reaches the end of the board continue in a circle from the start
    if(places[currentPlayer] > 11){
      places[currentPlayer] = places[currentPlayer] - 12;
    }

    console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
    console.log("The category is " + currentCategory(places[currentPlayer]));
    askQuestion();

  };

  /**
   * This method marks a correct answer
   * @returns {boolean}
   */
  this.wasCorrectlyAnswered = function() {

    var playerStillInPenaltyBox = (inPenaltyBox[currentPlayer] && !isGettingOutOfPenaltyBox);

    if (!playerStillInPenaltyBox) {
      console.log("Answer was correct!!!!");
      purses[currentPlayer] += 1;
      console.log(players[currentPlayer] + " now has " + purses[currentPlayer] + " Gold Coins.");
    }

    // move to next player
    currentPlayer = getNextPlayer();

    // if the player is still return true, otherwise check if won
    return (playerStillInPenaltyBox) ? true : didPlayerWin();

  };

  /**
   * This method marks answer as Wrong
   * @returns {boolean}
   */
  this.wrongAnswer = function() {

    console.log('Question was incorrectly answered');
    console.log(players[currentPlayer] + " was sent to the penalty box");
    inPenaltyBox[currentPlayer] = true;

    // move to next player
    currentPlayer = getNextPlayer();

    return true;

  };

  // === PRIVATE FUNCTIONS ===

  // Function that returns true when a player gets enough points
  function didPlayerWin() {
    return !(purses[currentPlayer] === requiredPointsToWin)
  }

  // Function that returns a category
  function currentCategory() {

    switch(places[currentPlayer]) {

      case 0:
      case 4:
      case 8:
        return "Pop";

      case 1:
      case 5:
      case 9:
        return "Science";

      case 2:
      case 6:
      case 10:
        return "Sports";

      default:
        return "Rock";
    }

  }

  // Function that gets a question from a specific category
  function askQuestion(){

    if(currentCategory() === "Pop") {
      console.log(popQuestions.shift());
    }
    if(currentCategory() === "Science") {
      console.log(scienceQuestions.shift());
    }
    if(currentCategory() === "Sports") {
      console.log(sportsQuestions.shift());
    }
    if(currentCategory() === "Rock") {
      console.log(rockQuestions.shift());
    }

  }

  // returns the next player index
  function getNextPlayer() {

    var nextPlayer = currentPlayer + 1;

    // start from the first player if we reached reached the end of the list
    if (nextPlayer === players.length) {
      nextPlayer = 0;
    }

    return nextPlayer;

  }

};

var notAWinner = false;

// create a new game
var game = new Game();

// initialise the game
game.init();

// add some players to the game
game.addPlayer("Chet");
game.addPlayer("Pat");
game.addPlayer("Sue");

// roll the dice until there's a winner
do {

  game.roll(Math.floor(Math.random() * 6) + 1);

  if (Math.floor(Math.random() * 10) === 7){
    notAWinner = game.wrongAnswer();
  }
  else {
    notAWinner = game.wasCorrectlyAnswered();
  }

} while (notAWinner);
