'use strict';

angular
.module('twentyfourtyeightApp', ['Game', 'ngAnimate', 'ngCookies'])
.controller('GameController', function(GameManager, KeyboardService) {

  this.game = GameManager;
  KeyboardService.init();

  this.newGame = function() {
    this.game.newGame();
    this.startGame();
  };

  this.startGame = function() {
    var self = this;
    KeyboardService.on(function(key, evt) {
      self.game.move(key).then(function() {
      });
    });
  };

  this.newGame();
});
