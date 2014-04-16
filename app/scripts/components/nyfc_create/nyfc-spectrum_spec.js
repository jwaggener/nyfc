describe('a directive that allows the user to pick a color', function(){
	
	var $compile, $scope, element;
	
	beforeEach(module('nyfcApp'));
	
	beforeEach(inject(function(_$compile_, $rootScope){
		$compile = _$compile_;
		$scope = $rootScope;
		element = angular.element('<nyfc-spectrum></nyfc-spectrum>');
	}));
	
	it('sets the values h, s, and l on the scope', function(){
		$compile(element)($scope);
		$scope.$digest();
		$scope.setHSL(255,1);
		expect($scope.h).toBe(255);
		expect($scope.s).toBe(1);
		expect($scope.l).toBe(0);
	});
	
	it('creates the color spectrum color picker', function() {
		$compile(element)($scope);
		$scope.$digest();
		var spectrumWorked = element.find('.sp-container');
		expect(spectrumWorked.length).toBe(1);
	});
	
});
