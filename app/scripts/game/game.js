'use strict';

angular.module('Game', ['Grid', 'ngCookies', 'LZString'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore, LZString) {

  this.getHighScore = function() {
    return parseInt($cookieStore.get('highScore')) || 0;
  };

  this.grid = GridService.grid;
  this.tiles = GridService.tiles;
  this.gameSize = GridService.getSize();

  this.winningValue = 2048;

  this.reinit = function() {
    this.gameOver = false;
    this.win = false;
    this.currentScore = 0;
    this.highScore = this.getHighScore();
    //
    this.encrypted = null;
  };
  this.reinit();

  this.newGame = function() {
    GridService.buildEmptyGameBoard();
    GridService.buildStartingPosition();
    this.reinit();
  };

  // Restore the game board with the data sent by the user via URL
  this.restoreGame = function(gameEncrypted) {
    GridService.buildEmptyGameBoard();
    if (gameEncrypted) {
      // decode the data
      var game = this.decodeGame(gameEncrypted);

      if (game) {
        GridService.restoreGameBoard(game.tiles);
        this.updateScore(game.currentScore);
        return true;
      }
    }
    // Couldn't restore, start in initial state
    GridService.buildStartingPosition();
    return false;
  };

  this.encodeGame = function() {
    // minify tiles object
    var tiles = this.tiles.map(function(tile) {
      return tile ? tile.value : null;
    });
    var game = [this.currentScore, tiles];
    // encode game data
    var encryptedGame = LZString.compressToEncodedURIComponent(JSON.stringify(game));
    return encryptedGame;
  };

  this.decodeGame = function(encryptedGame) {
    var decompressed = LZString.decompressFromEncodedURIComponent(encryptedGame);
    if (decompressed) {
      var temp = JSON.parse(decompressed);
      if (this.validateDecodedGame(temp)) {
        var game = {
          currentScore: temp[0],
          tiles: temp[1]
        };
        return game;
      }
    }
    return null;
  };

  this.validateDecodedGame = function(game) {
    if (game.length === 2 && game[1].length === 16) {
      // Check if its in the right structure
      for (var i = 0, l = game[1].length; i < l; i++) {
        var item = game[1][i];
        if (Array.isArray(item)) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  /*
   * The game loop
   *
   * Inside here, we'll run every 'interesting'
   * event (interesting events are listed in the Keyboard service)
   * For every event, we'll:
   *  1. look up the appropriate vector
   *  2. find the furthest possible locations for each tile and 
   *     the next tile over
   *  3. find any spots that can be 'merged'
   *    a. if we find a spot that can be merged:
   *      i. remove both tiles
   *      ii. add a new tile with the double value
   *    b. if we don't find a merge:
   *      i. move the original tile
   */
  this.move = function(key) {
    var self = this;
    var f = function() {
      if(self.win) { return false; }
      var positions = GridService.traversalDirections(key);
      var hasMoved = false;
      var hasWon = false;

      // Update Grid
      GridService.prepareTiles();

      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var originalPosition = {x:x,y:y};
          var tile = GridService.getCellAt(originalPosition);

          if (tile) {
            var cell = GridService.calculateNextPosition(tile, key),
                next = cell.next;

            if (next &&
                next.value === tile.value &&
                !next.merged) {

              // MERGE
              var newValue = tile.value * 2;

              var merged = GridService.newTile(tile, newValue);
              merged.merged = [tile, cell.next];

              GridService.insertTile(merged);
              GridService.removeTile(tile);

              GridService.moveTile(merged, next);

              self.updateScore(self.currentScore + cell.next.value);

              if(merged.value >= self.winningValue) {
                hasWon = true;
              }
              hasMoved = true; // we moved with a merge
            } else {
              GridService.moveTile(tile, cell.newPosition);
            }

            if (!GridService.samePositions(originalPosition,cell.newPosition)) {
              hasMoved = true;
            }
          }
        });
      });

      if (hasWon && !self.win) {
        self.win = true;
      }

      if (hasMoved) {
        GridService.randomlyInsertNewTile();

        if (self.win || !self.movesAvailable()) {
          self.gameOver = true;
        }
      }

    };
    return $q.when(f());
  };

  this.movesAvailable = function() {
    return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
  };

  this.updateScore = function(newScore) {
    this.currentScore = newScore;

    if(this.currentScore > this.getHighScore()) {
      this.highScore = newScore;
      $cookieStore.put('highScore', newScore);
    }
  };

});
