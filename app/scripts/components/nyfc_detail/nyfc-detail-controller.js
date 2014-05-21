var nyfc = angular.module('nyfcApp');

nyfc.controller('nyfcDetailController', function($scope, $routeParams, $http){

	// retrieves an individual nyfc color object
	$scope.getNyfcColor = function () {
		$http.get(
			'https://nyfc.firebaseio.com/colors/' + $routeParams.id + '.json'
		).success(function(data, status, headers, config){
			$scope.detailobj = data;
			$scope.detailobj.id = $routeParams.id;
			$scope.showDetail = true;
			$scope.safeApply();
		}).error(function(data, status, headers, config){
			console.log('status', status);
		});
	};
	
	// start the app by checking to see if an individual color needs to be displayed and then loading the page
	if ($routeParams.id) {
		$scope.getNyfcColor($routeParams.id);
	}
	
});
