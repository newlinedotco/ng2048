'use strict';

angular
.module('twentyfourtyeightApp', ['Grid', 'Keyboard', 'Game', 'ngAnimate', 'ngCookies'])
.controller('GameController', function($scope, GameManager, GridService, KeyboardService) {

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
