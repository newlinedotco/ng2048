'use strict';

angular.module('twentyfourtyeightApp')
.service('GameManager', function($q, $timeout, GridService, KeyboardService, $cookieStore) {

  this.getHighScore = function() { 
    return parseInt($cookieStore.get('highScore')) || 0;
  };

  this.grid = GridService.grid;
  this.tiles = GridService.tiles;
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
    return $q.when(function() {
      if(self.win) { return false; }
      var v = vectors[key];
      var positions = GridService.traversalDirections(v);
      var hasMoved = false;
      var hasWon = false;

      // Update Grid
      GridService.prepareTiles();

      var res;

      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var tile = GridService.getCellAt({x:x,y:y});

          if (tile) {
            var cell = GridService.calculateNextPosition(tile, v),
                next = cell.next;

            console.log(x, y, cell, next);

            if (next && 
                next.value === tile.value &&
                !next.merged) {

              // MERGE
              // GridService.removeTile(cell.next);
              // GridService.insertTile(cell.newPosition);
              var newValue = tile.value * 2;
              var pos = {
                x: cell.next.x,
                y: cell.next.y
              }

              var merged = GridService.newTile(next, newValue);
              merged.merged = [tile, cell.next];

              GridService.insertTile(merged);
              GridService.removeTile(tile);

              // Converge the two tiles' positions
              tile.updatePosition(next);

              // var newTile = GridService.insertTile(pos, newValue);
              // newTile.setMergedBy([tile, cell.next]);
              // GridService.removeTile(tile);
              // GridService.removeTile(cell.next);

              self.updateScore(self.currentScore + cell.next.value);

              if(merged.value >= self.winningValue) {
                hasWon = true;
              }
            } else {
              // res = GridService.moveTile(cell.original, cell.newPosition);
              // GridService.removeTile({x:tile.x,y:tile.y});
              res = GridService.moveTile(tile, cell.newPosition);
              // GridService.insertTile(cell.newPosition, tile.value);
            }

            if (!GridService.samePositions(cell, tile)) {
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

    }());
  };

  this.movesAvailable = function () {
    return GridService.anyCellsAvailable() || this.tileMatchesAvailable();
  };

  this.getVector = function (direction) {
    var map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0 },  // Right
      2: { x: 0,  y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
    };
    return map[direction];
  };

  // Private things
  var vectors = {
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 }
  };

  var directions = ['left', 'right', 'up', 'down'];

  this.tileMatchesAvailable = function () {
    var self = this;
    var tile;
    for (var x = 0; x < self.grid.length; x++) {
      for (var y = 0; y < self.grid.length; y++) {
        tile = GridService.getCellAt({ x: x, y: y });
        if (tile) {
          for (var direction = 0; direction < directions.length; direction++) {
            var vector = vectors[directions[direction]];
            var cell   = { x: x + vector.x, y: y + vector.y };
            var other  = GridService.getCellAt(cell);

            if (other && other.value === tile.value) {
              return true; // can be merged
            }
          }
        }
      }
    }
    return false;
  };

  this.updateScore = function(newScore) { 
    this.currentScore = newScore;
    if(this.currentScore > this.getHighScore()) {
      this.highScore = newScore;
      $cookieStore.put('highScore', newScore);
    }
  };

});
