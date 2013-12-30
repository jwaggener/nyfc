'use strict';

//this is a wrapper for the spectrum color picker.
angular.module('nyfcApp')
	.directive('nyfcCanvas', ['NyfcStyles', function(NyfcStyles){
		return {
			restrict: 'EA',
			replace: true,
			link: function ($scope, element, attrs) {
				
				// the canvas 2D context object to draw to
				// an array o fstrings
				// lightness value from 0-1
				$scope.drawCanvas = function (ctx, arr, lightness) {
					
					var size,
						multiplier = 3,
						stylesObj = NyfcStyles.stylesFromArr(arr, lightness, multiplier),
						i = arr.length,
						x = 5 * multiplier,
						y = 120 * multiplier;
					
					ctx.font = stylesObj.font;
					ctx.textAlign = stylesObj.textAlign;
					ctx.textBaseline = stylesObj.textBaseline;
					ctx.fillStyle = stylesObj.color;
					
					while ( i > 0 ) {
						i--;
						ctx.fillText(arr[i], x, y);
						y -= stylesObj.lineheight;
					}
					
				}
				
				$scope.updateCanvas = function (nyfcobj) {
					var canvas, dimension, ctx, img,
						multiplier = 3,
						arr = nyfcobj.name.split(' '),
						max = (_.max(arr, function(str){return str.length;})).length;
						
					// heuristics. looking at grouping short words together on a line
					if ( max <= 3 ) {
						var lessThan,
							i = 0,
							newArr = [];
						while (i < arr.length) {
							if (i !== arr.length-1) {
								lessThan = ((arr[i].length <= 3) && (arr[i+1].length <= 3));
							}
							if (lessThan) {
								newArr.push(arr[i] + ' ' + arr[i+1]);
								i = i + 2;
							} else {
								newArr.push(arr[i]);
								i++;
							}
						}
						arr = newArr;
					};

					dimension = 125 * multiplier;
					canvas = document.createElement('canvas');
					canvas.height = canvas.width = dimension;
					ctx = canvas.getContext('2d');
					ctx.fillStyle = nyfcobj.color;
					ctx.fillRect(0,0,dimension,dimension);

					$scope.drawCanvas(ctx, arr, nyfcobj.l);
					
					// DOM manipulation
					img = new Image();
					$(img).attr('title', 'Right-click to download.');
					img.src = canvas.toDataURL("image/png");
					$(element[0]).find('.shim').remove();
					$(element[0]).prepend(img);
				}

				$scope.$watch(attrs.nyfcobj, function(newValue, oldValue){
					if (newValue) {
						$scope.updateCanvas(newValue);
					}
				}, true);
			}
		}
		
	}]);