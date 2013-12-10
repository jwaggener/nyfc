'use strict';

//this is a wrapper for the spectrum color picker.
angular.module('nyfcApp')
	.directive('nyfcSpectrum', function(){
	
	return {
		restrict: 'EA',
		template: '<div></div>',
		replace: true,
		link: function ($scope, element, attrs) {
			$(element[0]).spectrum({
				color: '#00f',
				flat: true,
				cancelText: '',
				move: function (color) {// maybe shoud be changed to 'change'
					$scope.selectedTinyColor = color;
					$scope.selectedRgbString = color.toRgbString();
					$scope.safeApply();
				}
			});
		}
	};
	
});
