'use strict';

//this is a wrapper for the spectrum color picker.
angular.module('nyfcApp')
	.directive('nyfcCanvas', function(){
		return {
			restrict: 'EA',
			replace: false,
			link: function ($scope, element, attrs) {
				
				$scope.five_words_or_less_ten_chars_or_less = function (ctx, arr, lightness) {
					
					var sizes = {
						extrasmall: {
							size: 'extrasmall',
							fontSize: 12.25,
							lineheight: 12.25
						},
						small: {
							size: 'small',
							fontSize: 16.25,
							lineheight: 16.25
						},
						medium: {
							size: 'medium',
							fontSize: 20,
							lineheight: 20
						},
						large: {
							size: 'large',
							fontSize: 30,
							lineheight: 30
						},
						xlarge: {
							size: 'xlarge',
							fontSize: 36,
							lineheight: 36
						}
					};
					
					ctx.font = 'bold 18px sans-serif'
					ctx.textAlign = 'left';
					ctx.textBaseline = 'bottom';
					ctx.fillStyle = ( lightness > .85 ) ? '#191919' : '#ffffff';
					var min = _.min(arr),
						max = (_.max(arr, function(str){return str.length;})).length,
						size,
						i = arr.length,
						x = 5,
						y = 120;
					
					if ( max >= 16 ) {
						size = sizes.extrasmall;
					} else if( max >= 10 ) {
						size = sizes.small;
					} else if ( max >= 7 && max < 10 || i > 3) {
						size = sizes.medium;
					} else if ( max >= 4 && max < 7  ) {
						size = sizes.large;
					} else {
						size = sizes.xlarge;
					}
					
					while ( i > 0 ) {
						i--;
						ctx.font = 'bold ' + size.fontSize  + 'px sans-serif'
						ctx.fillText(arr[i], x, y);
						y -= size.lineheight;
					}
				}
				
				$scope.updateCanvas = function (nyfcobj) {
					var canvas, dimension, ctx, img,
						arr = nyfcobj.name.split(' '),
						max = (_.max(arr, function(str){return str.length;})).length;

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

					dimension = 125;
					canvas = document.createElement('canvas');
					canvas.height = canvas.width = dimension;
					ctx = canvas.getContext('2d');
					ctx.fillStyle = nyfcobj.color;
					ctx.fillRect(0,0,dimension,dimension);

					$scope.five_words_or_less_ten_chars_or_less(ctx, arr, nyfcobj.l);


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
	});