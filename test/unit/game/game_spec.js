describe('Game', function() {
  describe('GameManager', function() {

    beforeEach(module('Game'));

    var gameManager, _cookieStore, _gridService, provide, $rootScope;

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
      $provide.value('$cookieStore', _cookieStore);
      $provide.value('GridService', _gridService);
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