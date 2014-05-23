describe('the controller for displaying paginated nyfc colors', function() {
	
	var $scope, controller;
	
	beforeEach(module('nyfcApp'));
	
	beforeEach(inject(function($rootScope, $controller){
		$scope = $rootScope;
		controller = $controller('nyfcPaginatedController',{
			$scope: $scope,
			NYFCFirebase: {}
		})
	}));
	
	it('creates an array of colors', function(){
		var data = {
			'color1': {
				'name': 'hello world'
			}
		}
		$scope.safeApply = function(){};
		$scope.addColors(data);
		expect($scope.colors.length).toBe(1);
	});
	
	describe('managing the page keys - related to firebase.com service', function(){
		
		it('should add a page key to the list.', function(){
			$scope.pageKeys = [];
			var data = {
				'key1': 'value1'
			};
			$scope.setPageKey(data);
			expect($scope.pageKeys.length).toBe(1);
		});

		it('should add only unique page keys to the list.', function(){
			$scope.pageKeys = ['key1'];
			var data = {
				'key1': 'value1'
			};
			$scope.setPageKey(data);
			expect($scope.pageKeys.length).toBe(1);
		});

		it('should return the $scope.LIMIT if the current page is null (the first page) or $scope.LIMIT + 1 otherwise', function(){
			$scope.getLimit();
			expect($scope.getLimit()).toBe(20);
			$scope.currentPage = 1;
			expect($scope.getLimit()).toBe(21);
		});
		
	});

	describe('loading only colors that belong to the current user', function(){
		
		beforeEach(function(){
			$scope.user = {id: 123};
			$scope.loadPage = function(){};
			spyOn($scope, 'loadPage')
		});
		
		it('should set the $scope.query string to colors and set the $scope.path to ', function(){
			$scope.onlyMyColors = false;
			$scope.myColors();
			expect($scope.queryStr).toBe('colors');
			expect($scope.path).toBe('');
		});

		it('should set the $scope.query string to user and set the $scope.path to /[userID]/colors', function(){
			$scope.onlyMyColors = true;
			$scope.myColors();
			expect($scope.queryStr).toBe('user');
			expect($scope.path).toBe('/' + $scope.user.id + '/colors');
		});

		it('should set the $scope.currentPage to null and set $scope.pageKeys to an empty array', function(){
			$scope.myColors();
			expect($scope.currentPage).toBe(null);
			expect($scope.pageKeys.length).toBe(0);
		});
		
		it('should call loadPage', function(){
			$scope.myColors();
			expect($scope.loadPage).toHaveBeenCalled();
		});
		
	});
	
	describe('advancing and regressing the page', function(){
		
		beforeEach(function(){
			$scope.loadPage = function(){};
		});
		
		it('should advance the page by 1', function(){
			$scope.currentPage = 0;
			$scope.nextPage();
			expect($scope.currentPage).toBe(1);
		});

		it('should regress the page by 1', function(){
			$scope.currentPage = 1;
			$scope.previousPage();
			expect($scope.currentPage).toBe(0);
		});
		
		it('should not regress the page to less than 0', function(){
			$scope.currentPage = 0;
			$scope.previousPage();
			expect($scope.currentPage).toBe(0);
		});
		
		it('should call loadPage when nextPage is called', function(){
			spyOn($scope, 'loadPage')
			$scope.nextPage();
			expect($scope.loadPage).toHaveBeenCalled();
		});
		
		it('should call loadPage when previousPage is called', function(){
			spyOn($scope, 'loadPage');
			$scope.currentPage = 1;
			$scope.previousPage();
			expect($scope.loadPage).toHaveBeenCalled();
		});
		
	});


});
