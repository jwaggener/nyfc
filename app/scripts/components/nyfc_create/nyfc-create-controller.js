// controller for creating a new NYFC color
var nyfc = angular.module('nyfcApp');

nyfc.controller('nyfcCreateController', function($scope){
	
	$scope.h, $scope.s, $scope.l, $scope.name;
	
	$scope.stylesStr = 'background-color:rgb(255, 255, 255);color:#191919;font:bold 20px sans-serif;line-height:16.25px';
	
	$scope.hslToStyles = function() {
		var fontColor = ($scope.l > 0.85) ? '#191919' : "#ffffff",
		tc = tinycolor({ h: $scope.h, s: $scope.s, l: $scope.l}), //https://github.com/bgrins/TinyColor
		bgColor = tc.toRgbString(),
		textAlign = 'left',
		textBaseline = 'bottom',
		lineheight = '16.25px';
		
		$scope.stylesStr = 'background-color:' + bgColor + ';' +
			'color:' + fontColor + ';' + 
			'font:' + 'bold 20px sans-serif;' +
			'line-height:' + lineheight;

		//styles will end up looking like this
		//background-color:rgb(255, 255, 255);color:#191919;font:bold 20px sans-serif;line-height:16.25px'	
	};
	
	$scope.validate = function() {
		var valid = true;
		valid = ($scope.h >= 0 && $scope.h <= 255) && valid;
		valid = ($scope.s >= 0 && $scope.s <= 1) && valid;
		valid = ($scope.l >= 0 && $scope.l <= 1) && valid;
		valid = ($scope.name.length && $scope.name.length <= 140) && valid;
		return valid;
	};
	
	$scope.submit = function() {
		//submit the color to the service
	};
	
	//watch for changes in the hue, saturation, or lightness
	$scope.$watch('h', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
	$scope.$watch('s', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
	$scope.$watch('l', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
  // a monkey patch that checks to see if an $apply is in process before calling it
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};
	
});