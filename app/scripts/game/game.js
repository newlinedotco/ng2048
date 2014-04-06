'use strict';

angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore) {

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
  };
  this.reinit();

  this.newGame = function() {
    GridService.buildEmptyGameBoard();
    GridService.buildStartingPosition();
    this.reinit();
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
