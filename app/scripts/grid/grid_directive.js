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
      scope.rows = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
    }
  };
});