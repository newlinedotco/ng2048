'use strict';

angular.module('twentyfourtyeightApp')
.service('GameManager', function($q, $timeout, GridService, KeyboardService, $cookieStore) {

  this.getHighScore = function() { 
    return parseInt($cookieStore.get('highScore')) || 0;
  };


  this.grid = GridService.grid;
  this.tiles = GridService.tiles;
  this.currentScore = 0;
  this.highScore = this.getHighScore();
  this.gameOver = false;

  this.newGame = function() {
    GridService.buildEmptyGameBoard();
    GridService.buildStartingPosition();
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
      var v = vectors[key];
      var positions = GridService.traversalDirections(v);
      var hasMoved = false;

      // Update Grid
      GridService.prepareTiles();

      var res;

      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var tile = GridService.getCellAt({x:x,y:y});

          if (tile) {
            var cell = GridService.calculateNextPosition(tile, v);

            if (cell.next && 
                cell.next.value === tile.value &&
                !cell.next.merged) {

              // MERGE
              // GridService.removeTile(cell.next);
              // GridService.insertTile(cell.newPosition);
              var newValue = tile.value * 2;
              var pos = {
                x: cell.next.x,
                y: cell.next.y
              }

              // var merged = new Tile(positions.next, tile.value * 2);
              // merged.mergedFrom = [tile, next];

              // self.grid.insertTile(merged);
              // self.grid.removeTile(tile);

              // // Converge the two tiles' positions
              // tile.updatePosition(positions.next);

              // // Update the score
              // self.score += merged.value;

              var newTile = GridService.insertTile(pos, newValue);

              // console.log('newTile', newTile);
              // GridService.moveTile(cell.next, cell.next.getPosition());

              newTile.setMergingTiles([tile, cell.next]);
              console.log('created new tile', newTile);

              // MOVE THE MERGED TILES
              GridService.moveTile(cell.original, newTile.getPosition());
              GridService.moveTile(cell.next, newTile.getPosition());
              // cell.next.setMerged(tile);

              self.updateScore(self.currentScore + cell.next.value);
            } else {
              // res = GridService.moveTile(cell.original, cell.newPosition);
              // GridService.removeTile({x:tile.x,y:tile.y});
              res = GridService.moveTile(tile, cell.newPosition);
              // GridService.insertTile(cell.newPosition, tile.value);
            }
            if (!hasMoved && res) hasMoved = true;
          }
        });
      });


      $timeout(function() {
        if (hasMoved) {
          GridService.randomlyInsertNewTile();
          // GridService.cleanupCells();

          if (!GridService.anyCellsAvailable()) {
            self.gameOver = true;
          }
        }
      }, 100);

    }());
  };

  this.updateScore = function(newScore) { 
    this.currentScore = newScore;
    if(this.currentScore > this.getHighScore()) {
      this.highScore = newScore;
      $cookieStore.put('highScore', newScore);
    }
  };

  // Private things
  var vectors = {
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 }
  };

});
