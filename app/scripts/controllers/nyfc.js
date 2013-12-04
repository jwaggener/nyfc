'use strict';

angular.module('nyfcApp')
  .controller('MainCtrl', function ($scope, NYFCCouchDBService) {
    $scope.title = 'Name Your Favorite Color';
  	console.log('$scope', $scope);
  	console.log('NYFCCouchDBService', NYFCCouchDBService);
  	console.log('NYFCCouchDBService.query()', NYFCCouchDBService.query());
  });
  
/*window.NYFC.controllers.NYFCMain = function ($scope, NYFCCouchDBService) {
	console.log('$scope', $scope);
	console.log('NYFCCouchDBService', NYFCCouchDBService);
	console.log('NYFCCouchDBService.query()', NYFCCouchDBService.query());
}*/
