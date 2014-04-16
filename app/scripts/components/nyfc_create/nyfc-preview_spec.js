describe('directive to give a preview of an nyfc color', function(){
	
	var $compile, $scope;
	
	beforeEach(module('nyfcApp'));
	
	beforeEach(module('templates'));
	
	beforeEach(inject(function(_$compile_, $rootScope, $templateCache){
		$compile = _$compile_;
		$scope = $rootScope;
	}));
	
	it('should apply the styles passed via nyfc attr', function(){
		
		$scope.obj = {
			css: 'background-color:rgb(7, 7, 126);color:#ffffff;font:bold 20px sans-serif;line-height:20px'
			};
		var el = angular.element('<nyfc-preview nyfc="obj"></nyfc-preview>');
		$compile(el)($scope);
		$scope.$digest();
		expect(el.find('div.preview').css('color')).toBe('rgb(255, 255, 255)');

	});
	
	it('should dispay the correct text for the name', function(){
		
		$scope.obj = {
			name: 'My Lil Pony'
			};
		var el = angular.element('<nyfc-preview nyfc="obj"></nyfc-preview>');
		$compile(el)($scope);
		$scope.$digest();
		expect(el.find('div.preview > span').text()).toBe('My Lil Pony');
		
	});
	
});
