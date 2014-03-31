angular.module('Game', [])
.factory('GenerateUniqueId', function() {
  // http://stackoverflow.com/questions/12223529/create-globally-unique-id-in-javascript
  var generateUid = function (separator) {
    var delim = separator || "-";
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
  };
  return generateUid;
})
.factory('TileModel', function(GenerateUniqueId) {
  var Tile = function(pos, val) {
    this.x      = pos.x;
    this.y      = pos.y;
    this.value  = val;

    this.id = GenerateUniqueId();
    console.log('genreated', this.id);
  }

  Tile.prototype.savePosition = function() {
    this.originalX = this.x;
    this.originalY = this.y;
  }

  Tile.prototype.setMerged = function(withTile) {
    this.merged = withTile;
  }

  Tile.prototype.clear = function() {
    this.merged = null;
  }

  Tile.prototype.updateValue = function(newVal) {
    this.value = newVal;
  }

  Tile.prototype.updatePosition = function(newPosition) {
    this.x = newPosition.x;
    this.y = newPosition.y;
  }

  return Tile;
})
.provider('GridService', function() {
  this.size = 4; // Default size

  this.setSize = function(sz) {
    this.size = sz ? sz : 0;
  }

  var service = this;

  this.$get = function(TileModel) {
    this.grid   = [];
    this.tiles  = [];
    
    // Build game board
    this.buildEmptyGameBoard = function() {
      var self = this;
      this.forEach('grid', function(x,y,val) {
        self.grid[x][y] = null;
      });

      this.forEach('tiles', function(x,y,val) {
        var pos = {x:x,y:y};
        // self.tiles[x][y] = new TileModel(pos);
        self.tiles[x][y] = null;
      });
    }

    /*
     * Calculate the next positions for
     * each tile on the board
     */
    this.calculateNextPositions = function(vector) {
      var self = this,
          cells = [],
          positions = this.traversalDirections(vector);

      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var cellLoc = { x: x, y: y },
              cell    = self.getCellAt(cellLoc);

          if (cell) {
            var next = self.calculateNextPosition(cell, vector);
            cells.push(next);
          }
        })
      });

      return cells;
    }

    /*
     * Prepare for traversal
     */
    this.prepareTiles = function() {
      this.forEach('tiles', function(x,y,tile) {
        if (tile) {
          tile.savePosition();
          tile.clear();
        }
      });
    };

    /*
     * Due to the fact we calculate the next positions
     * in order, we need to specify the order in which
     * we calculate the next positions
     */
    this.traversalDirections = function(vector) {
      var positions = {x: [], y: []};
      for (var x = 0; x < this.size; x++) {
        positions.x.push(x);
        positions.y.push(x);
      }

      if (vector.x > 0) positions.x = positions.x.reverse();
      if (vector.y > 0) positions.y = positions.y.reverse();
      return positions;
    }


    /*
     * Calculate the next position for a tile
     */
    this.calculateNextPosition = function(cell, vector) {
      var originalCell = cell;
      var previous;

      do {
        previous = cell;
        cell = {
          x: previous.x + vector.x,
          y: previous.y + vector.y
        }
      } while (this.withinGrid(cell) && this.cellAvailable(cell));

      return {
        newPosition: previous,
        original: originalCell,
        next: this.getCellAt(cell)
      }
    }

    this.withinGrid = function(cell) {
      return cell.x >= 0 && cell.x < this.size &&
              cell.y >= 0 && cell.y < this.size;
    }

    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.tiles[cell.x][cell.y];
      } else {
        return null;
      }
    }

    /*
     * Build the initial starting position
     * with randomly placed tiles
     */
    this.buildStartingPosition = function() {
      for (var x = 0; x < 2; x++) {
        this.randomlyInsertNewTile();
      }
    }

    /*
     * Get all the available tiles
     */
    this.availableCells = function() {
      var cells = [],
          self = this;

      this.forEach('tiles', function(x,y,tile) {
        if (!tile) cells.push({x:x,y:y});
      });

      return cells;
    }

    /*
     * Get a cell at a position
     */
    this.getCellAt = function(pos) {
      if (this.withinGrid(pos)) {
        return this.tiles[pos.x][pos.y];
      } else {
        return null;
      }
    }

    this.moveTile = function(original, newPosition) {
      if (this.samePositions(original, newPosition)) {
        return false;
      } else {
        var oldPos = {
          x: original.x,
          y: original.y
        };

        // var swapped = this.tiles[newPosition.x].splice(newPosition.y, 1, original);
        // this.tiles[oldPos.x].splice(oldPos.y, 1, swapped[0]);
        // original.updatePosition(newPosition);
        // swapped[0].updatePosition(oldPos);
        this.tiles[oldPos.x][oldPos.y] = null;
        this.tiles[newPosition.x][newPosition.y] = original;

        return true;
      }
    }

    this.cleanupCells = function() {
      var self = this;
      this.forEach('tiles', function(x, y, tile) {
        if (tile && tile.merged) {
          console.log('merged tile', tile);
          self.removeTile(tile.merged);
        }
      });
    }

    /*
     * Run a callback for every cell
     * either on the grid or tiles
     */
    this.forEach = function(type, cb) {
      if (!type) type = 'grid';
      for (var x = 0; x < service.size; x++) {
        if (!this[type][x]) this[type][x] = [];
        for (var y = 0; y < service.size; y++) {
          cb(x, y, this[type][x][y]);
        }
      }
    }

    /*
     * Insert a new tile
     */
    this.insertTile = function(pos, value) {
      this.tiles[pos.x][pos.y] = new TileModel(pos, value);
    }

    /*
     * Remove a tile
     */
    this.removeTile = function(pos) {
      this.tiles[pos.x][pos.y] = null;
    }

    /*
     * Same position
     */
    this.samePositions = function(a, b) {
      return a.x === b.x && a.y === b.y;
    }

    /*
     * Randomly insert a new tile
     */
    this.randomlyInsertNewTile = function() {
      var cell = this.randomAvailableCell(),
          tile = new TileModel(cell, 2);
      this.insertTile(cell, 2);
    }

    /*
     * Get a randomly available cell from all the
     * currently available cells
     */
    this.randomAvailableCell = function() {
      var cells = this.availableCells();
      if (cells.length > 0) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    }

    /*
     * Check to see there are still cells available
     */
    this.anyCellsAvailable = function() {
      return this.availableCells().length > 0;
    }

    return this;
  }
});
