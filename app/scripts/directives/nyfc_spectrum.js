'use strict';

//this is a wrapper for the spectrum color picker.
angular.module('nyfcApp')
	.directive('nyfcSpectrum', ['AppState', 'NyfcStyles', function(AppState, NyfcStyles){
	return {
		restrict: 'EA',
		template: '<div></div>',
		replace: true,
		link: function ($scope, element, attrs) {
			$scope.selectedRgbString = 'rgb(0,0,255)';
			$(element[0]).spectrum({
				color: '#00f',
				flat: true,
				cancelText: '',
				move: function (color) {// maybe shoud be changed to 'change'
					var stylesObj;
				
					AppState.setPropNewNyfc('selectedTinyColor', color);
					AppState.setPropNewNyfc('selectedRgbString', color.toRgbString());
					AppState.setPropNewNyfc('selectedHsl', color.toHsl());
					
					stylesObj = NyfcStyles.stylesFromArr(AppState.getNewNyfc().name, AppState.getNewNyfc().selectedHsl.l);
					AppState.setStyles(stylesObj);
					
					$scope.safeApply();
				}
			});
		}
	};
	
}]);
