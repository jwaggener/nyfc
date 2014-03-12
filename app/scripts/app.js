// this defines the app and configures a route
angular.module('nyfcApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
			//an id of a color can be passed
			.when('/:id?', {
				templateUrl: 'partials/main.html',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
		});
