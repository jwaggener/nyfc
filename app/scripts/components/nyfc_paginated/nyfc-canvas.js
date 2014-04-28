var nyfc = angular.module('nyfcApp');

nyfc.value('FormattingOptions', 
	{
		xsmall: {
			fontSize: 12.25,
			lineheight: 12.25
		},
		small: {
			fontSize: 16.25,
			lineheight: 16.25
		},
		medium: {
			fontSize: 20,
			lineheight: 20
		},
		large: {
			fontSize: 30,
			lineheight: 30
		},
		xlarge: {
			fontSize: 36,
			lineheight: 36
		}
	}
);

nyfc.controller('nyfcCanvasController', function ($scope, $el, FormattingOptions) {
	
	//choose a size for font and lineheight based on properties of the string
	$scope.selectSize = function(str) {
		var arr = str.split(' '),
			// returns the longest string
			max = (_.max(arr, function(str){return str.length;})).length;
		// heuristics. Not sure what is best
		if ( max >= 16 ) {
			return FormattingOptions.xsmall;
		} else if( max >= 10 ) {
			return FormattingOptions.small;
		} else if ( max >= 7) {
			return FormattingOptions.medium;
		} else if ( max >= 4) {
			return FormattingOptions.large;
		} else {
			return FormattingOptions.xlarge;
		}
	};
	
	//set the styles on the 2d context of the canvas based on the string
	$scope.setContextStyles = function(str, lightness, context) {
		var size,
			// multiply the dimensions. so if you are displaying an image at 125px * 125px 
			// but want the download image to be 375px * 375px for the purpose of a larger download image
			multiplier = 3;
			
		context.textAlign = 'left';
		context.textBaseline = 'bottom';
		context.fillStyle = ( lightness > 0.85) ? '#191919' : '#ffffff';
		
		size = $scope.selectSize(str);
		context.font = 'bold ' + size.fontSize * multiplier + 'px sans-serif';
		context.lineheight = size.lineheight * multiplier;	
	}

});

nyfc.directive('nyfcCanvas', function(){
	
});
