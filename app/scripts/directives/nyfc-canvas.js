//this is a wrapper for the spectrum color picker.
angular.module('nyfcApp')
	.directive('nyfcCanvas', ['NyfcStyles', function(NyfcStyles){
		return {
			restrict: 'EA',
			replace: true,
			link: function ($scope, element, attrs) {
				
				$scope.drawText = function(context, nodes, breaks, lineLengths, lineHeight, center) {
					var i = 0, lines = [], point, j, r, lineStart = 0, y = 360, maxLength = Math.max.apply(null, lineLengths);

					// Iterate through the line breaks, and split the nodes at the
					// correct point.
					for (i = 1; i < breaks.length; i += 1) {
						point = breaks[i].position,
						r = breaks[i].ratio;

						for (j = lineStart; j < nodes.length; j += 1) {
							// After a line break, we skip any nodes unless they are boxes or forced breaks.
							if (nodes[j].type === 'box' || (nodes[j].type === 'penalty' && nodes[j].penalty === -Typeset.linebreak.infinity)) {
								lineStart = j;
								break;
							}
						}
						lines.push({ratio: r, nodes: nodes.slice(lineStart, point + 1), position: point});
						lineStart = point;
					}
					
					i = lines.length-1;
					
					var drawLine = function (line, lineIndex) {
						var x = 15, lineLength = lineIndex < lineLengths.length ? lineLengths[lineIndex] : lineLengths[lineLengths.length - 1];

						if (center) {
							x += (maxLength - lineLength) / 2;
						}

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
					
					while (i >= 0) {
						drawLine(lines[i], i);
						i--;
						y -= lineHeight;
					}
					
					//lines.forEach();
				};
				
				// this takes a context, string, array of lineLengths, tolerance, and center
				// and lays out the text
				$scope.align = function(ctx, str, stylesObj, lineLengths, tolerance, center) {
					var   context = ctx,
                    format, nodes, breaks;
					if (context) {
						context.textBaseline = 'bottom';
						//context.font = "44px 'times new roman', 'FreeSerif', serif";

						format = Typeset.formatter(function (str) {
							return context.measureText(str).width;
						});

						nodes = format['left'](str);

						breaks = Typeset.linebreak(nodes, lineLengths, {tolerance: tolerance});
						
						//my hack. sometimes no breaks. dunno why
						if (breaks.length === 0) {
							breaks = [{position:0, ratio: 0}, {position:4, ratio: 13}];
						}
						$scope.drawText(context, nodes, breaks, lineLengths, stylesObj.lineheight, center);
						/* if (breaks.length !== 0) {
							$scope.drawText(context, nodes, breaks, lineLengths, center);
						} else {
							context.fillText('Paragraph can not be set with the given tolerance.', 0, 0);
						} */
					}
					return [];
				};
				
				// the canvas 2D context object to draw to
				// a string
				// lightness value from 0-1
				$scope.drawCanvas = function (ctx, dimension, str, lightness) {

					var multiplier = 3,
						stylesObj = NyfcStyles.stylesFromArr(str.split(' '), lightness, multiplier);
					
					ctx.font = stylesObj.font;
					ctx.textAlign = stylesObj.textAlign;
					ctx.textBaseline = stylesObj.textBaseline;
					ctx.fillStyle = stylesObj.color;

					$scope.align(ctx, str, stylesObj, [dimension], 24);
					
				};
				
				$scope.updateCanvas = function (nyfcobj) {
					var canvas, dimension, ctx, img,
						multiplier = 3;

					dimension = 125 * multiplier;
					//create the canvas
					canvas = document.createElement('canvas');
					canvas.height = canvas.width = dimension;
					ctx = canvas.getContext('2d');
					ctx.fillStyle = nyfcobj.color;
					ctx.fillRect(0,0,dimension,dimension);

					$scope.drawCanvas(ctx, dimension-15, nyfcobj.name, nyfcobj.l);
					
					// DOM manipulation
					img = new Image();
					$(img).attr('title', 'Right-click to download.');
					img.src = canvas.toDataURL("image/png");
					// can have a shim that maintains a consistent height and prevents the DOM from jumping
					$(element[0]).find('.shim').remove();
					$(element[0]).prepend(img);
				};

				$scope.$watch(attrs.nyfcobj, function(newValue, oldValue){
					if (newValue) {
						$scope.updateCanvas(newValue);
					}
				}, true);
			}
		};
		
	}]);