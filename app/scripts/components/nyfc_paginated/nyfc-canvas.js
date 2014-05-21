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

nyfc.controller('nyfcCanvasController', function ($scope, $element, FormattingOptions) {
	
	$scope.drawText = function(){
		var nodes = $scope.getNodes($scope.name),
			breaks = $scope.getBreaks(nodes, [$scope.dimension-15], 24);

		// Iterate through the line breaks, and split the nodes at the
		// correct point.
		var i, r, j,
			point, ratio,
			linestart = 0,
			lines = [];
		
		for (i = 1; i < breaks.length; i = i + 1) {
			point = breaks[i].position,
			ratio = breaks[i].ratio;
			
			for (j = linestart; j < nodes.length; j += 1) {
				// After a line break, we skip any nodes unless they are boxes or forced breaks.
				if (nodes[j].type === 'box' || (nodes[j].type === 'penalty' && nodes[j].penalty === -Typeset.linebreak.infinity)) {
					linestart = j;
					break;
				}
			}
			lines.push({ratio: ratio, nodes: nodes.slice(linestart, point + 1), position: point});
			linestart = point;
		}
		
		var k = lines.length - 1,
			y = 360;
		while (k >= 0) {
			$scope.drawLine(lines[k], y);
			k--;
			y -= $scope.context.lineheight;
		}
		
	};
	
	$scope.drawLine = function (line, y) {
		var x = 15;

		line.nodes.forEach(function (node, index, array) {
			if (node.type === 'box') {
				$scope.context.fillText(node.value, x, y);
				x += node.width;
			} else if (node.type === 'glue') {
				x += node.width + line.ratio * (line.ratio < 0 ? node.shrink : node.stretch);
			} else if (node.type === 'penalty' && node.penalty === 100 && index === array.length - 1) {
				$scope.context.fillText('-', x, y);
			}
		});
		
	};
	
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
	$scope.setContextStyles = function(str, lightness) {
		var size;
			
		$scope.context.textAlign = 'left';
		$scope.context.textBaseline = 'bottom';
		$scope.context.fillStyle = ( lightness > 0.85) ? '#191919' : '#ffffff';
		
		size = $scope.selectSize(str);
		$scope.context.font = 'bold ' + size.fontSize * $scope.multiplier + 'px sans-serif';
		$scope.context.lineheight = size.lineheight * $scope.multiplier;	
	}
	
	// uses vendor library Typeset to retrieve the number of nodes for a given string
	// center, justify, and left are the options available
	// nodes is an array of objects
	$scope.getNodes = function(str, orientation){
		var format,
			orientation = orientation || 'left';
		//pass in  string that measures text
		format = Typeset.formatter(function (str) {
			return $scope.context.measureText(str).width;
		});
		return format['left'](str);
	}
	
	//use Typeset to get the linebreaks
	//linelengths is always an array : [$scope.dimension - padding]
	$scope.getBreaks = function(nodes, linelengths, tolerance){
		var breaks = Typeset.linebreak(nodes, linelengths, {tolerance: tolerance});
		//my hack. sometimes no breaks. dunno why
		if (breaks.length === 0) {
			breaks = [{position:0, ratio: 0}, {position:4, ratio: 13}];
		}
		return breaks;
	}
	

	$scope.$watch('colorObj', function(newValue, oldValue){

		if(!newValue){
			return;
		}
		$scope.name = newValue.name;
		$scope.color = newValue.color;
		$scope.lightness = newValue.l;
		
		
		//pixel dimension multiplied in order to make a nice-sized download image
		$scope.multiplier = 3;
		$scope.dimension = 125 * $scope.multiplier;
		canvas = document.createElement('canvas');
		canvas.height = canvas.width = $scope.dimension;
		$scope.context = canvas.getContext('2d');
		// draw the color
		$scope.context.fillStyle = $scope.color;
		$scope.context.fillRect(0,0,$scope.dimension,$scope.dimension);

		// set styles for the drawing of the text
		$scope.setContextStyles($scope.name, $scope.lightness);
		// draw it!
		$scope.drawText();

		// create an image and add it to the DOM
		img = new Image();
		$(img).attr('title', 'Right-click to download.');
		img.src = canvas.toDataURL("image/png");
		// can have a shim that maintains a consistent height and prevents the DOM from jumping
		//$($element[0]).find('.shim').remove();
		$($element[0]).prepend(img);
		
	});
	
});

nyfc.directive('nyfcCanvas', function(){
	
	return {
		restrict: 'EA',
		replace: false,
		template: '',
		scope: {
			colorObj: '='
		},
		controller: 'nyfcCanvasController'
	};
	
});
