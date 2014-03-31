angular.module('Game')
.directive('tile', function() {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/tile.html',
    link: function(scope, ele, attrs) {

      scope.buildClasses = function() {
        var classes = [];
        classes.push('tile-' + scope.ngModel.value);
        return classes;
      }
    }
  }
})