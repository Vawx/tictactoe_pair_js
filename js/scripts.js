function Game ( ) {
  this.board = new Board();
  this.players = [new Player("X", false), new Player("O", false)];
}

Game.prototype.gameOver = function () {
  var players = this.players;
  var board = this.board;
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var playerSpaces = board.spacesMarkedBy(player);
    // if any win conditions are met, return that player
    if (winConditionIsMet(playerSpaces)) {return player;}
  }
  return false;
  // if no players are returned, return 'not over'
};

var winConditionIsMet = function(playerSpaces) {
  if (threeInSameLine(playerSpaces, 'xCoordinate')) {return true;}
  else if (threeInSameLine(playerSpaces, 'yCoordinate')) {return true;}
  else if (threeInDiagonal(playerSpaces)) {return true;}
  else {return false;}
  // there is an assortment of three spaces where neither the x or y is repeated
}

var threeInSameLine = function(playerSpaces, coordinateType) {
  var zeroCount = 0;
  var oneCount = 0;
  var twoCount = 0;

  for (var i = 0; i < playerSpaces.length; i++) {
    var space = playerSpaces[i];
    switch (space[coordinateType]) {
      case 0:
        zeroCount += 1;
        if (zeroCount === 3) {return true;}
        break;
      case 1:
        oneCount += 1;
        if (oneCount === 3) {return true;}
        break;
      case 2:
        twoCount += 1;
        if (twoCount === 3) {return true;}
        break;
    }
  }
  return false;
};

var threeInDiagonal = function(playerSpaces) {
  // middleSquare = [1,1]
  var middleSquare = 0;
  // diagonals1 = [0,0] & [2,2]
  var diagonals1 = 0;
  // diagonals1 = [0,2] & [2,0]
  var diagonals2 = 0;

  for (var i = 0; i < playerSpaces.length; i++) {
    var space = playerSpaces[i];
    var middleSquareTest = space.xCoordinate === 1 && space.yCoordinate === 1
    var diagonals1Test = (space.xCoordinate === 0 && space.yCoordinate === 0) ||
      (space.xCoordinate === 2 && space.yCoordinate === 2)
    var diagonals2Test = (space.xCoordinate === 0 && space.yCoordinate === 2) ||
      (space.xCoordinate === 2 && space.yCoordinate === 0)

    if (middleSquareTest) {
      middleSquare += 1;
    } else if (diagonals1Test) {
      diagonals1 += 1;
    } else if (diagonals2Test) {
      diagonals2 += 1;
    }
  }

  if (middleSquare + diagonals1 === 3 || middleSquare + diagonals2 === 3) {
    return true;
  } else {
    return false;
  }
}

function Board() {
  this.spaces = this.generateBoard();
}

Board.prototype.forEachSpace = function (callback) {
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      callback(x, y);
    }
  }
};

Board.prototype.generateBoard = function () {
  var spaces = []
  this.forEachSpace(function(x, y) {
    spaces.push(new Space(x, y));
  })
  return spaces;
};

Board.prototype.find = function (xCoordinate, yCoordinate) {
  // for each space in spaces,
  // check if that space's coordinates match the test coordinates
  // if so, return that space

  var spaces = this.spaces;
  for (var i = 0; i < spaces.length; i++) {
    var space = spaces[i]
    if (space.xCoordinate === xCoordinate && space.yCoordinate === yCoordinate) {
      return space;
    }
  }
};

Board.prototype.spacesMarkedBy = function (player) {
  var markedSpaces = [];
  var spaces = this.spaces;
  for (var i = 0; i < spaces.length; i++) {
    var space = spaces[i]
    if (space.markedBy === player) {
      markedSpaces.push(space);
    }
  }
  return markedSpaces;
};

function Player(mark, computer) {
  this.mark = mark;
  this.computer = computer;
}

function Space(xCoordinate, yCoordinate, optionalMark) {
  this.xCoordinate = xCoordinate;
  this.yCoordinate = yCoordinate;
  this.coordinates = [xCoordinate, yCoordinate];
  this.markedBy;
}

Space.prototype.markedBy = function(player) {
  if (player) {
    this.markedBy = player;
  }
  return undefined;
};

var toggleCurrentPlayer = function(currentPlayerNumber) {
  return( currentPlayerNumber === 0 ) ? 1 : 0;
};

