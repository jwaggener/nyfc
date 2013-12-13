'use strict';

angular.module('nyfcApp')
  .controller('test', function ($scope) {
		console.log('testing to see if this re-initializes when the route changes, seeing as how this is using ng-controller - a directive on the tag rather than the route');
  });
