'use strict';

angular.module('nyfcApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
	    .when('/:id?', {
	      templateUrl: 'views/main.html',
	      controller: 'MainCtrl'
	    })
      .otherwise({
        redirectTo: '/'
      });
  });
