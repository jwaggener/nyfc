var nyfc = angular.module('nyfcApp');

var FormattingOptions = {
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
	};

function NyfcCanvasService(){
	
	var name, color, lightness;
	var canvas, context,
		multiplier, dimension;
	
	multiplier = 3;
	dimension = 125 * multiplier;
	canvas = document.createElement('canvas');
	canvas.height = canvas.width = dimension;
	context = canvas.getContext('2d');
	
	function getNyfcCanvas(_name_, _color_, _lightness_){
		name = _name_;
		color = _color_;
		lightness = _lightness_;
		//build the canvas
		multiplier = 3;
		dimension = 125 * multiplier;
		canvas = document.createElement('canvas');
		canvas.height = canvas.width = dimension;
		context = canvas.getContext('2d');
		// draw the color
		context.fillStyle = color;
		context.fillRect(0, 0, dimension, dimension);
		// set styles for the drawing of the text
		setContextStyles(name, lightness);
		// draw it!
		drawText(name);
		return canvas;
	}
	
	function drawText(name){
		var nodes = getNodes(name),
			breaks = getBreaks(nodes, [dimension-15], 24);

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
			drawLine(lines[k], y);
			k--;
			y -= context.lineheight;
		}
		
	};
	
	function drawLine(line, y) {
		var x = 15;

		line.nodes.forEach(function (node, index, array) {
			if (node.type === 'box') {
				context.fillText(node.value, x, y);
				x += node.width;
			} else if (node.type === 'glue') {
				x += node.width + line.ratio * (line.ratio < 0 ? node.shrink : node.stretch);
			} else if (node.type === 'penalty' && node.penalty === 100 && index === array.length - 1) {
				context.fillText('-', x, y);
			}
		});
		
	};
	
	//choose a size for font and lineheight based on properties of the string
	function selectSize(str) {
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
	
	//returns a color for the text with a tone that will look good against the background color
	function getColor(lightness){
		return ( lightness > 0.85) ? '#191919' : '#ffffff';
	};
	
	// 'background-color:rgb(255, 255, 255);color:#191919;font:bold 20px sans-serif;line-height:16.25px';
	function getStyleString(str, rgbcolor, lightness){
		str = str || '';
		var size = selectSize(str);
		return 'background-color:' + rgbcolor + ';' +
		'color:' + getColor(lightness) + ';' +
		'font:' + 'bold ' + size.fontSize + 'px ' + 'sans-serif;' + 
		'line-height:' + size.lineheight + 'px' + ';';
	};
	
	//set the styles on the 2d context of the canvas based on the string
	function setContextStyles(str, lightness) {
		var size;
		context.textAlign = 'left';
		context.textBaseline = 'bottom';
		context.fillStyle = getColor(lightness);
		
		size = selectSize(str);
		context.font = 'bold ' + size.fontSize * multiplier + 'px sans-serif';
		context.lineheight = size.lineheight * multiplier;	
	};
	
	// uses vendor library Typeset to retrieve the number of nodes for a given string
	// center, justify, and left are the options available
	// nodes is an array of objects
	function getNodes(str, orientation){
		var format,
			orientation = orientation || 'left';
		//pass in  string that measures text
		format = Typeset.formatter(function (str) {
			return context.measureText(str).width;
		});
		return format['left'](str);
	};
	
	//use Typeset to get the linebreaks
	//linelengths is always an array : [$scope.dimension - padding]
	function getBreaks(nodes, linelengths, tolerance){
		var breaks = Typeset.linebreak(nodes, linelengths, {tolerance: tolerance});
		//my hack. sometimes no breaks. dunno why
		if (breaks.length === 0) {
			breaks = [{position:0, ratio: 0}, {position:4, ratio: 13}];
		}
		return breaks;
	}
	
	return {
		getNyfcCanvas: getNyfcCanvas,
		canvas: canvas,
		context: context,
		selectSize: selectSize,
		getColor: getColor,
		getStyleString: getStyleString,
		setContextStyles: setContextStyles,
		getNodes: getNodes
	};
}

nyfc.service('NyfcCanvasService', NyfcCanvasService);
