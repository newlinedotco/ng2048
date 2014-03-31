'use strict';

angular.module('twentyfourtyeightApp')
.service('GameService', function($q, $timeout, GridService, KeyboardService) {

  this.grid = GridService.grid;
  this.tiles = GridService.tiles;

  this.newGame = function() {
    GridService.buildEmptyGameBoard();
    GridService.buildStartingPosition();
  }

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
    return $q.when(function() {
      var v = vectors[key];
      var positions = GridService.traversalDirections(v);
      var hasMoved = false,
          gameOver = false;

      // Update Grid
      GridService.prepareTiles();

      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var tile = GridService.getCellAt({x:x,y:y});

          if (tile.value) {
            var cell = GridService.calculateNextPosition(tile, v);

            if (cell.next && 
                cell.next.value === cell.original.value &&
                !cell.next.merged) {

              // MERGE
              cell.original.updateValue(null);
              cell.next.updateValue(cell.next.value * 2);

              cell.next.setMerged(cell.original);
            }

            var res = GridService.moveTile(cell.original, cell.newPosition);
            if (!hasMoved && res) hasMoved = true;
          }
        });
      });

      $timeout(function() {
        if (hasMoved) {
          GridService.randomlyInsertNewTile();

          if (!GridService.anyCellsAvailable()) {
            gameOver = true;
          }
        }
      }, 110);

    }());
  }

  // Private things
  var vectors = {
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 }
  }

});
