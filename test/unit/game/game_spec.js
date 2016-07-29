describe('Game', function() {
  describe('GameManager', function() {

    
    beforeEach(function () {
      //mock the LZString lib:
      angular.module("LZString", []);
    });
    beforeEach(module('Game'));
    
    var gameManager, _cookieStore, _gridService, provide, $rootScope, _lzString;

    beforeEach(module(function($provide) {
      _cookieStore = {
        val: {},
        get: function(key) { return _cookieStore.val; },
        put: function(key, val) {
          _cookieStore[key] = val;
        }
      };
      _gridService = {
        buildEmptyGameBoard: angular.noop,
        buildStartingPosition: angular.noop,
        anyCellsAvailable: angular.noop,
        tileMatchesAvailable: angular.noop,
        getSize: function() { return 4; }
      };
      _lzString = {
        compressToEncodedURIComponent: function() { return 'NoFgbATANMB2CuAbRUHNUlaXGgBigEYBdG'; },
        decompressFromEncodedURIComponent: function(param) {}
      };
      $provide.value('$cookieStore', _cookieStore);
      $provide.value('GridService', _gridService);
      $provide.value('LZString', _lzString);
      provide = $provide;
    }));

    beforeEach(inject(function(GameManager, _$rootScope_) {
      gameManager = GameManager;
      $rootScope = _$rootScope_;
    }));

    it('should have a GameManager', function() {
      expect(gameManager).toBeDefined();
    });

    describe('.reinit', function() {

      beforeEach(function() {
        gameManager.reinit();
      })

      it('should have a highScore initially set to the cookie value', inject(function($injector) {
        spyOn(_cookieStore, 'get').andReturn(1000);
        g = $injector.get('GameManager');
        expect(g.getHighScore()).toEqual(1000);
      }));

      it('should have a currentScore of 0', function() {
        expect(gameManager.currentScore).toEqual(0);
      });
    });

    describe('.newGame', function() {
      it('should call the GridService to build an empty game board', function() {
        spyOn(_gridService, 'buildEmptyGameBoard').andCallThrough();
        gameManager.newGame();
        expect(_gridService.buildEmptyGameBoard).toHaveBeenCalled();
      });
      it('should call the GridService to place initial pieces', function() {
        spyOn(_gridService, 'buildStartingPosition').andCallThrough();
        gameManager.newGame();
        expect(_gridService.buildStartingPosition).toHaveBeenCalled();
      });
      it('should call reinit after', function() {
        spyOn(gameManager, 'reinit').andCallThrough();
        gameManager.newGame();
        expect(gameManager.reinit).toHaveBeenCalled();
      });
    });

    describe('.encodeGame', function() {
      it('should call LZString to compress and encode tiles and currentScore data and return encoded result', function() {
        var game = {
          tiles: [
            {id:1,value:4,x:0,y:3},
            {id:2,value:8,x:2,y:2}
          ],
          currentScore: 12
        };
        gameManager.tiles = game.tiles;
        gameManager.currentScore = game.currentScore;
        spyOn(_lzString, 'compressToEncodedURIComponent').andCallThrough();
        var result = gameManager.encodeGame();
        expect(_lzString.compressToEncodedURIComponent).toHaveBeenCalled();
        expect(result).toBeTruthy();
      });
    });

    describe('.decodeGame', function() {
      it('should call LZString to decompress and decode argument received', function() {
        var param = 'NoFgbATANMB2CuAbRUHNUlaXGgBigEYBdG';
        spyOn(_lzString, 'decompressFromEncodedURIComponent').andCallThrough();
        gameManager.decodeGame(param);
        expect(_lzString.decompressFromEncodedURIComponent).toHaveBeenCalledWith(param);
      });
    });

    describe('.restoreGame', function() {
      it('should call GridService and decodeGame with argument received', function() {
        var param = 'NoFgbATANMB2CuAbRUHNUlaXGgBigEYBdG';
        spyOn(_gridService, 'buildEmptyGameBoard').andCallThrough();
        spyOn(gameManager, 'decodeGame').andCallThrough();
        gameManager.restoreGame(param);
        expect(_gridService.buildEmptyGameBoard).toHaveBeenCalled();
        expect(gameManager.decodeGame).toHaveBeenCalledWith(param);
      });
    });

    describe('.restoreGame', function() {
      it('should call GridService buildStartingPosition and return false if argument is null', function() {
        var param = null;
        spyOn(_gridService, 'buildStartingPosition').andCallThrough();
        var result = gameManager.restoreGame(param);
        expect(_gridService.buildStartingPosition).toHaveBeenCalled();
        expect(result).toBeFalsy();
      });
    });

    describe('.move', function() {
      it('should return false if the user has already won the game', function() {
        gameManager.win = true;
        spyOn(gameManager, 'move').andCallThrough();
        gameManager.move().then(function(res) {
          expect(res).toBeFalsy();
        });
        $rootScope.$digest();
      });
    });

    describe('.updateScore', function() {
      it('should update the currentScore', function() {
        gameManager.updateScore(10);
        expect(gameManager.currentScore).toEqual(10);
      });
      it('should update the highScore when it the newscore is higher than the previous', function() {
        spyOn(gameManager, 'getHighScore').andReturn(10);
        spyOn(_cookieStore, 'put').andCallThrough();
        gameManager.updateScore(1000);
        expect(_cookieStore.put).toHaveBeenCalledWith('highScore', 1000);
      });
    });

    describe('.movesAvailable', function() {
      it('should report true if there are cells available', function() {
        spyOn(_gridService, 'anyCellsAvailable').andReturn(true);
        expect(gameManager.movesAvailable()).toBeTruthy();
      });
      it('should report true if there are matches available', function() {
        spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
        spyOn(_gridService, 'tileMatchesAvailable').andReturn(true);
        expect(gameManager.movesAvailable()).toBeTruthy();
      });
      it('should report false if there are no cells nor matches available', function() {
        spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
        spyOn(_gridService, 'tileMatchesAvailable').andReturn(false);
        expect(gameManager.movesAvailable()).toBeFalsy();
      });

    });

  });
});