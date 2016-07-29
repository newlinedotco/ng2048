'use strict';

angular.module('Facebook', [])
.directive('facebookShare', function($window) {
	function link(scope, element) {
		element.bind('click', function() {
			var urlString = 'https://www.facebook.com/sharer/sharer.php?';
			//default to the current page if a URL isn't specified
			urlString += 'u=' + encodeURIComponent(scope.facebookUrl || $window.location.href);

			$window.open(
				urlString,
				'Facebook', 'toolbar=0,status=0,resizable=yes,width=500,height=400' +
				',top=' + ($window.innerHeight - 400) / 2 + ',left=' + ($window.innerWidth - 500) / 2
			);
		});
	}
	return {
		restrict: 'A',
		scope: {
			facebookUrl: '='
		},
		link: link,
		templateUrl: 'scripts/social/facebook/facebook_directive.html'
	};
});