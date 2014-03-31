'use strict';

angular
.module('twentyfourtyeightApp', ['Game', 'Keyboard', 'ngAnimate'])
.controller('GameController', function($scope, GameService, GridService, KeyboardService) {

  this.game_manager = GameService;
  KeyboardService.init();

  this.newGame = function() {
    this.game_manager.newGame();
    this.startGame();
  }

  this.startGame = function() {
    var self = this;
    KeyboardService.on(function(key, evt) {
      self.game_manager.move(key).then(function() {
      });
    });
  }

  this.newGame();
});