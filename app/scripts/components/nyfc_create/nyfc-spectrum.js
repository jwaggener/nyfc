// this is a wrapper for the spectrum color picker
// https://github.com/bgrins/spectrum
var nyfc = angular.module('nyfcApp');

nyfc.directive('nyfcSpectrum', function(){
	return {
		restrict: 'EA',
		template: "<div><input ng-model='rgbString' name='color' required /></div>",
		replace: true,
		link: function ($scope, element, attrs) {
			
			$scope.setHSL = function(h,s,l) {
				$scope.h = h || 0;
				$scope.s = s || 0;
				$scope.l = l || 0;
			}
			
			$scope.setRgbString = function(string){
				$scope.rgbString = string;
			}
			
			//an initial value
			$scope.setHSL(240, 1, .5);
			var c = new tinycolor({h:$scope.h, s:$scope.s, l:$scope.l});
			$scope.rgbString = c.toRgbString();
			
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
						$scope.setRgbString(color.toRgbString());		
					$scope.safeApply();
				}
			});
		}
		
	};
	
});
