describe('directive draws an image of the color with its name', function(){
	
	var $scope, controller, context, formattingOptions;
	
	beforeEach(module('nyfcApp'));
	
	beforeEach(inject(function($rootScope, $compile, $controller, FormattingOptions){
		context = {
			measureText: function(){
				return 5;
			}
		};
		$scope = $rootScope.$new();
		el = angular.element('<nyfcCanvas></nyfcCanvas>');
		$compile(el)($scope);
		$scope.$digest();
		controller = $controller('nyfcCanvasController', {
			$scope: $scope,
			$element: el
		});
	}));
	
	it('should have a property color with a value of #191919 when the lightness value passed in is over 0.85 ', function(){
		var str = 'hello world',
			lightness = 0.86;
		$scope.setContextStyles(str, lightness);
		expect($scope.context.fillStyle).toBe('#191919');
	});
	
	describe('selecting the correct size', function(){
		
		beforeEach(inject(function(FormattingOptions){
			formattingOptions = FormattingOptions;
		}));
			
		it('should select xlarge if longest string size is 1-3 in length', function(){
			var obj = $scope.selectSize('xl ooo oo');
			expect(obj).toBe(formattingOptions.xlarge);
		});
		
		it('should select large if longest string size is 4-6 in length', function(){
			var obj = $scope.selectSize('larg large largel la');
			expect(obj).toBe(formattingOptions.large);
		});

		it('should select medium if longest string size is 7-9 in length', function(){
			var obj = $scope.selectSize('mediumm mediumme mediummed me');
			expect(obj).toBe(formattingOptions.medium);
		});

		it('should select small if longest string size is 10-15 in length', function(){
			var obj = $scope.selectSize('smallsmall smallsmallsmall sm');
			expect(obj).toBe(formattingOptions.small);
		});

		it('should select small if longest string size is 10-15 in length', function(){
			var obj = $scope.selectSize('smallsmall smallsmallsmall sm');
			expect(obj).toBe(formattingOptions.small);
		});

		it('should select xsmall if longest string size is 16 and up in length', function(){
			var obj = $scope.selectSize('smallsmall smallsmallsmalls sm');
			expect(obj).toBe(formattingOptions.xsmall);
		});
		
	});
	
	it('should get the number of nodes needed to draw text in the box', function(){
		var nodes = $scope.getNodes('smallsmall smallsmallsmall sm', context);
		expect(_.isArray(nodes)).toBe(true);
	});
	
});
