angular.module('Game')
.directive('grid', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/grid.html',
    link: function(scope, ele, attrs, ctrl) {
      var width = scope.ngModel.width || 4,
          height = scope.ngModel.height || 4;

      // Cell generation
      scope.rows = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
    }
  }
})