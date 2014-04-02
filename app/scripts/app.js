'use strict';

angular
.module('twentyfourtyeightApp', ['Game', 'Grid', 'ngAnimate', 'ngCookies'])
.config(function(GridServiceProvider) {
  GridServiceProvider.setSize(4);
})
.controller('GameController', function(GameManager, KeyboardService) {

  this.game = GameManager;
  KeyboardService.init();

  this.newGame = function() {
    this.game.newGame();
    this.startGame();
  };

  this.startGame = function() {
    var self = this;
    KeyboardService.on(function(key) {
      self.game.move(key).then(function() {
      });
    });
  };

  this.newGame();
});
