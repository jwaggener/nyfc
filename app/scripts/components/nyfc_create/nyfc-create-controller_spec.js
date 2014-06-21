describe('the controller for creating a new nyfc color!', function() {
	
	var $scope, nyfcCreate;
	
	beforeEach(module('nyfcApp'));
	
	beforeEach(inject(function($rootScope, $controller){
		$scope = $rootScope;
		nyfcCreate = $controller('nyfcCreateController', {
			'$scope': $scope
		});
	}));
	
	it('should take the h, s, and l values on the scope and translate that into a styles string', function(){
		$scope.h = 0, $scope.s = 0, $scope.l = 1;
		$scope.hslToStyles();
		console.log('$scope.stylesStr', $scope.stylesStr);
		expect($scope.stylesStr).toBe('background-color:rgb(255, 255, 255);color:#191919;font:bold 36px sans-serif;line-height:36px;');
	});
	
	it('should pass validation with values for h, s, and l and a string for a name', function(){
		$scope.h = 360, $scope.s = 0, $scope.l = 1;
		$scope.name = 'sammy';
		expect($scope.validate()).toBe(true);
	});
	
	it('should fail validation with values for h, s, and l and a string for a name', function(){
		$scope.h = 361, $scope.s = 0, $scope.l = 1;
		$scope.name = 'sammy';
		expect($scope.validate()).toBe(false);
	});
	
});
