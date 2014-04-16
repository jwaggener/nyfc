// this is a wrapper for the spectrum color picker
// https://github.com/bgrins/spectrum
var nyfc = angular.module('nyfcApp');

nyfc.directive('nyfcSpectrum', function(){
	return {
		restrict: 'EA',
		template: '<div><input /></div>',
		replace: true,
		link: function ($scope, element, attrs) {
			
			$scope.setHSL = function(h,s,l) {
				$scope.h = h || 0;
				$scope.s = s || 0;
				$scope.l = l || 0;
			}
			
			//an initial value
			$scope.setHSL(240, 1, .5);
			
			element.find('input').first().spectrum({
				color: '#00f',
				flat: true,
				cancelText: '',
				move: function (color) {
					var hsl = color.toHsl();
					$scope.setHSL(
							 hsl.h,
							 hsl.s,
							 hsl.l
						);					
					$scope.safeApply();
				}
			});
		}
		
	};
	
});
