'use strict';

angular.module('Grid')
.directive('grid', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/grid.html',
    link: function(scope) {
      // Cell generation
      scope.grid = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
      console.log(scope.ngModel);
      scope.gridSize = scope.ngModel.gameSize;
    }
  };
});