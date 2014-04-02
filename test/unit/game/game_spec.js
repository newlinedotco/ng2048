describe('Game', function() {
  describe('GameManager', function() {

    beforeEach(module('Game'));

    var gameManager, _cookieStore, _gridService, provide;

    beforeEach(module(function($provide) {
      _cookieStore = {
        get: angular.noop
      };
      _gridService = {
        buildEmptyGameBoard: angular.noop,
        buildStartingPosition: angular.noop
      };
      $provide.value('$cookieStore', _cookieStore);
      $provide.value('GridService', _gridService);
      provide = $provide;
    }));

    beforeEach(inject(function(GameManager) {
      gameManager = GameManager;
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

  });
});