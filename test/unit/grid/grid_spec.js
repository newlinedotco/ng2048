describe('Grid', function() {

  beforeEach(module('Grid'));

  describe('TileModel', function() {

  });

  describe('GridService', function() {

    var gridService, tileModel;
    beforeEach(inject(function(GridService, TileModel) {
      gridService = GridService;
      tileModel = TileModel;
    }));

    describe('.tileMatchesAvailable', function() {
      it('should report there are matches available when there are matches', function() {
        var tiles = [];
        for (var i = 0; i < gridService.size * gridService.size; i++) {
          var tile = new tileModel(gridService._positionToCoordinates(i), 2);
          tiles.push(tile);
        }
        gridService.tiles = tiles;
        expect(gridService.tileMatchesAvailable()).toBeTruthy();
      });
      it('should report there are no matches when none available', function() {
        var tiles = [];
        for (var i = 0; i < gridService.size * gridService.size; i++) {
          var tile = new tileModel(gridService._positionToCoordinates(i), (2*i) + 1);
          tiles.push(tile);
        }
        gridService.tiles = tiles;
        expect(gridService.tileMatchesAvailable()).toBeFalsy();
      })
    });

  });

});