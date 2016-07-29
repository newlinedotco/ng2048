'use strict';

angular
.module('twentyfourtyeightApp', ['Game', 'Grid', 'Keyboard', 'Social', 'ngAnimate', 'ngCookies', 'ui.router'])
.config(function(GridServiceProvider) {
  GridServiceProvider.setSize(4);
})
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider.state( 'app', {
    url: '/?board',
    controller: 'GameController'
  });

  // For any unmatched url, 
  $urlRouterProvider.otherwise('/');
  // use the HTML5 History API so we can remove # (hashtag) from the URL
  $locationProvider.html5Mode(true).hashPrefix('!');
})
.controller('GameController', function(GameManager, KeyboardService, $stateParams, $location) {
  var vm = this;

  vm.game = GameManager;

  // Internal function. It will not be exposed in Controller API
  var init = function() {
    KeyboardService.init();
    // if board parameter is not empty
    if ($stateParams.board && $stateParams.board.length > 0) {
      vm.restoreGame();
    } else {
      vm.newGame();
    }
    vm.startGame();
  };

  vm.newGame = function() {
    vm.game.newGame();
  };

  vm.startGame = function() {
    KeyboardService.on(function(key) {
      vm.game.move(key).then(function() {});
    });
  };

  vm.restoreGame = function() {
    vm.game.restoreGame($stateParams.board);
  };

  vm.generateShareableLink = function() {
    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    return url + '/?board=' + vm.game.encodeGame();
  };

  vm.getShareableText = function() {
    return  'My ' + vm.game.currentScore + ' scores at';
  };

  init();
});
