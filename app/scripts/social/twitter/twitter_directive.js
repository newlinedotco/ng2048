'use strict';

angular.module('Twitter', [])
.directive('twitterShare', function($window) {
	function link(scope, element) {
		element.bind('click', function() {
			var urlString = 'https://www.twitter.com/intent/tweet?';
			//default to the current page if a URL isn't specified
			urlString += 'url=' + encodeURIComponent(scope.twitterUrl || $window.location.href);

			if (scope.twitterText) {
				urlString += '&text=' + encodeURIComponent(scope.twitterText);
			}

			if (scope.twitterHashtags) {
				urlString += '&hashtags=' + encodeURIComponent(scope.twitterHashtags);
			}

			$window.open(
				urlString,
				'Twitter', 'toolbar=0,status=0,resizable=yes,width=500,height=400' +
				',top=' + ($window.innerHeight - 400) / 2 + ',left=' + ($window.innerWidth - 500) / 2
			);
		});
	}
	return {
		restrict: 'A',
		scope: {
			twitterText: '=',
			twitterUrl: '=',
			twitterHashtags: '='
		},
		link: link,
		templateUrl: 'scripts/social/twitter/twitter_directive.html'
	};
});