$(function() {
  var currentPlayerNumber;
  var currentPlayer;
  var playCount;
  var used;

  beginGame( );

  // Generate Game Board
  $gameBoard = $('#game-board');
  spaces.forEach(function(space) {
    $gameBoard.append('<div class="unmarked space" id="' + space.coordinates + '" name="'+ space.coordinates +'"></div>')
  });

  $("#start-over").on("click", function( ) {
    for( var i = 0; i < spaces.length; i++ )
    {
      var spaceID = spaces[i].coordinates[0].toString( ) + "," + spaces[i].coordinates[1].toString( );
      var space = $('[name="' + spaceID + '"]');
      space.text("");
      space.removeClass('space');
      space.addClass('unmarked space');
      space.bind('click');
    }
    $gameBoard.fadeTo('fast', 1.0);
    beginGame( );
  });

  // When a space is clicked
  $('.unmarked').click(function() {
    $(this).removeClass('unmarked');

    if ( $(this).text( ).length <= 0 )
    {
      var gameOver = false;
      // Get id of the space that was clicked
      spaceID = this.id.split(',')
      for(var i = 0; i < spaceID.length; i++) { spaceID[i] = parseInt(spaceID[i]); }

      // Mark that space as clicked by the current player
      var x = spaceID[0];
      var y = spaceID[1];
      used.push( [x,y,currentPlayer.mark] );
      board.find(spaceID[0], spaceID[1]).markedBy(currentPlayer);
      $(this).text(currentPlayer.mark)

      // Determine if it's GameOver and report winner if so
      if (game.gameOver()) {
        gameOver = true;
        $gameBoard.fadeTo('slow', 0.7);
        $('#game-status').append('<h1>' + currentPlayer.mark + ' Won!</h1>');
        $('.unmarked').removeClass('unmarked');
      } else if (playCount === 8) {
        $gameBoard.fadeTo('slow', 0.7);
        $('#game-status').append("<h1>Game Over. It's a tie!</h1>");
        $('.unmarked').removeClass('unmarked');
      }

      // Toggle the current player and playcount
      currentPlayerNumber = toggleCurrentPlayer(currentPlayerNumber);
      currentPlayer = players[currentPlayerNumber];
      playCount += 1;

      if( currentPlayer.computer && !gameOver )
      {
        computerMove( currentPlayer );
        // Toggle the current player and playcount
        currentPlayerNumber = toggleCurrentPlayer(currentPlayerNumber);
        currentPlayer = players[currentPlayerNumber];
        playCount += 1;
      }
    }
  });

  $("#computer").on("click", function( ) {
    game.players[1].computer = $("#computer").is(":checked");
  });

  function beginGame( )
  {
    game = new Game();
    players = game.players;
    board = game.board;
    spaces = board.spaces;
    used = [];

    $('#game-status').empty( );
    players[1].computer = $("#computer").is(":checked");

    // Start Game
    currentPlayerNumber = 0;
    currentPlayer = players[currentPlayerNumber];
    playCount = 0;
  }


  function computerMove( currentPlayer )
  {
    var strongMove = findStrongMove( );
    var randomAvailableSpace = ( strongMove === false ) ? findRandomSpace( ) : strongMove;

    var x = randomAvailableSpace.coordinates[0];
    var y = randomAvailableSpace.coordinates[1];
    used.push( [x,y,currentPlayer.mark] );

    var spaceID = randomAvailableSpace.coordinates[ 0 ].toString( ) + "," + randomAvailableSpace.coordinates[ 1 ].toString( );
    var space = $('[name="' + spaceID + '"]');

    space.removeClass('unmarked');

    randomAvailableSpace.markedBy( currentPlayer );
    space.text(currentPlayer.mark)

    // Determine if it's GameOver and report winner if so
    if (game.gameOver()) {
      $gameBoard.fadeTo('slow', 0.7);
      $('#game-status').append('<h1>' + currentPlayer.mark + ' Won!</h1>');
      $('.unmarked').removeClass('unmarked');
    } else if (playCount === 8) {
      $gameBoard.fadeTo('slow', 0.7);
      $('#game-status').append("<h1>Game Over. It's a tie!</h1>");
      $('.unmarked').removeClass('unmarked');
    }
  }

  function findStrongMove( )
  {
    var pairs = [ [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,2]], [[0,3],[1,3],[3,3]] ];

    for( var i = 0; i < pairs.length; i++ )
    {
      var pairCount = 0;
      for( var j = 0; j < pairs[i].length; j++ )
      {
        if( $('[name="' + pairs[i][j].toString( ) + '"]').text( ) === "X" )
        {
          pairCount += 1;
        }

        if( pairCount === 2 )
        {
          return findEmptyInThree( pairs[i] );
        }
      }
    }

    return false;
  }

  function isUsed( x, y )
  {
    for( var i = 0; i < used.length; i++ )
    {
      if( used[i][0] === x && used[i][1] === y )
      {
        return true;
      }
    }
    return false;
  }

  function findEmptyInThree( three )
  {
    for( var i = 0; i < three.length; i++ )
    {
      if( $('[name="' + three[i][0].toString( ) + "," + three[i][1].toString( ) + '"]').text( ) === "" )
      {
        return board.find( three[i][0], three[i][1] );
      }
    }

    return findRandomSpace( );
  }

  function findRandomSpace( )
  {
    var available = [];
    for( var i = 0; i < spaces.length; i++ )
    {
      if ( spaces[ i ].markedBy.mark === undefined )
      {
        available.push( spaces[ i ] );
      }
    }
    return available[ Math.floor( Math.random( ) * available.length ) ];
  }

});
